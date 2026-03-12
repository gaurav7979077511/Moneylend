import { LoanStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const loanSchema = z.object({
  status: z.nativeEnum(LoanStatus)
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const loan = await db.loan.findUnique({
      where: { id: params.id },
      include: { lender: true, installments: true }
    });

    if (!loan) return NextResponse.json({ message: "Loan not found" }, { status: 404 });
    return NextResponse.json(loan);
  } catch {
    return NextResponse.json({ message: "Failed to load loan" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = loanSchema.parse(await req.json());
    const loan = await db.loan.update({ where: { id: params.id }, data: body });
    return NextResponse.json(loan);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid loan payload", issues: error.issues }, { status: 400 });
    }

    return NextResponse.json({ message: "Failed to update loan" }, { status: 500 });
  }
}
