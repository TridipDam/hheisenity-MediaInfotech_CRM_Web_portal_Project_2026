"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Landing() {
  const router = useRouter()
  
  // Redirect to root page which now serves the landing page
  useEffect(() => {
    router.replace("/")
  }, [router])
  
  return null
}