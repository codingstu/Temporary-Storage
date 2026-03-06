import { NextRequest, NextResponse } from "next/server";
import { createShare } from "@/lib/storage";
import { validateShareInput } from "@/lib/validation";
import { ShareInput } from "@/lib/types";
import { kvWriteConfigured } from "@/lib/kv";

export async function POST(request: NextRequest) {
  if (!kvWriteConfigured) {
    return NextResponse.json(
      {
        error:
          "缺少 KV 环境变量，请在 Vercel 中配置 KV_REST_API_URL 与 KV_REST_API_TOKEN（或 Upstash Redis 变量）",
      },
      { status: 500 },
    );
  }

  const payload = (await request.json().catch(() => null)) as ShareInput | null;
  if (!payload) {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const error = validateShareInput(payload);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const share = await createShare(payload);
  const origin = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
  const url = `${origin}/s/${share.id}`;
  const expiresAt = new Date(share.createdAt + share.ttl * 1000).toISOString();

  return NextResponse.json({
    data: {
      id: share.id,
      url,
      expiresAt,
    },
  });
}
