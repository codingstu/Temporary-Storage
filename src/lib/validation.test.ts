import { describe, expect, it } from "vitest";
import { validateShareInput } from "./validation";

describe("validateShareInput", () => {
  it("rejects empty content", () => {
    const error = validateShareInput({
      content: " ",
      type: "text",
      ttl: 3600,
      burnAfterRead: false,
    });
    expect(error).toBe("内容不能为空");
  });

  it("accepts valid payload", () => {
    const error = validateShareInput({
      content: "hello",
      type: "markdown",
      ttl: 3600,
      burnAfterRead: false,
      maxReads: 3,
    });
    expect(error).toBeNull();
  });
});
