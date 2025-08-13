"use client";

import HomePage from "@/components/HomePage";
import { usePrismaUser } from "../providers/AuthProvider";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClockPage() {
  const user = usePrismaUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) return; // Wait until user is loaded

    if (user.role === "MANAGER") {
      router.push("/manager");
    } else if (user.role === "CAREWORKER") {
      router.push("/careworker");
    }
  }, [user, router]);

  // Optionally show a loading state while fetching user
  

  return (
    <div>
      <HomePage />
    </div>
  );
}
