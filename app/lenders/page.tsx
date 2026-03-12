"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { LenderForm } from "@/components/forms/lender-form";
import { AnimatedButton } from "@/components/ui/animated-button";

type Lender = {
  id: string;
  name: string;
  phone: string;
  address?: string;
  notes?: string;
  createdAt: string;
};

export default function LendersPage() {
  const [lenders, setLenders] = useState<Lender[]>([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Lender | null>(null);

  const loadLenders = async () => {
    const data = await fetch("/api/lenders").then((res) => res.json());
    setLenders(data);
  };

  useEffect(() => {
    loadLenders();
  }, []);

  const filtered = useMemo(
    () => lenders.filter((l) => l.name.toLowerCase().includes(query.toLowerCase())),
    [lenders, query]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <GlassCard>
        <h2 className="mb-3 text-lg font-semibold">{editing ? "Edit Lender" : "Add Lender"}</h2>
        <LenderForm
          initial={editing ?? undefined}
          onCancel={() => setEditing(null)}
          onSubmit={async (values) => {
            const endpoint = editing ? `/api/lenders/${editing.id}` : "/api/lenders";
            const method = editing ? "PUT" : "POST";
            await fetch(endpoint, {
              method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values)
            });
            toast.success(`Lender ${editing ? "updated" : "added"}`);
            setEditing(null);
            loadLenders();
          }}
        />
      </GlassCard>

      <GlassCard>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Lenders</h2>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lenders"
            className="rounded-lg border border-white/50 bg-white/80 p-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          {filtered.map((lender) => (
            <motion.div
              key={lender.id}
              layout
              className="flex items-center justify-between rounded-lg border border-white/60 bg-white/70 p-3"
            >
              <div>
                <p className="font-medium">{lender.name}</p>
                <p className="text-sm text-slate-500">{lender.phone}</p>
              </div>
              <div className="flex gap-2">
                <AnimatedButton className="bg-secondary" onClick={() => setEditing(lender)}>
                  Edit
                </AnimatedButton>
                <AnimatedButton
                  className="bg-danger"
                  onClick={async () => {
                    await fetch(`/api/lenders/${lender.id}`, { method: "DELETE" });
                    toast.success("Lender deleted");
                    loadLenders();
                  }}
                >
                  Delete
                </AnimatedButton>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
