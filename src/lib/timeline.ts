import { StoredShare, TimelineItem } from "./types";

export function buildPreview(share: StoredShare): string {
  if (share.passwordHash) {
    return "受密码保护";
  }
  let text = share.content.replace(/\r\n/g, "\n");
  text = text.replace(/!\[[^\]]*]\(data:image\/[^)]+\)/g, "[图片]");
  text = text.replace(/data:image\/[^)]+/g, "[图片]");
  text = text.replace(/\s+/g, " ").trim();
  if (!text) {
    return "空内容";
  }
  const max = 140;
  if (text.length > max) {
    return `${text.slice(0, max)}...`;
  }
  return text;
}

export function toTimelineItem(share: StoredShare): TimelineItem {
  return {
    id: share.id,
    type: share.type,
    createdAt: share.createdAt,
    preview: buildPreview(share),
    hasPassword: Boolean(share.passwordHash),
    burnAfterRead: share.burnAfterRead,
    maxReads: share.maxReads,
    ttl: share.ttl,
  };
}
