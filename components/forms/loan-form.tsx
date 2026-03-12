"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { calculateTotalExpected } from "@/lib/calculations";
import { AnimatedButton } from "@/components/ui/animated-button";
import { LOAN_STATUSES } from "@/lib/types";

const schema = z.object({
  lenderId: z.string().cuid(),
  amount: z.coerce.number().positive(),
  roi: z.coerce.number().min(0),
  startDate: z.string().min(1),
  periodMonths: z.coerce.number().int().positive(),
  status: z.enum(LOAN_STATUSES)
});

type FormData = z.infer<typeof schema>;

export function LoanForm({
  lenders,
  onSubmit
}: {
  lenders: { id: string; name: string }[];
  onSubmit: (values: FormData) => Promise<void>;
}) {
  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: "ACTIVE", startDate: new Date().toISOString().slice(0, 10) }
  });

  const amount = watch("amount") || 0;
  const roi = watch("roi") || 0;
  const period = watch("periodMonths") || 0;
  const totalExpected = useMemo(() => calculateTotalExpected(amount, roi, period), [amount, roi, period]);

  return (
    <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
      <select {...register("lenderId")} className="rounded-lg border border-white/50 bg-white/80 p-2">
        <option value="">Select lender</option>
        {lenders.map((l) => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>
      <input type="number" step="0.01" {...register("amount")} placeholder="Amount" className="rounded-lg border border-white/50 bg-white/80 p-2" />
      <input type="number" step="0.01" {...register("roi")} placeholder="ROI %" className="rounded-lg border border-white/50 bg-white/80 p-2" />
      <input type="date" {...register("startDate")} className="rounded-lg border border-white/50 bg-white/80 p-2" />
      <input type="number" {...register("periodMonths")} placeholder="Period months" className="rounded-lg border border-white/50 bg-white/80 p-2" />
      <select {...register("status")} className="rounded-lg border border-white/50 bg-white/80 p-2">
        {LOAN_STATUSES.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
      <p className="text-sm text-slate-600">Calculated total expected: <b>${totalExpected.toLocaleString()}</b></p>
      <AnimatedButton disabled={isSubmitting} type="submit">Save Loan</AnimatedButton>
    </form>
  );
}
