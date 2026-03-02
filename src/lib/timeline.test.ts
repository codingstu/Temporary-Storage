import { describe, expect, it } from "vitest";
import { buildPreview } from "./timeline";
import { StoredShare } from "./types";

const baseShare: StoredShare = {
  id: "abc",
  content: "hello world",
  type: "text",
  ttl: 3600,
  burnAfterRead: false,
  createdAt: 1700000000000,
};

describe("buildPreview", () => {
  it("returns protected label when password is set", () => {
    const preview = buildPreview({ ...baseShare, passwordHash: "x" });
    expect(preview).toBe("受密码保护");
  });

  it("replaces embedded images", () => {
    const preview = buildPreview({
      ...baseShare,
      content: "![a](data:image/png;base64,AAAA)",
    });
    expect(preview).toBe("[图片]");
  });
});
