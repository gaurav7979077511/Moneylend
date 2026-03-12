"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/glass-card";
import { LoanForm } from "@/components/forms/loan-form";
import { StatusBadge } from "@/components/ui/status-badge";
import type { LoanStatus } from "@/lib/types";

type Lender = { id: string; name: string };
type Loan = {
  id: string;
  amount: number;
  totalExpected: number;
  roi: number;
  periodMonths: number;
  startDate: string;
  status: LoanStatus;
  lender: Lender;
  installments: { amount: number }[];
};

export default function LoansPage() {
  const [lenders, setLenders] = useState<Lender[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filterLender, setFilterLender] = useState("");

  const load = async () => {
    const lData = await fetch("/api/lenders").then((r) => r.json());
    const q = filterLender ? `?lenderId=${filterLender}` : "";
    const loanData = await fetch(`/api/loans${q}`).then((r) => r.json());
    setLenders(lData);
    setLoans(loanData);
  };

  useEffect(() => {
    load();
  }, [filterLender]);

  const overdueIds = useMemo(
    () =>
      new Set(
        loans
          .filter((loan) => {
            if (loan.status === "OVERDUE") return true;
            if (loan.status === "COMPLETED") return false;
            const dueDate = new Date(loan.startDate);
            dueDate.setMonth(dueDate.getMonth() + loan.periodMonths);
            return dueDate.getTime() < Date.now();
          })
          .map((loan) => loan.id)
      ),
    [loans]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <GlassCard>
        <h2 className="mb-3 text-lg font-semibold">Add Loan</h2>
        <LoanForm
          lenders={lenders}
          onSubmit={async (values) => {
            await fetch("/api/loans", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values)
            });
            toast.success("Loan created");
            load();
          }}
        />
      </GlassCard>

      <GlassCard>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Loans</h2>
          <select
            className="rounded-lg border border-white/50 bg-white/80 p-2 text-sm"
            value={filterLender}
            onChange={(e) => setFilterLender(e.target.value)}
          >
            <option value="">All lenders</option>
            {lenders.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          {loans.map((loan) => (
            <Link
              key={loan.id}
              href={`/loans/${loan.id}`}
              className={`flex items-center justify-between rounded-lg border p-3 ${overdueIds.has(loan.id) ? "border-danger/40 bg-danger/5" : "border-white/60 bg-white/70"}`}
            >
              <div>
                <p className="font-medium">{loan.lender.name}</p>
                <p className="text-sm text-slate-500">${Number(loan.amount).toLocaleString()} @ {Number(loan.roi)}%</p>
              </div>
              <StatusBadge status={loan.status} />
            </Link>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
