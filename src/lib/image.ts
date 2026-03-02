export async function imageFileToMarkdown(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("仅支持图片文件");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("图片大小不能超过 5MB");
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("图片读取失败"));
    reader.readAsDataURL(file);
  });

  const alt = file.name.replace(/\.[^/.]+$/, "");
  return `![${alt}](${dataUrl})`;
}
