import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { convertInquiryToDeal } from "@/lib/inquiries";

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const result = await convertInquiryToDeal(id, session.user.id);
    revalidatePath("/studio");
    revalidatePath("/studio/deals");
    revalidatePath("/studio/inquiries");
    return NextResponse.json({ ok: true, ...result });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not convert inquiry" }, { status: 400 });
  }
}
