import { ReactNode } from "react";
import { Inter } from "next/font/google";
import SessionProvider from "@/components/auth/SessionProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "{{projectName}}",
  description: "Built with Next.js and NextAuth.js",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
