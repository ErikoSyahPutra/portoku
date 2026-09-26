"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Suspense } from "react";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";
  const isCustomShell =
    isHome ||
    isAdmin ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/projects");

  if (isCustomShell) {
    return <>{children}</>;
  }

  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main>{children}</main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
