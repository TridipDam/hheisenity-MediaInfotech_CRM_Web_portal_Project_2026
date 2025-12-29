"use client"

import LoginPage from "@/components/LoginPage"
import { useRouter, useSearchParams } from "next/navigation"

export default function Login() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'user'

  const handleBack = () => {
    router.push('/landing')
  }

  const handleLogin = () => {
    router.push('/')
  }

  return (
    <LoginPage 
      onBack={handleBack}
      onLogin={handleLogin}
      initialTab={type}
    />
  )
}