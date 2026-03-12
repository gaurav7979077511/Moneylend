import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const lenderSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  address: z.string().optional(),
  notes: z.string().optional()
});

export async function GET() {
  try {
    const lenders = await db.lender.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(lenders);
  } catch {
    return NextResponse.json({ message: "Failed to load lenders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = lenderSchema.parse(await req.json());
    const lender = await db.lender.create({ data: body });
    return NextResponse.json(lender, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid lender payload", issues: error.issues }, { status: 400 });
    }

    return NextResponse.json({ message: "Failed to create lender" }, { status: 500 });
  }
}
