"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AnimatedButton } from "@/components/ui/animated-button";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  address: z.string().optional(),
  notes: z.string().optional()
});

type FormData = z.infer<typeof schema>;

export function LenderForm({
  initial,
  onSubmit,
  onCancel
}: {
  initial?: Partial<FormData>;
  onSubmit: (values: FormData) => Promise<void>;
  onCancel?: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: initial });

  return (
    <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} placeholder="Name" className="rounded-lg border border-white/50 bg-white/80 p-2" />
      {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
      <input {...register("phone")} placeholder="Phone" className="rounded-lg border border-white/50 bg-white/80 p-2" />
      <input {...register("address")} placeholder="Address" className="rounded-lg border border-white/50 bg-white/80 p-2" />
      <textarea {...register("notes")} placeholder="Notes" className="rounded-lg border border-white/50 bg-white/80 p-2" />
      <div className="flex gap-2">
        <AnimatedButton disabled={isSubmitting} type="submit">
          Save
        </AnimatedButton>
        {onCancel && (
          <AnimatedButton type="button" className="bg-slate-500" onClick={onCancel}>
            Cancel
          </AnimatedButton>
        )}
      </div>
    </form>
  );
}
