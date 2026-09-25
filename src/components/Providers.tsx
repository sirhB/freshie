"use client";

import { SessionProvider } from "next-auth/react";
import { PwaRegister } from "@/components/PwaRegister";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PwaRegister />
      {children}
    </SessionProvider>
  );
}
