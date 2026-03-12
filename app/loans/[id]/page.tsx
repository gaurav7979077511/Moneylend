"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressBar } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { calculateCompletion } from "@/lib/calculations";

type Loan = {
  id: string;
  amount: number;
  totalExpected: number;
  roi: number;
  periodMonths: number;
  startDate: string;
  status: "ACTIVE" | "COMPLETED" | "OVERDUE";
  lender: { name: string; phone: string };
  installments: { id: string; amount: number; receivedDate: string }[];
};

export default function LoanDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [loan, setLoan] = useState<Loan | null>(null);

  useEffect(() => {
    fetch(`/api/loans/${id}`).then((r) => r.json()).then(setLoan);
  }, [id]);

  if (!loan) return <div className="glass animate-pulse rounded-xl2 p-6">Loading loan details...</div>;

  const received = loan.installments.reduce((sum, i) => sum + Number(i.amount), 0);
  const completion = calculateCompletion(Number(loan.totalExpected), received);

  return (
    <GlassCard>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{loan.lender.name}</h1>
        <StatusBadge status={loan.status} />
      </div>
      <p className="text-sm text-slate-500">Phone: {loan.lender.phone}</p>
      <p className="mt-2">Principal: ${Number(loan.amount).toLocaleString()}</p>
      <p>Total expected: ${Number(loan.totalExpected).toLocaleString()}</p>
      <p>ROI: {Number(loan.roi)}% • Period: {loan.periodMonths} months</p>
      <div className="mt-4 space-y-2">
        <p className="text-sm font-medium">Repayment Progress ({completion}%)</p>
        <ProgressBar value={completion} />
      </div>
      <h2 className="mt-6 mb-2 font-semibold">Installment History</h2>
      <div className="space-y-2">
        {loan.installments.map((ins) => (
          <div key={ins.id} className="flex items-center justify-between rounded-lg border border-white/60 bg-white/70 p-3 text-sm">
            <span>{new Date(ins.receivedDate).toLocaleDateString()}</span>
            <span>${Number(ins.amount).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
