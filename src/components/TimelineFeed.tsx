"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { TimelineItem } from "@/lib/types";

const typeLabels: Record<TimelineItem["type"], string> = {
  text: "文本",
  markdown: "Markdown",
  code: "代码",
};

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleString("zh-CN", { hour12: false });
}

function formatTtl(ttl: number) {
  if (ttl >= 86400) {
    return `${Math.round(ttl / 86400)}天`;
  }
  if (ttl >= 3600) {
    return `${Math.round(ttl / 3600)}小时`;
  }
  return `${Math.round(ttl / 60)}分钟`;
}

interface TimelineFeedProps {
  initialItems: TimelineItem[];
  initialError?: string | null;
}

export function TimelineFeed({ initialItems, initialError }: TimelineFeedProps) {
  const [items, setItems] = useState<TimelineItem[]>(initialItems);
  const [status, setStatus] = useState<"idle" | "loading" | "error">(
    initialError ? "error" : "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError ?? null);

  const loadTimeline = useCallback(async () => {
    setStatus("loading");
    setErrorMessage(null);
    const response = await fetch("/api/timeline?limit=12");
    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: "加载失败" }));
      setErrorMessage(payload.error || "加载失败");
      setStatus("error");
      return;
    }
    const payload = await response.json();
    setItems(payload.data || []);
    setStatus("idle");
  }, []);

  const emptyState =
    status === "loading"
      ? "加载中..."
      : status === "error"
        ? errorMessage || "加载失败"
        : "暂时还没有内容，先发布第一条吧";

  return (
    <section className="flex w-full flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-lg font-semibold text-zinc-900">最新内容流</div>
          <div className="text-sm text-zinc-500">像时间线一样浏览最近的分享</div>
        </div>
        <button
          type="button"
          onClick={loadTimeline}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700"
        >
          刷新
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500">
          {emptyState}
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                <span className="rounded-full bg-zinc-900 px-2 py-1 text-white">
                  {typeLabels[item.type]}
                </span>
                <span>{formatTime(item.createdAt)}</span>
                {item.hasPassword && <span className="rounded-full bg-zinc-100 px-2 py-1">需密码</span>}
                {item.burnAfterRead && (
                  <span className="rounded-full bg-zinc-100 px-2 py-1">阅后即焚</span>
                )}
                {item.maxReads && (
                  <span className="rounded-full bg-zinc-100 px-2 py-1">
                    限{item.maxReads}次
                  </span>
                )}
                <span className="rounded-full bg-zinc-100 px-2 py-1">
                  {formatTtl(item.ttl)}
                </span>
              </div>
              <div className="text-sm text-zinc-800">{item.preview}</div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-zinc-400">#{item.id.slice(0, 8)}</div>
                <Link
                  href={`/s/${item.id}`}
                  className="text-sm font-medium text-zinc-900 underline"
                >
                  直接打开
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
