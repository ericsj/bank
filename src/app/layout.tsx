import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js bank app",
  description: "Banking app built using Next.js + Prisma + PostgreSQL",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
