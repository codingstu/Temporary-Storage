"use client";

import { useCallback, useMemo, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { imageFileToMarkdown } from "@/lib/image";
import { ShareInput, ShareType, TtlOption } from "@/lib/types";

const ttlOptions: { label: string; value: TtlOption }[] = [
  { label: "5分钟", value: 300 },
  { label: "30分钟", value: 1800 },
  { label: "1小时", value: 3600 },
  { label: "2小时", value: 7200 },
  { label: "1天", value: 86400 },
  { label: "7天", value: 604800 },
];

interface ShareEditorProps {
  onSubmit: (input: ShareInput) => Promise<void>;
  isSubmitting: boolean;
}

export function ShareEditor({ onSubmit, isSubmitting }: ShareEditorProps) {
  const [content, setContent] = useState("");
  const [type, setType] = useState<ShareType>("markdown");
  const [password, setPassword] = useState("");
  const [maxReads, setMaxReads] = useState("");
  const [ttl, setTtl] = useState<TtlOption>(3600);
  const [burnAfterRead, setBurnAfterRead] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payload = useMemo<ShareInput>(
    () => ({
      content,
      type,
      password: password.trim() ? password : undefined,
      maxReads: maxReads.trim() ? Number(maxReads) : undefined,
      ttl,
      burnAfterRead,
    }),
    [content, type, password, maxReads, ttl, burnAfterRead],
  );

  const handleImageUpload = useCallback(async (file: File) => {
    const markdown = await imageFileToMarkdown(file);
    setContent((prev) => (prev ? `${prev}\n\n${markdown}` : markdown));
  }, []);

  const handleSubmit = async () => {
    setError(null);
    if (!content.trim()) {
      setError("内容不能为空");
      return;
    }
    if (maxReads && (!Number.isInteger(Number(maxReads)) || Number(maxReads) < 1)) {
      setError("最大访问次数需为正整数");
      return;
    }
    await onSubmit(payload);
  };

  return (
    <div className="w-full max-w-4xl rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-zinc-900">临时分享</span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value as ShareType)}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm"
          >
            <option value="markdown">Markdown</option>
            <option value="text">纯文本</option>
            <option value="code">代码</option>
          </select>
        </div>
        <label className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white">
          上传图片
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                handleImageUpload(file).catch((uploadError) => {
                  setError(uploadError instanceof Error ? uploadError.message : "图片上传失败");
                });
              }
            }}
          />
        </label>
      </div>

      <div className="px-6 py-4">
        {type === "markdown" ? (
          <div data-color-mode="light">
            <MDEditor value={content} onChange={(value) => setContent(value || "")} height={360} />
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="min-h-[360px] w-full resize-y rounded-xl border border-zinc-200 p-4 font-mono text-sm text-zinc-900 outline-none"
            placeholder={type === "code" ? "输入代码片段..." : "输入文本内容..."}
          />
        )}
      </div>

      <div className="border-t border-zinc-100 bg-zinc-50 px-6 py-5">
        <div className="mb-4 text-sm font-semibold text-zinc-900">分享设置</div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">访问密码</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="可选"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">最大访问次数</label>
            <input
              type="number"
              min={1}
              value={maxReads}
              onChange={(event) => setMaxReads(event.target.value)}
              placeholder="可选"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">过期时间</label>
            <select
              value={ttl}
              onChange={(event) => setTtl(Number(event.target.value) as TtlOption)}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
            >
              {ttlOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input
              id="burnAfterRead"
              type="checkbox"
              checked={burnAfterRead}
              onChange={(event) => setBurnAfterRead(event.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900"
            />
            <label htmlFor="burnAfterRead" className="text-sm text-zinc-700">
              阅后即焚
            </label>
          </div>
        </div>
        {error && <div className="mt-3 text-sm text-red-500">{error}</div>}
      </div>

      <div className="border-t border-zinc-100 px-6 py-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isSubmitting ? "生成中..." : "生成分享链接"}
        </button>
      </div>
    </div>
  );
}
