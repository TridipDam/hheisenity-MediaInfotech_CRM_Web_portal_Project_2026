"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import LandingPage from "@/components/LandingPage"

export default function RootPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Handle authenticated users - redirect them to their appropriate dashboards
  useEffect(() => {
    if (status === "loading") return // Still loading

    if (session?.user) {
      const userType = (session.user as any)?.userType
      console.log('Root page - User type:', userType)
      
      if (userType === 'admin') {
        console.log('Root page - Redirecting admin to dashboard')
        router.push('/dashboard')
      } else if (userType === 'employee') {
        console.log('Root page - Redirecting employee to staff-portal')
        router.push('/staff-portal')
      }
      // If neither admin nor employee, stay on landing page
    }
  }, [session, status, router])

  // For unauthenticated users or unknown user types, show landing page directly
  const isLoggedIn = !!session?.user
  const userProfile = session?.user ? {
    name: session.user.name || "User",
    email: session.user.email || "",
    role: (session.user as any).userType === 'admin' ? 'Administrator' : 'Employee',
    avatar: "/api/placeholder/40/40",
    employeeId: (session.user as any).employeeId
  } : undefined

  const handleGetStarted = (type?: string) => {
    if (isLoggedIn) {
      const userType = (session?.user as any)?.userType
      if (userType === 'admin') {
        router.push("/dashboard")
      } else if (userType === 'employee') {
        router.push("/staff-portal")
      }
    } else {
      // If not logged in, go to login
      router.push(`/login?type=${type || 'user'}`)
    }
  }

  return (
    <div>
      <LandingPage 
        onGetStarted={handleGetStarted}
        isLoggedIn={isLoggedIn}
        userProfile={userProfile}
      />
    </div>
  )
}