import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import Navbar from "@/lib/components/Navbar";
import { TRPCProvider } from "@/lib/trpc/client";
import { HydrateClient } from "@/lib/trpc/server";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "The Best Todo App",
  description: "Best Todo app ever made",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ClerkProvider>
      <TRPCProvider>
        <HydrateClient>
          <html lang="en">
            <body className={`${inter.className} antialiased`}>
              <Navbar />
              {children}
            </body>
          </html>
        </HydrateClient>
      </TRPCProvider>
    </ClerkProvider>
  );
}
