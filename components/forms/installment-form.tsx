"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AnimatedButton } from "@/components/ui/animated-button";

const schema = z.object({
  loanId: z.string().cuid(),
  amount: z.coerce.number().positive(),
  receivedDate: z.string().min(1),
  notes: z.string().optional()
});

type FormData = z.infer<typeof schema>;

export function InstallmentForm({ loans, onSubmit }: { loans: { id: string; label: string }[]; onSubmit: (values: FormData) => Promise<void> }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { receivedDate: new Date().toISOString().slice(0, 10) }
  });

  return (
    <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
      <select {...register("loanId")} className="rounded-lg border border-white/50 bg-white/80 p-2">
        <option value="">Select loan</option>
        {loans.map((loan) => (
          <option key={loan.id} value={loan.id}>{loan.label}</option>
        ))}
      </select>
      <input type="number" step="0.01" {...register("amount")} placeholder="Installment amount" className="rounded-lg border border-white/50 bg-white/80 p-2" />
      <input type="date" {...register("receivedDate")} className="rounded-lg border border-white/50 bg-white/80 p-2" />
      <textarea {...register("notes")} placeholder="Notes" className="rounded-lg border border-white/50 bg-white/80 p-2" />
      <AnimatedButton disabled={isSubmitting} type="submit">Add Installment</AnimatedButton>
    </form>
  );
}
