"use client";

import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProgressBar } from "@/components/ui/progress";
import { calculateCompletion, calculateRemaining } from "@/lib/calculations";

type Loan = {
  id: string;
  amount: number;
  totalExpected: number;
  status: "ACTIVE" | "COMPLETED" | "OVERDUE";
  lender: { name: string };
  installments: { amount: number }[];
};

type Installment = {
  id: string;
  amount: number;
  receivedDate: string;
  loan: { lender: { name: string } };
};

export default function DashboardPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [installments, setInstallments] = useState<Installment[]>([]);

  useEffect(() => {
    fetch("/api/loans").then((r) => r.json()).then(setLoans);
    fetch("/api/installments").then((r) => r.json()).then(setInstallments);
  }, []);

  const metrics = useMemo(() => {
    const totalLent = loans.reduce((sum, l) => sum + Number(l.amount), 0);
    const totalReceived = installments.reduce((sum, i) => sum + Number(i.amount), 0);
    const outstanding = loans.reduce((sum, l) => {
      const received = l.installments.reduce((x, i) => x + Number(i.amount), 0);
      return sum + calculateRemaining(Number(l.totalExpected), received);
    }, 0);
    return {
      totalLent,
      totalReceived,
      outstanding,
      activeLoans: loans.filter((l) => l.status === "ACTIVE").length,
      activeLenders: new Set(loans.map((l) => l.lender.name)).size
    };
  }, [loans, installments]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Total Lent", metrics.totalLent],
          ["Total Received", metrics.totalReceived],
          ["Outstanding", metrics.outstanding],
          ["Active Lenders", metrics.activeLenders],
          ["Active Loans", metrics.activeLoans]
        ].map(([label, value]) => (
          <GlassCard key={label as string}>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-semibold">{typeof value === "number" ? value.toLocaleString() : value}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h3 className="mb-3 text-lg font-semibold">Loan Status Chart</h3>
          <div className="space-y-3">
            {loans.slice(0, 6).map((loan) => {
              const received = loan.installments.reduce((sum, i) => sum + Number(i.amount), 0);
              const completion = calculateCompletion(Number(loan.totalExpected), received);
              return (
                <div key={loan.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{loan.lender.name}</span>
                    <StatusBadge status={loan.status} />
                  </div>
                  <ProgressBar value={completion} />
                </div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-3 text-lg font-semibold">Recent Installments</h3>
          <div className="space-y-2">
            {installments.slice(0, 8).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border border-white/70 bg-white/70 p-3 text-sm">
                <span>{item.loan.lender.name}</span>
                <span>${Number(item.amount).toLocaleString()}</span>
                <span>{new Date(item.receivedDate).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
