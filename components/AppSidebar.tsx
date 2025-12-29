"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarFooter,
} from "@/components/ui/sidebar"
import { 
    LayoutDashboard, 
    Users, 
    Ticket, 
    Calendar,
    BarChart3,
    Settings,
    HelpCircle,
    Building2,
    ChevronRight,
    User,
    LogOut,
    DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const navigationItems = [
    {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
        badge: null,
        description: "Overview and analytics"
    },
    {
        title: "Attendance",
        url: "/attendance",
        icon: Users,
        badge: "12",
        description: "Employee time tracking"
    },
    {
        title: "Payroll",
        url: "/payroll",
        icon: DollarSign,
        badge: "2",
        description: "Salary and compensation"
    },
    {
        title: "Tickets",
        url: "/tickets",
        icon: Ticket,
        badge: "3",
        description: "Support requests"
    },
    {
        title: "Calendar",
        url: "/calendar",
        icon: Calendar,
        badge: null,
        description: "Schedule management"
    },
    {
        title: "Reports",
        url: "/reports",
        icon: BarChart3,
        badge: null,
        description: "Analytics and insights"
    }
]

const settingsItems = [
    {
        title: "Landing Page",
        url: "/landing",
        icon: Building2,
        description: "Back to welcome page"
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
        description: "System configuration"
    },
    {
        title: "Help & Support",
        url: "/help",
        icon: HelpCircle,
        description: "Documentation and support"
    }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()

    return (
        <Sidebar {...props} className="border-r border-gray-200 bg-white">
            <SidebarHeader className="border-b border-gray-100 p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow-sm">
                        <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-900">Enterprise</span>
                        <span className="text-sm text-gray-500">Management Suite</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-4 py-6">
                {/* Main Navigation */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                        Main Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {navigationItems.map((item) => {
                                const isActive = pathname === item.url
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton 
                                            asChild 
                                            className={`
                                                group relative h-12 px-3 rounded-lg transition-all duration-200 hover:bg-gray-50
                                                ${isActive 
                                                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                                                    : 'text-gray-700 hover:text-gray-900'
                                                }
                                            `}
                                        >
                                            <Link href={item.url} className="flex items-center gap-3 w-full">
                                                <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                                                <div className="flex flex-col flex-1 min-w-0">
                                                    <span className="font-medium text-sm truncate">{item.title}</span>
                                                    <span className="text-xs text-gray-500 truncate">{item.description}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {item.badge && (
                                                        <Badge 
                                                            variant="secondary" 
                                                            className={`
                                                                text-xs px-2 py-0.5 font-medium
                                                                ${isActive 
                                                                    ? 'bg-blue-100 text-blue-700' 
                                                                    : 'bg-gray-100 text-gray-600'
                                                                }
                                                            `}
                                                        >
                                                            {item.badge}
                                                        </Badge>
                                                    )}
                                                    {isActive && (
                                                        <ChevronRight className="h-4 w-4 text-blue-600" />
                                                    )}
                                                </div>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <Separator className="my-6 mx-2" />

                {/* Settings & Support */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                        System
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {settingsItems.map((item) => {
                                const isActive = pathname === item.url
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton 
                                            asChild 
                                            className={`
                                                group relative h-12 px-3 rounded-lg transition-all duration-200 hover:bg-gray-50
                                                ${isActive 
                                                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                                                    : 'text-gray-700 hover:text-gray-900'
                                                }
                                            `}
                                        >
                                            <Link href={item.url} className="flex items-center gap-3 w-full">
                                                <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                                                <div className="flex flex-col flex-1 min-w-0">
                                                    <span className="font-medium text-sm truncate">{item.title}</span>
                                                    <span className="text-xs text-gray-500 truncate">{item.description}</span>
                                                </div>
                                                {isActive && (
                                                    <ChevronRight className="h-4 w-4 text-blue-600" />
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* User Profile Footer */}
            <SidebarFooter className="border-t border-gray-100 p-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-600 to-gray-700 text-white font-semibold text-sm">
                        JD
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-semibold text-sm text-gray-900 truncate">John Doe</span>
                        <span className="text-xs text-gray-500 truncate">Administrator</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700">
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}