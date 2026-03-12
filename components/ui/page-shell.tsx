"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

const links = [
  ["/dashboard", "Dashboard"],
  ["/lenders", "Lenders"],
  ["/loans", "Loans"],
  ["/installments", "Installments"]
] as const;

export function PageShell({ children }: PropsWithChildren) {
  const pathname = usePathname();

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 md:px-8">
      <nav className="glass mb-8 flex flex-wrap items-center gap-2 rounded-xl2 p-3">
        <div className="mr-3 text-lg font-semibold text-slate-900">LendTrack</div>
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-lg px-3 py-2 text-sm transition",
              pathname === href ? "bg-primary text-white" : "text-slate-600 hover:bg-white/80"
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
      <AnimatePresence mode="wait">
        <motion.section
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18 }}
        >
          {children}
        </motion.section>
      </AnimatePresence>
    </main>
  );
}
