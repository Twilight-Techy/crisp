"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Shield, Menu, X, Moon, Sun, MapPin, Bell, FileText, Search, Settings } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    // Check admin authentication status
    const authToken = localStorage.getItem("crisp_admin_auth")
    setIsAdminAuthenticated(authToken === "true")
  }, [])

  const navigationItems = [
    { href: "/map", label: "Crime Map", icon: MapPin },
    { href: "/safety", label: "Safety Hub", icon: Shield },
    { href: "/alerts", label: "Alerts", icon: Bell },
    { href: "/track", label: "Track Report", icon: Search },
  ]

  const isActive = (href: string) => pathname === href

  if (!mounted) return null

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                CRISP
              </span>
              <div className="text-xs text-muted-foreground -mt-1">Crime Intelligence Platform</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  className={`flex items-center space-x-2 ${
                    isActive(item.href)
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "text-foreground/70 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                  } transition-colors font-medium`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}

            {/* Admin Link */}
            <Link href={isAdminAuthenticated ? "/admin" : "/admin/login"}>
              <Button
                variant={isActive("/admin") ? "secondary" : "ghost"}
                className={`flex items-center space-x-2 ${
                  isActive("/admin")
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "text-foreground/70 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                } transition-colors font-medium`}
              >
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </Button>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg"
            >
              <Link href="/report">
                <FileText className="w-4 h-4 mr-2" />
                Report Incident
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-9 h-9">
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/50">
          <div className="px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  className={`w-full justify-start ${
                    isActive(item.href)
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "text-foreground/70 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                  } transition-colors font-medium`}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              </Link>
            ))}

            <Link href={isAdminAuthenticated ? "/admin" : "/admin/login"} onClick={() => setIsMenuOpen(false)}>
              <Button
                variant={isActive("/admin") ? "secondary" : "ghost"}
                className={`w-full justify-start ${
                  isActive("/admin")
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "text-foreground/70 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                } transition-colors font-medium`}
              >
                <Settings className="w-4 h-4 mr-3" />
                Admin
              </Button>
            </Link>

            <div className="pt-4 border-t border-border/50">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href="/report">
                  <FileText className="w-4 h-4 mr-2" />
                  Report Incident
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
