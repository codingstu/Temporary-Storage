export type ShareType = "text" | "markdown" | "code";

export type TtlOption = 300 | 1800 | 3600 | 7200 | 86400 | 604800;

export interface ShareInput {
  content: string;
  type: ShareType;
  password?: string;
  maxReads?: number;
  ttl: TtlOption;
  burnAfterRead: boolean;
}

export interface StoredShare {
  id: string;
  content: string;
  type: ShareType;
  passwordHash?: string;
  passwordSalt?: string;
  maxReads?: number;
  ttl: TtlOption;
  burnAfterRead: boolean;
  createdAt: number;
}

export interface ShareResponse {
  id: string;
  url: string;
  expiresAt: string;
}

export interface TimelineItem {
  id: string;
  type: ShareType;
  createdAt: number;
  preview: string;
  hasPassword: boolean;
  burnAfterRead: boolean;
  maxReads?: number;
  ttl: TtlOption;
}
