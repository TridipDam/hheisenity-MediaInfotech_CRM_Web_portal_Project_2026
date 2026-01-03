"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import LoginPage from "@/components/LoginPage";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "user";

  const handleBack = () => {
    router.push("/landing");
  };

  const handleLogin = () => {
    router.push("/");
  };

  return (
    <LoginPage
      onBack={handleBack}
      onLogin={handleLogin}
      initialTab={type}
    />
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
