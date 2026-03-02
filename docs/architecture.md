# 架构概览

## 技术栈

- Next.js App Router
- TypeScript
- TailwindCSS
- Vercel KV

## 核心流程

1. 前端提交分享内容（文本/Markdown/代码/图片内嵌）
2. API 校验并写入 Vercel KV，设置 TTL
3. 读取时校验密码与访问次数
4. 命中阅后即焚则立即删除

## 数据模型

```
StoredShare {
  id
  content
  type
  passwordHash
  passwordSalt
  maxReads
  ttl
  burnAfterRead
  createdAt
}
```

## 存储策略

- 所有内容均写入 KV
- 依赖 KV TTL 自动过期
- 访问次数通过独立计数键控制
