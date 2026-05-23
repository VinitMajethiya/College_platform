import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "UniVerdict",
    template: "%s | UniVerdict"
  },
  description: "Find your perfect college. Make your best decision."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
