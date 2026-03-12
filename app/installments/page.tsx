"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { InstallmentForm } from "@/components/forms/installment-form";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressBar } from "@/components/ui/progress";
import { calculateCompletion, calculateRemaining } from "@/lib/calculations";

type Loan = { id: string; totalExpected: number; lender: { name: string }; installments: { amount: number }[] };
type Installment = {
  id: string;
  amount: number;
  receivedDate: string;
  notes?: string;
  loan: { id: string; lender: { name: string }; totalExpected: number; installments: { amount: number }[] };
};

export default function InstallmentsPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [installments, setInstallments] = useState<Installment[]>([]);

  const load = async () => {
    const [loanData, installmentData] = await Promise.all([
      fetch("/api/loans").then((r) => r.json()),
      fetch("/api/installments").then((r) => r.json())
    ]);
    setLoans(loanData);
    setInstallments(installmentData);
  };

  useEffect(() => {
    load();
  }, []);

  const options = useMemo(
    () => loans.map((l) => ({ id: l.id, label: `${l.lender.name} • ${Number(l.totalExpected).toLocaleString()}` })),
    [loans]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <GlassCard>
        <h2 className="mb-3 text-lg font-semibold">Add Installment</h2>
        <InstallmentForm
          loans={options}
          onSubmit={async (values) => {
            await fetch("/api/installments", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values)
            });
            toast.success("Installment recorded");
            load();
          }}
        />
      </GlassCard>
      <GlassCard>
        <h2 className="mb-3 text-lg font-semibold">Installment History</h2>
        <div className="space-y-3">
          {installments.map((i) => {
            const received = i.loan.installments.reduce((sum, item) => sum + Number(item.amount), 0);
            const completion = calculateCompletion(Number(i.loan.totalExpected), received);
            const remaining = calculateRemaining(Number(i.loan.totalExpected), received);
            return (
              <div key={i.id} className="space-y-2 rounded-lg border border-white/60 bg-white/70 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{i.loan.lender.name}</p>
                  <p className="text-sm">${Number(i.amount).toLocaleString()}</p>
                </div>
                <p className="text-xs text-slate-500">{new Date(i.receivedDate).toLocaleDateString()} • Remaining ${remaining.toLocaleString()}</p>
                <ProgressBar value={completion} />
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
