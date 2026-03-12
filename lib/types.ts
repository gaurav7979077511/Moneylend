export const LOAN_STATUSES = ["ACTIVE", "COMPLETED", "OVERDUE"] as const;
export type LoanStatus = (typeof LOAN_STATUSES)[number];
