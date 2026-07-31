import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { NoticesProvider } from "@/context/NoticesContext";
import { ToastContainer } from "@/components/ui/Toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BEC Club Hub | Campus Life, Elevated",
  description: "Bhubaneswar Engineering College's official club management and event discovery platform — discover clubs, register for events, and build your campus legacy.",
  openGraph: {
    title: "BEC Club Hub | Campus Life, Elevated",
    description: "Your one-stop campus platform for clubs, events, and achievements at BEC.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1E1B4B" />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <AuthProvider>
          <NoticesProvider>
            {children}
            <ToastContainer />
          </NoticesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
