import { LoanStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { calculateTotalExpected } from "@/lib/calculations";

const loanSchema = z.object({
  lenderId: z.string().cuid(),
  amount: z.coerce.number().positive(),
  roi: z.coerce.number().min(0),
  startDate: z.string(),
  periodMonths: z.coerce.number().int().positive(),
  status: z.nativeEnum(LoanStatus).default(LoanStatus.ACTIVE)
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lenderId = searchParams.get("lenderId");
    const q = searchParams.get("q");

    const loans = await db.loan.findMany({
      where: {
        ...(lenderId ? { lenderId } : {}),
        ...(q
          ? {
              lender: {
                name: { contains: q, mode: "insensitive" }
              }
            }
          : {})
      },
      include: {
        lender: true,
        installments: true
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(loans);
  } catch {
    return NextResponse.json({ message: "Failed to load loans" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = loanSchema.parse(await req.json());
    const totalExpected = calculateTotalExpected(body.amount, body.roi, body.periodMonths);

    const loan = await db.loan.create({
      data: {
        lenderId: body.lenderId,
        amount: body.amount,
        roi: body.roi,
        startDate: new Date(body.startDate),
        periodMonths: body.periodMonths,
        totalExpected,
        status: body.status
      }
    });

    return NextResponse.json(loan, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid loan payload", issues: error.issues }, { status: 400 });
    }

    return NextResponse.json({ message: "Failed to create loan" }, { status: 500 });
  }
}
