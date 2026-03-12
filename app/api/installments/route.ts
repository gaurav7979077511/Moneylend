import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const installmentSchema = z.object({
  loanId: z.string().cuid(),
  amount: z.coerce.number().positive(),
  receivedDate: z.string(),
  notes: z.string().optional()
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const loanId = searchParams.get("loanId");
    const installments = await db.installment.findMany({
      where: loanId ? { loanId } : undefined,
      include: { loan: { include: { lender: true, installments: true } } },
      orderBy: { receivedDate: "desc" }
    });

    return NextResponse.json(installments);
  } catch {
    return NextResponse.json({ message: "Failed to load installments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = installmentSchema.parse(await req.json());
    const installment = await db.installment.create({
      data: {
        loanId: body.loanId,
        amount: body.amount,
        receivedDate: new Date(body.receivedDate),
        notes: body.notes
      }
    });
    return NextResponse.json(installment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid installment payload", issues: error.issues }, { status: 400 });
    }

    return NextResponse.json({ message: "Failed to create installment" }, { status: 500 });
  }
}
