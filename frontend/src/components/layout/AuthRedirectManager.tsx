"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthRedirectManager() {
  const pathname = usePathname();
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    // List of protected routes that require login first to book anything
    const protectedRoutes = [
      "/booking",
      "/checkout",
      "/payment",
      "/charter",
      "/profile",
      "/dashboard",
      "/success"
    ];

    // Check if the current route is in the protected list or starts with them
    const isProtected = protectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (isProtected && !isLoggedIn) {
      // Redirect to /auth login screen and append original destination
      router.push(`/auth?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, isLoggedIn, router]);

  return null;
}
