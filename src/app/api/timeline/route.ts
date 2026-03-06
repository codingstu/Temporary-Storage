import { NextRequest, NextResponse } from "next/server";
import { getTimelineShares } from "@/lib/storage";
import { toTimelineItem } from "@/lib/timeline";
import { kvReadConfigured } from "@/lib/kv";

export async function GET(request: NextRequest) {
  if (!kvReadConfigured) {
    return NextResponse.json(
      {
        error:
          "缺少 KV 环境变量，请在 Vercel 中配置 KV_REST_API_URL 与 KV_REST_API_TOKEN（或 Upstash Redis 变量）",
      },
      { status: 500 },
    );
  }

  const limitParam = request.nextUrl.searchParams.get("limit");
  const parsed = limitParam ? Number(limitParam) : 10;
  const limit = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), 30) : 10;
  const shares = await getTimelineShares(limit);
  const items = shares.map(toTimelineItem);
  return NextResponse.json({ data: items });
}
