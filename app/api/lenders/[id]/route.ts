import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const lenderSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  address: z.string().optional(),
  notes: z.string().optional()
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = lenderSchema.parse(await req.json());
    const lender = await db.lender.update({ where: { id: params.id }, data: body });
    return NextResponse.json(lender);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid lender payload", issues: error.issues }, { status: 400 });
    }

    return NextResponse.json({ message: "Failed to update lender" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await db.lender.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Failed to delete lender" }, { status: 500 });
  }
}
