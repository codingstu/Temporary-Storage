import { ShareInput, ShareType, TtlOption } from "./types";

const allowedTypes: ShareType[] = ["text", "markdown", "code"];
const allowedTtls: TtlOption[] = [300, 1800, 3600, 7200, 86400, 604800];

export function validateShareInput(input: ShareInput): string | null {
  if (!input.content?.trim()) {
    return "内容不能为空";
  }
  if (!allowedTypes.includes(input.type)) {
    return "内容类型无效";
  }
  if (!allowedTtls.includes(input.ttl)) {
    return "过期时间无效";
  }
  if (input.maxReads !== undefined && input.maxReads !== null) {
    if (!Number.isInteger(input.maxReads) || input.maxReads < 1 || input.maxReads > 1000) {
      return "最大访问次数无效";
    }
  }
  if (input.content.length > 200000) {
    return "内容过大";
  }
  if (input.password && input.password.length > 128) {
    return "密码过长";
  }
  return null;
}
