# API 说明

## 创建分享

POST `/api/share`

请求体

```json
{
  "content": "string",
  "type": "text | markdown | code",
  "password": "string?",
  "maxReads": 3,
  "ttl": 3600,
  "burnAfterRead": false
}
```

响应

```json
{
  "data": {
    "id": "string",
    "url": "string",
    "expiresAt": "string"
  }
}
```

## 获取分享

GET `/api/share/:id`

可选请求头

```
x-share-password: your-password
```

响应

```json
{
  "data": {
    "id": "string",
    "content": "string",
    "type": "text | markdown | code",
    "maxReads": 3,
    "ttl": 3600,
    "burnAfterRead": false,
    "createdAt": 1710000000000
  }
}
```

## 删除分享

DELETE `/api/share/:id`

可选请求头

```
x-share-password: your-password
```

## 最新内容流

GET `/api/timeline?limit=12`

响应

```json
{
  "data": [
    {
      "id": "string",
      "type": "text | markdown | code",
      "createdAt": 1710000000000,
      "preview": "string",
      "hasPassword": false,
      "burnAfterRead": false,
      "maxReads": 3,
      "ttl": 3600
    }
  ]
}
```
