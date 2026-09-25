import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

/**
 * Prefer Vercel Blob when BLOB_READ_WRITE_TOKEN is set (production).
 * Fall back to local public/uploads for local/dev without Blob.
 */
export async function storeUpload(
  file: File | Buffer,
  options: {
    fileName: string;
    contentType?: string | null;
    folder?: string;
  },
): Promise<{ url: string; sizeBytes: number }> {
  const bytes =
    file instanceof Buffer ? file : Buffer.from(await (file as File).arrayBuffer());
  const folder = options.folder || "uploads";
  const safeBase = options.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `${folder}/${randomUUID()}-${safeBase}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(key, bytes, {
      access: "public",
      contentType: options.contentType || undefined,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return { url: blob.url, sizeBytes: bytes.length };
  }

  const dir = path.join(process.cwd(), "public", folder);
  await mkdir(dir, { recursive: true });
  const localName = `${randomUUID()}-${safeBase}`;
  await writeFile(path.join(dir, localName), bytes);
  return { url: `/${folder}/${localName}`, sizeBytes: bytes.length };
}
