import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

export function GlassCard({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={cn("glass rounded-xl2 p-5", className)}
    >
      {children}
    </motion.div>
  );
}
