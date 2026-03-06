import { createClient } from "@vercel/kv";

const kvUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const kvWriteToken =
  process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const kvReadToken =
  process.env.KV_REST_API_READ_ONLY_TOKEN ??
  process.env.UPSTASH_REDIS_REST_READ_ONLY_TOKEN;

export const kvReadConfigured = Boolean(kvUrl && (kvWriteToken || kvReadToken));
export const kvWriteConfigured = Boolean(kvUrl && kvWriteToken);

const kvReadClient = kvReadConfigured
  ? createClient({
      url: kvUrl as string,
      token: (kvWriteToken ?? kvReadToken) as string,
    })
  : null;

const kvWriteClient = kvWriteConfigured
  ? createClient({
      url: kvUrl as string,
      token: kvWriteToken as string,
    })
  : null;

export function getKvReadClient() {
  if (!kvReadClient) {
    throw new Error("KV 未配置读权限");
  }
  return kvReadClient;
}

export function getKvWriteClient() {
  if (!kvWriteClient) {
    throw new Error("KV 未配置写权限");
  }
  return kvWriteClient;
}
