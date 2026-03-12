import { PrismaClient, LoanStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const lender = await prisma.lender.create({
    data: {
      name: "Apex Capital",
      phone: "+1 555-440-0092",
      address: "Market Street, SF",
      notes: "Preferred lender"
    }
  });

  await prisma.loan.create({
    data: {
      lenderId: lender.id,
      amount: 12000,
      roi: 9.5,
      startDate: new Date(),
      periodMonths: 12,
      totalExpected: 13140,
      status: LoanStatus.ACTIVE
    }
  });
}

main().finally(() => prisma.$disconnect());
