import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { storeUpload } from "@/lib/storage";

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

  try {
    const stored = await storeUpload(file, {
      fileName: file.name,
      contentType: mime,
      folder: "uploads/site",
    });
    return NextResponse.json({
      ok: true,
      url: stored.url,
      fileName: file.name,
      mimeType: mime,
      sizeBytes: stored.sizeBytes,
    });
  } catch (error) {
    console.error("[site/media]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
