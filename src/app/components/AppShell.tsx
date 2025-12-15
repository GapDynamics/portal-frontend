"use client";

import { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";

export default function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const hideHeader = pathname === "/";

  return (
    <>
      {!hideHeader && <Header />}
      {children}
    </>
  );
}
