import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { storeUpload } from "@/lib/storage";

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

  try {
    const stored = await storeUpload(file, {
      fileName: file.name,
      contentType: file.type || null,
      folder: "uploads/deals",
    });

    const attachment = await prisma.attachment.create({
      data: {
        dealId,
        deliverableId,
        fileName: file.name,
        fileUrl: stored.url,
        mimeType: file.type || null,
        sizeBytes: stored.sizeBytes,
        kind,
      },
    });

    revalidatePath(`/studio/deals/${dealId}`);
    return NextResponse.json({ ok: true, attachment });
  } catch (error) {
    console.error("[uploads]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
