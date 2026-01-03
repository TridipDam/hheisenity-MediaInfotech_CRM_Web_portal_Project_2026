"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  Building2, 
  Headphones, 
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Camera,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign
} from "lucide-react"

interface LandingPageProps {
  onGetStarted: (type?: string) => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-card/90 backdrop-blur-md rounded-full px-8 py-3 shadow-lg border border-border">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-foreground">Mediacomputer</span>
          </div>
          <div className="hidden md:flex space-x-6 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-blue-600 transition-colors">Features</a>
            <a href="#login" className="text-muted-foreground hover:text-blue-600 transition-colors">Login</a>
            <a href="#contact" className="text-muted-foreground hover:text-blue-600 transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => onGetStarted()} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
              Access Portal
            </Button>
          </div>
        </div>
      </nav>

      {/* Login feature */}
      <section id="login" className="pt-36 py-20 bg-card border-t border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200">
                Access Portal
              </Badge>
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                Choose Your Access Level
              </h2>
              <p className="text-xl text-gray-600">
                Secure login for different user roles with tailored dashboards and permissions
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6">
              {/* User Login */}
              <div className="group p-8 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">User Login</h3>
                  <p className="text-gray-600 mb-6 text-sm">
                    Access your surveillance dashboard, view camera feeds, and manage basic settings
                  </p>
                  <Button 
                    onClick={() => onGetStarted("user")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3"
                  >
                    Login as User
                  </Button>
                </div>
              </div>

              {/* Admin Login */}
              <div className="group p-8 bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 transition-all duration-300 hover:shadow-xl hover:from-blue-100 hover:to-blue-150">
                <div className="text-center">
                  <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <ShieldCheck className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Admin Portal</h3>
                  <p className="text-gray-600 mb-6 text-sm">
                    Full system control, user management, analytics, and enterprise configuration
                  </p>
                  <Button 
                    onClick={() => onGetStarted("admin")}
                    className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl py-3 shadow-lg"
                  >
                    Admin Access
                  </Button>
                </div>
              </div>

              {/* Staff Login */}
              <div className="group p-8 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-green-200 transition-all duration-300 hover:shadow-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Headphones className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Staff Portal</h3>
                  <p className="text-gray-600 mb-6 text-sm">
                    Technical support tools, maintenance schedules, and operational monitoring
                  </p>
                  <Button 
                    onClick={() => onGetStarted("staff")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3"
                  >
                    Staff Login
                  </Button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>
      
      {/* Employee Self-Attendance Feature */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 text-white border-white/30 bg-white/10">
                New Feature
              </Badge>
              <h2 className="text-4xl font-black text-white mb-4">
                Employee Self-Attendance
              </h2>
              <p className="text-xl text-blue-100">
                Let employees mark their own attendance with photo verification and location tracking
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Photo Verification</h3>
                      <p className="text-blue-100">Employees take a photo when marking attendance for security and verification purposes.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Location Tracking</h3>
                      <p className="text-blue-100">Automatic IP address detection and location verification to ensure employees are at the right workplace.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Real-time Tracking</h3>
                      <p className="text-blue-100">Instant attendance recording with precise timestamps and device information for accurate records.</p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => window.open('/employee-attendance', '_blank')}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Try Employee Attendance
                </Button>
              </div>
              
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                          <Camera className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">Camera Active</p>
                          <p className="text-sm text-blue-100">Photo verification enabled</p>
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-white">
                        <span className="text-sm">IP Address:</span>
                        <Badge className="bg-white/20 text-white border-white/30">192.168.1.45</Badge>
                      </div>
                      <div className="flex justify-between items-center text-white">
                        <span className="text-sm">Location:</span>
                        <span className="text-sm font-medium">Office Building A</span>
                      </div>
                      <div className="flex justify-between items-center text-white">
                        <span className="text-sm">Time:</span>
                        <span className="text-sm font-medium">09:15:32 AM</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button className="bg-green-500 hover:bg-green-600 text-white">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Check In
                      </Button>
                      <Button className="bg-red-500 hover:bg-red-600 text-white">
                        <XCircle className="h-4 w-4 mr-2" />
                        Check Out
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-blue-900/20"></div>
        <div className="container mx-auto px-6 relative z-10">       
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-8 bg-gray-800/50 rounded-2xl border border-gray-700">
              <Phone className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Phone Support</h3>
              <p className="text-gray-300 mb-4">Speak with our support team</p>
              <p className="text-blue-400 font-semibold">+1 (555) 123-4567</p>
            </div>
            
            <div className="text-center p-8 bg-gray-800/50 rounded-2xl border border-gray-700">
              <Mail className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-gray-300 mb-4">Send us your questions</p>
              <p className="text-blue-400 font-semibold">support@businesshub.com</p>
            </div>
            
            <div className="text-center p-8 bg-gray-800/50 rounded-2xl border border-gray-700">
              <MapPin className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Visit Us</h3>
              <p className="text-gray-300 mb-4">Our business office</p>
              <p className="text-blue-400 font-semibold">123 Business Ave</p>
            </div>
          </div>
          
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Package className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white">Mediacomputer</span>
            </div>
            <div className="text-center md:text-right">
              <p>&copy; 2025 Mediacomputer. Comprehensive business management solutions.</p>
              <p className="text-sm mt-1">Streamline your operations with our integrated platform.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}