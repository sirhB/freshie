import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { auth } from "@/auth";

const MAX_BYTES = 12 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/jpg",
]);

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 12MB)" }, { status: 400 });
  }

  const mime = file.type || "application/octet-stream";
  if (!ALLOWED.has(mime) && !/\.(jpe?g|png|webp|gif)$/i.test(file.name)) {
    return NextResponse.json({ error: "Images only (jpg, png, webp, gif)" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name).replace(/[^.a-zA-Z0-9]/g, "") || ".jpg";
  const fileName = `${randomUUID()}${ext.startsWith(".") ? ext : `.${ext}`}`;
  const dir = path.join(process.cwd(), "public", "uploads", "site");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileName), bytes);

  return NextResponse.json({
    ok: true,
    url: `/uploads/site/${fileName}`,
    fileName: file.name,
    mimeType: mime,
    sizeBytes: bytes.length,
  });
}
