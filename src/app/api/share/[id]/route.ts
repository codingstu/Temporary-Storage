import { NextRequest, NextResponse } from "next/server";
import { consumeShare, deleteShare, getShare } from "@/lib/storage";
import { verifyPassword } from "@/lib/security";
import { kvWriteConfigured } from "@/lib/kv";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!kvWriteConfigured) {
    return NextResponse.json(
      {
        error:
          "缺少 KV 环境变量，请在 Vercel 中配置 KV_REST_API_URL 与 KV_REST_API_TOKEN（或 Upstash Redis 变量）",
      },
      { status: 500 },
    );
  }

  const { id } = await params;
  const share = await getShare(id);
  if (!share) {
    return NextResponse.json({ error: "分享不存在或已过期" }, { status: 404 });
  }

  if (share.passwordHash && share.passwordSalt) {
    const provided = request.headers.get("x-share-password") || "";
    const ok = verifyPassword(provided, share.passwordHash, share.passwordSalt);
    if (!ok) {
      return NextResponse.json({ error: "需要密码或密码错误" }, { status: 401 });
    }
  }

  await consumeShare(id, share.maxReads, share.burnAfterRead);

  return NextResponse.json({ data: share });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!kvWriteConfigured) {
    return NextResponse.json(
      {
        error:
          "缺少 KV 环境变量，请在 Vercel 中配置 KV_REST_API_URL 与 KV_REST_API_TOKEN（或 Upstash Redis 变量）",
      },
      { status: 500 },
    );
  }

  const { id } = await params;
  const share = await getShare(id);
  if (!share) {
    return NextResponse.json({ error: "分享不存在或已过期" }, { status: 404 });
  }

  if (share.passwordHash && share.passwordSalt) {
    const provided = request.headers.get("x-share-password") || "";
    const ok = verifyPassword(provided, share.passwordHash, share.passwordSalt);
    if (!ok) {
      return NextResponse.json({ error: "需要密码或密码错误" }, { status: 401 });
    }
  }

  await deleteShare(id);
  return NextResponse.json({ data: { id } });
}
