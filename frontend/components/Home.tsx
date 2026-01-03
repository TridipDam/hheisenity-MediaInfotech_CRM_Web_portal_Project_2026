"use client"

import { useState } from "react"
import { AppSidebar } from "./AppSidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { TicketTable } from "./TicketTable"
import LandingPage from "./LandingPage"
import LoginPage from "./LoginPage"

export default function Home() {
  const [currentView, setCurrentView] = useState<"landing" | "login" | "app">("landing")
  const [loginType, setLoginType] = useState<string>("user")

  const handleGetStarted = (type?: string) => {
    if (type) {
      setLoginType(type)
    }
    setCurrentView("login")
  }

  const handleLogin = () => {
    setCurrentView("app")
  }

  const handleBackToLanding = () => {
    setCurrentView("landing")
  }

  if (currentView === "landing") {
    return <LandingPage onGetStarted={handleGetStarted} />
  }

  if (currentView === "login") {
    return (
      <LoginPage 
        onBack={handleBackToLanding}
        onLogin={handleLogin}
        initialTab={loginType}
      />
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 p-6">
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={handleBackToLanding}
              className="mb-4"
            >
              ← Back to Landing
            </Button>
          </div>
          <TicketTable />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}