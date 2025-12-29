"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Camera, 
  Cable, 
  Building2, 
  Headphones, 
  Target,
  Layers3,
  Phone,
  Mail,
  MapPin,
  Package,
  Gauge,
  Network,
  Eye,
  Wifi,
  Server,
  ShieldCheck
} from "lucide-react"

interface LandingPageProps {
  onGetStarted: (type?: string) => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md rounded-full px-8 py-3 shadow-lg border border-gray-200">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Eye className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">VisionLink Pro</span>
          </div>
          <div className="hidden md:flex space-x-6 text-sm">
            <a href="#solutions" className="text-gray-600 hover:text-blue-600 transition-colors">Solutions</a>
            <a href="#capabilities" className="text-gray-600 hover:text-blue-600 transition-colors">Capabilities</a>
            <a href="#login" className="text-gray-600 hover:text-blue-600 transition-colors">Login</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
          </div>
          <Button onClick={() => onGetStarted()} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
            Portal Access
          </Button>
        </div>
      </nav>

      {/* Hero with Diagonal Split */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100"></div>
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-bl from-blue-500/20 to-blue-600/10 transform skew-x-12 origin-top-right"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10 pt-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                <Package className="h-4 w-4" />
                <span>Industrial Scale B2B Solutions</span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-black text-gray-900 leading-tight">
                Surveillance
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-blue-600">
                  Infrastructure
                </span>
                <span className="block text-4xl lg:text-5xl font-bold text-gray-700">
                  By The Ton
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                We don&apos;t sell cameras and cables. We architect complete surveillance ecosystems for enterprises who think in thousands, not units.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => onGetStarted()}
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Request Tonnage Quote
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-gray-300 px-8 py-4 text-lg rounded-xl hover:bg-gray-50"
                >
                  Infrastructure Catalog
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                    <Camera className="h-8 w-8 text-blue-500 mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">4K Surveillance Arrays</h3>
                    <p className="text-sm text-gray-600">Industrial-grade camera systems with AI analytics</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-shadow">
                    <Cable className="h-8 w-8 mb-4" />
                    <h3 className="font-bold mb-2">Fiber Backbone Networks</h3>
                    <p className="text-sm opacity-90">100Gbps+ infrastructure for mission-critical data</p>
                  </div>
                </div>
                <div className="space-y-6 mt-12">
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                    <Building2 className="h-8 w-8 text-blue-500 mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Enterprise Integration</h3>
                    <p className="text-sm text-gray-600">Seamless deployment across multiple facilities</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                    <Headphones className="h-8 w-8 text-blue-500 mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">24/7 Operations Center</h3>
                    <p className="text-sm text-gray-600">Dedicated support for large-scale deployments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Ticker */}
      <section className="py-12 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="text-4xl font-black mb-1">847</div>
              <div className="text-sm opacity-90">Enterprise Installations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-1">23M+</div>
              <div className="text-sm opacity-90">Meters Fiber Deployed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-1">156K</div>
              <div className="text-sm opacity-90">Surveillance Points Active</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-1">99.97%</div>
              <div className="text-sm opacity-90">Network Uptime SLA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section id="capabilities" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200">
              Industrial Capabilities
            </Badge>
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Built for Scale,
              <span className="block text-blue-500">Engineered for Reliability</span>
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="group p-8 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-all duration-300">
                  <Target className="h-12 w-12 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Precision Deployment</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Military-grade installation protocols ensure every camera, every cable, every connection meets industrial standards for decades of operation.
                  </p>
                </div>
                
                <div className="group p-8 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-all duration-300">
                  <Layers3 className="h-12 w-12 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Modular Architecture</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Scalable systems that grow with your enterprise. Add facilities, expand coverage, integrate new technologies without rebuilding infrastructure.
                  </p>
                </div>
              </div>
              
              <div className="p-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl text-white">
                <div className="grid md:grid-cols-3 gap-8 items-center">
                  <div>
                    <Gauge className="h-12 w-12 text-blue-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Performance Monitoring</h3>
                    <p className="text-gray-300 text-sm">Real-time analytics across your entire surveillance network</p>
                  </div>
                  <div>
                    <Network className="h-12 w-12 text-blue-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Network Redundancy</h3>
                    <p className="text-gray-300 text-sm">Multiple failover paths ensure zero downtime operations</p>
                  </div>
                  <div>
                    <ShieldCheck className="h-12 w-12 text-blue-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Security Hardening</h3>
                    <p className="text-gray-300 text-sm">Military-grade encryption and access controls</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white shadow-lg">
                <Server className="h-10 w-10 mb-4" />
                <h3 className="text-xl font-bold mb-3">Edge Computing Integration</h3>
                <p className="text-sm opacity-90 mb-4">Process surveillance data at the source for instant threat detection and response.</p>
                <div className="text-2xl font-black text-white">Less Than 50ms</div>
                <div className="text-xs opacity-75">Response Time</div>
              </div>
              
              <div className="p-6 bg-white rounded-2xl border border-gray-200">
                <Wifi className="h-10 w-10 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Wireless Mesh Backup</h3>
                <p className="text-sm text-gray-600 mb-4">Automatic failover to wireless networks when primary fiber connections are compromised.</p>
                <div className="text-2xl font-black text-gray-900">99.97%</div>
                <div className="text-xs text-gray-500">Guaranteed Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Showcase */}
      <section id="solutions" className="py-24 bg-gray-50/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Solutions That Scale
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-blue-600">
                With Your Ambitions
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Whether you&apos;re securing a single campus or a global enterprise, our infrastructure solutions adapt to your exact requirements.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Bulk Procurement Programs</h3>
                  <p className="text-gray-600">Volume discounts start at 1,000 units. Enterprise pricing for orders measured in tons, not pieces.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Multi-Site Coordination</h3>
                  <p className="text-gray-600">Synchronized deployments across hundreds of locations with centralized management and monitoring.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <Headphones className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Dedicated Operations Team</h3>
                  <p className="text-gray-600">Your own technical team for planning, deployment, and ongoing optimization of surveillance infrastructure.</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 via-blue-600/10 to-blue-700/20 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white p-8 rounded-3xl border border-gray-200 shadow-xl">
                <div className="text-center mb-6">
                  <div className="text-4xl font-black text-gray-900 mb-2">Enterprise Package</div>
                  <div className="text-blue-600 font-semibold">Custom Tonnage Pricing</div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">4K Camera Systems</span>
                    <span className="font-semibold text-gray-900">1,000+ Units</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Fiber Optic Infrastructure</span>
                    <span className="font-semibold text-gray-900">Kilometers</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Installation & Integration</span>
                    <span className="font-semibold text-gray-900">Included</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">24/7 Support & Monitoring</span>
                    <span className="font-semibold text-gray-900">Lifetime</span>
                  </div>
                </div>
                <Button 
                  onClick={() => onGetStarted()}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl shadow-lg"
                >
                  Request Enterprise Quote
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section id="login" className="py-20 bg-white border-t border-gray-200">
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
            
            <div className="grid lg:grid-cols-4 gap-6">
              {/* User Login */}
              <div className="group p-8 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Eye className="h-8 w-8 text-blue-600" />
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
              <div className="group p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 transition-all duration-300 hover:shadow-xl hover:from-blue-100 hover:to-blue-150">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <ShieldCheck className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Admin Portal</h3>
                  <p className="text-gray-600 mb-6 text-sm">
                    Full system control, user management, analytics, and enterprise configuration
                  </p>
                  <Button 
                    onClick={() => onGetStarted("admin")}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl py-3 shadow-lg"
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

              {/* Work Smartly Button */}
              <div className="group p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border-2 border-gray-700 transition-all duration-300 hover:shadow-xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <Gauge className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Work Smartly</h3>
                  <p className="text-gray-300 mb-6 text-sm">
                    AI-powered workflow optimization and intelligent automation tools
                  </p>
                  <Button 
                    onClick={() => onGetStarted("smart")}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl py-3 shadow-lg"
                  >
                    Start Smart Work
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Access Features */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <Server className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Single Sign-On</h4>
                <p className="text-sm text-gray-600">Seamless access across all enterprise systems</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <Network className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Multi-Factor Auth</h4>
                <p className="text-sm text-gray-600">Enterprise-grade security protocols</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <Wifi className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                <h4 className="font-bold text-gray-900 mb-2">Cloud Sync</h4>
                <p className="text-sm text-gray-600">Real-time data synchronization</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-blue-900/20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-5xl font-black mb-6">
              Ready to Deploy at
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-blue-500">
                Industrial Scale?
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Our enterprise solutions team is standing by to architect your surveillance infrastructure.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-8 bg-gray-800/50 rounded-2xl border border-gray-700">
              <Phone className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Enterprise Hotline</h3>
              <p className="text-gray-300 mb-4">Direct line to our industrial solutions team</p>
              <p className="text-blue-400 font-semibold">+1 (800) VISION-PRO</p>
            </div>
            
            <div className="text-center p-8 bg-gray-800/50 rounded-2xl border border-gray-700">
              <Mail className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Bulk Orders</h3>
              <p className="text-gray-300 mb-4">Tonnage quotes and enterprise pricing</p>
              <p className="text-blue-400 font-semibold">enterprise@visionlink.pro</p>
            </div>
            
            <div className="text-center p-8 bg-gray-800/50 rounded-2xl border border-gray-700">
              <MapPin className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Operations Center</h3>
              <p className="text-gray-300 mb-4">24/7 monitoring and support facility</p>
              <p className="text-blue-400 font-semibold">Industrial Complex Alpha</p>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={() => onGetStarted()}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-12 py-4 text-xl rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all"
            >
              Access Enterprise Portal
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Eye className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white">VisionLink Pro</span>
            </div>
            <div className="text-center md:text-right">
              <p>&copy; 2024 VisionLink Pro. Industrial surveillance infrastructure solutions.</p>
              <p className="text-sm mt-1">Engineered for enterprises who think in tons, not units.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}