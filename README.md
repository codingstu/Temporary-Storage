# NoteShare Lite

临时文本与图片分享中转站，专注短期存储与安全分享。基于 Next.js + Vercel KV，支持密码、访问次数、阅后即焚与自动过期。

## 功能概览

- Markdown/纯文本/代码片段统一编辑
- Base64 图片内嵌（无额外对象存储）
- 访问密码、最大访问次数与阅后即焚
- 自动过期与手动删除

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开 http://localhost:3000

## 环境变量

本地开发可复制 `.env.example` 为 `.env.local`。线上部署请在 Vercel 环境变量中配置（Vercel KV 实际上就是 Upstash Redis 的 REST 变量）。

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# Vercel KV / Upstash Redis（二选一，通常 Vercel 会提供 Upstash Redis 变量）
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
UPSTASH_REDIS_REST_READ_ONLY_TOKEN=
```

## 主要命令

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run test:e2e
```

## API 简述

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | /api/share | 创建分享 |
| GET | /api/share/:id | 获取分享 |
| DELETE | /api/share/:id | 删除分享 |

更多细节参考 [docs/api.md](docs/api.md)。

## 文档

- 架构概览: [docs/architecture.md](docs/architecture.md)
- Agent 规范: [docs/agent.md](docs/agent.md)

## 许可证

MIT License
