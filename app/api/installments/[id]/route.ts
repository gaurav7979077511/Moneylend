import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await db.installment.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Failed to delete installment" }, { status: 500 });
  }
}
