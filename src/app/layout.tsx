import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Dashboard App",
  description: "A modern dashboard application with authentication",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <SessionProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster position="top-center" richColors />
        </SessionProvider>
      </body>
    </html>
  );
}
