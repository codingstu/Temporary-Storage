import { NextRequest, NextResponse } from "next/server";
import { consumeShare, deleteShare, getShare } from "@/lib/storage";
import { verifyPassword } from "@/lib/security";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return NextResponse.json(
      {
        error:
          "缺少 KV_REST_API_URL 或 KV_REST_API_TOKEN，请先在 .env.local 配置 Vercel KV",
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
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return NextResponse.json(
      {
        error:
          "缺少 KV_REST_API_URL 或 KV_REST_API_TOKEN，请先在 .env.local 配置 Vercel KV",
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
