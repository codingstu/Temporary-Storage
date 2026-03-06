"use client";

import { useCallback, useMemo, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-markdown-preview/markdown.css";
import { StoredShare } from "@/lib/types";

interface ShareViewerProps {
  id: string;
}

export function ShareViewer({ id }: ShareViewerProps) {
  const [share, setShare] = useState<StoredShare | null>(null);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadShare = useCallback(async () => {
    if (!id) {
      setErrorMessage("分享链接无效，请重新生成");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMessage(null);
    const response = await fetch(`/api/share/${id}`, {
      headers: password ? { "x-share-password": password } : {},
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: "加载失败" }));
      setErrorMessage(payload.error || "加载失败");
      setStatus("error");
      return;
    }

    const payload = await response.json();
    setShare(payload.data);
    setStatus("idle");
  }, [id, password]);

  const renderBody = useMemo(() => {
    if (!share) return null;
    if (share.type === "markdown") {
      return (
        <div data-color-mode="light" className="rounded-xl border border-zinc-200 bg-white p-6">
          <MDEditor.Markdown source={share.content} />
        </div>
      );
    }
    if (share.type === "code") {
      return (
        <pre className="rounded-xl border border-zinc-200 bg-zinc-900 p-6 text-sm text-zinc-100">
          <code>{share.content}</code>
        </pre>
      );
    }
    return (
      <div className="whitespace-pre-wrap rounded-xl border border-zinc-200 bg-white p-6 text-sm">
        {share.content}
      </div>
    );
  }, [share]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-semibold text-zinc-900">查看分享内容</div>
            <div className="text-sm text-zinc-500">
              {share ? "内容已加载" : "请输入密码后查看内容"}
            </div>
          </div>
          <div className="flex w-full items-center gap-2 md:w-auto">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="如有密码请填写"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm md:w-56"
            />
            <button
              type="button"
              onClick={loadShare}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white"
            >
              {status === "loading" ? "加载中" : "查看"}
            </button>
          </div>
        </div>
        {errorMessage && <div className="mt-4 text-sm text-red-500">{errorMessage}</div>}
      </div>

      {renderBody}
    </div>
  );
}
