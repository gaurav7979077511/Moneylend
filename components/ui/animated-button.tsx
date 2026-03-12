import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { HTMLMotionProps } from "framer-motion";
import type { PropsWithChildren } from "react";

export function AnimatedButton({
  className,
  children,
  ...props
}: PropsWithChildren<HTMLMotionProps<"button">>) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-md transition disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
