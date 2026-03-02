import { NextRequest, NextResponse } from "next/server";
import { getTimelineShares } from "@/lib/storage";
import { toTimelineItem } from "@/lib/timeline";

export async function GET(request: NextRequest) {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return NextResponse.json(
      {
        error:
          "缺少 KV_REST_API_URL 或 KV_REST_API_TOKEN，请先在 .env.local 配置 Vercel KV",
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
