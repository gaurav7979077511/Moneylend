import type { LoanStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusMap: Record<LoanStatus, string> = {
  ACTIVE: "bg-primary/10 text-primary",
  COMPLETED: "bg-success/10 text-success",
  OVERDUE: "bg-danger/10 text-danger"
};

export function StatusBadge({ status }: { status: LoanStatus }) {
  return <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", statusMap[status])}>{status}</span>;
}
