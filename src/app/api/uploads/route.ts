import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const dealId = String(form.get("dealId") || "");
  const deliverableId = String(form.get("deliverableId") || "") || null;
  const kind = String(form.get("kind") || "file");

  if (!(file instanceof File) || !dealId) {
    return NextResponse.json({ error: "file and dealId required" }, { status: 400 });
  }

  const deal = await prisma.deal.findFirst({
    where: { id: dealId, ownerId: session.user.id },
  });
  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fileName = `${randomUUID()}-${safeName}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileName), bytes);

  const attachment = await prisma.attachment.create({
    data: {
      dealId,
      deliverableId,
      fileName: file.name,
      fileUrl: `/uploads/${fileName}`,
      mimeType: file.type || null,
      sizeBytes: bytes.length,
      kind,
    },
  });

  revalidatePath(`/studio/deals/${dealId}`);
  return NextResponse.json({ ok: true, attachment });
}
