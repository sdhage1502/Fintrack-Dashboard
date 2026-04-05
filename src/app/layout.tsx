import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import AuthGuard from "@/components/AuthGuard";
import { AppShell } from "@/components/AppShell";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinTrack — Smart Finance Dashboard",
  description: "Track income, expenses, and budgets with real-time insights. A modern financial management platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable} antialiased bg-background text-foreground transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthGuard>
            <AppShell>{children}</AppShell>
            <Toaster position="top-center" />
          </AuthGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}
