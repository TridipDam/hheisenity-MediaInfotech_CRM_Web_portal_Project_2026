"use client"

import LandingPage from "@/components/LandingPage"
import { useRouter } from "next/navigation"

export default function Landing() {
  const router = useRouter()

  const handleGetStarted = (type?: string) => {
    router.push(`/login?type=${type || 'user'}`)
  }

  return <LandingPage onGetStarted={handleGetStarted} />
}