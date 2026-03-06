import crypto from "crypto";
import { ShareInput, StoredShare } from "./types";
import { hashPassword } from "./security";
import { getKvReadClient, getKvWriteClient } from "./kv";

const shareKey = (id: string) => `share:${id}`;
const readKey = (id: string) => `reads:${id}`;
const timelineKey = "timeline:latest";
const timelineMax = 100;

export function generateId(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

export async function createShare(input: ShareInput): Promise<StoredShare> {
  const id = generateId();
  const createdAt = Date.now();
  const { password, ...rest } = input;

  const stored: StoredShare = {
    id,
    content: rest.content,
    type: rest.type,
    maxReads: rest.maxReads,
    ttl: rest.ttl,
    burnAfterRead: rest.burnAfterRead,
    createdAt,
  };

  if (password) {
    const { hash, salt } = hashPassword(password);
    stored.passwordHash = hash;
    stored.passwordSalt = salt;
  }

  const kvWrite = getKvWriteClient();
  await kvWrite.set(shareKey(id), JSON.stringify(stored), { ex: rest.ttl });

  if (rest.maxReads) {
    await kvWrite.set(readKey(id), rest.maxReads, { ex: rest.ttl });
  }

  await kvWrite.lpush(timelineKey, id);
  await kvWrite.ltrim(timelineKey, 0, timelineMax - 1);

  return stored;
}

export async function getShare(id: string): Promise<StoredShare | null> {
  const kvRead = getKvReadClient();
  const data = await kvRead.get<string>(shareKey(id));
  if (!data) {
    return null;
  }
  return JSON.parse(data) as StoredShare;
}

export async function consumeShare(
  id: string,
  maxReads?: number,
  burnAfterRead?: boolean,
): Promise<{ remainingReads: number | null }> {
  const kvWrite = getKvWriteClient();
  if (maxReads) {
    const remaining = await kvWrite.decr(readKey(id));
    if (remaining <= 0) {
      await deleteShare(id);
      return { remainingReads: 0 };
    }
    if (burnAfterRead) {
      await deleteShare(id);
    }
    return { remainingReads: remaining };
  }

  if (burnAfterRead) {
    await deleteShare(id);
  }

  return { remainingReads: null };
}

export async function deleteShare(id: string): Promise<void> {
  const kvWrite = getKvWriteClient();
  await Promise.all([kvWrite.del(shareKey(id)), kvWrite.del(readKey(id))]);
}

export async function getTimelineShares(limit: number): Promise<StoredShare[]> {
  if (limit <= 0) {
    return [];
  }
  const kvRead = getKvReadClient();
  const ids = await kvRead.lrange<string>(timelineKey, 0, limit - 1);
  if (!ids.length) {
    return [];
  }
  const entries = await Promise.all(ids.map((id) => getShare(id)));
  return entries.filter((item): item is StoredShare => Boolean(item));
}
