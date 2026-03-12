import type { Metadata } from "next";
import "./globals.css";
import { PageShell } from "@/components/ui/page-shell";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "LendTrack",
  description: "Loan and installment tracking for lenders"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PageShell>{children}</PageShell>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
