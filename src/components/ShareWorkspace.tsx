"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ShareEditor } from "@/components/ShareEditor";
import { ShareInput, ShareResponse } from "@/lib/types";

export function ShareWorkspace() {
  const [result, setResult] = React.useState<ShareResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (input: ShareInput) => {
    setIsSubmitting(true);
    setError(null);
    const response = await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: "创建失败" }));
      setError(payload.error || "创建失败");
      setIsSubmitting(false);
      return;
    }

    const payload = await response
      .json()
      .catch(() => ({ error: "创建成功但返回内容为空" }));
    if (!payload?.data?.url) {
      setError(payload?.error || "创建成功但未返回分享链接，请稍后重试");
      setIsSubmitting(false);
      return;
    }

    setResult(payload.data);
    setIsSubmitting(false);
    router.push(payload.data.url);
  };

  return (
    <div className="flex flex-col gap-6">
      <ShareEditor onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {result && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="text-sm text-zinc-500">已为你跳转到分享页</div>
          <div className="mt-2 text-xs text-zinc-500">过期时间：{result.expiresAt}</div>
        </div>
      )}
    </div>
  );
}
