import { ShareWorkspace } from "@/components/ShareWorkspace";
import { TimelineFeed } from "@/components/TimelineFeed";
import { getTimelineShares } from "@/lib/storage";
import { toTimelineItem } from "@/lib/timeline";
import { kvReadConfigured } from "@/lib/kv";

export default async function Home() {
  const hasKv = kvReadConfigured;
  const shares = hasKv ? await getTimelineShares(12) : [];
  const items = shares.map(toTimelineItem);
  const timelineError = hasKv
    ? null
    : "缺少 KV 环境变量，请在 Vercel 中配置 KV_REST_API_URL 与 KV_REST_API_TOKEN（或 Upstash Redis 变量）";

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="flex flex-col gap-3">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            NoteShare Lite
          </span>
          <h1 className="text-3xl font-semibold text-zinc-900">
            临时文本与图片分享中转站
          </h1>
          <p className="text-sm text-zinc-600">
            基于 Vercel KV，支持密码、访问次数、阅后即焚与自动过期。
          </p>
        </header>
        <ShareWorkspace />
        <TimelineFeed initialItems={items} initialError={timelineError} />
      </main>
    </div>
  );
}
