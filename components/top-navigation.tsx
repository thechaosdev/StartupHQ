"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Home,
  MessageSquare,
  CheckSquare,
  FileText,
  Users,
  Settings,
  Menu,
  Search,
  Plus,
} from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"

import logo from "@/assets/logo.png"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Chat",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Docs",
    href: "/docs",
    icon: FileText,
  },
  // {
  //   title: "Attendance",
  //   href: "/attendance",
  //   icon: Calendar,
  // },
  {
    title: "Team",
    href: "/team",
    icon: Users,
  },
]

export function TopNavigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { signOut } = useAuth()
  const router = useRouter()
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      if (error) {
        console.error('Error fetching user profile:', error)
        setProfile(null)
        return
      }
      setProfile(profile)
    }
    fetchUserData()
  }, [supabase])


  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const NavigationChips = ({ isMobile = false }) => (
    <div className={`flex ${isMobile ? "flex-col space-y-2" : "flex-wrap gap-2"}`}>
      {navigationItems.map((item) => {
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
              ${
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }
              ${isMobile ? "w-full justify-start py-2.5" : ""}
            `}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
            {/* {item.badge && (
              <Badge
                variant={active ? "secondary" : "destructive"}
                className="h-5 w-5 p-0 flex items-center justify-center text-xs ml-auto"
              >
                {item.badge}
              </Badge>
            )} */}
          </Link>
        )
      })}
    </div>
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img src={logo.src} alt="Startup Logo" className="rounded-lg h-8 w-8 md:h-10 md:w-10 ">
            </img>
            <br />
            <span className="font-semibold text-lg md:text-xl">Lixta Network</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center max-w-4xl mx-8">
            <NavigationChips />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search Button */}
            {/* <Button variant="ghost" size="sm" className="hidden md:flex">
              <Search className="h-4 w-4" />
            </Button> */}

            {/* Quick Add Button */}
              {/* <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button> */}

            {/* Notifications */}
            {/* <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">2</Badge>
            </Button> */}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{profile?.name ? profile.name.split(" ").map((n: string) => n[0]).join("") : "--"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.name || "-"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{profile?.email || "-"}</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={handleSignOut}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 pb-4 border-b">
                    <div className="h-6 w-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
                    <span className="font-bold text-lg">TeamSync</span>
                  </div>

                  <ScrollArea className="flex-1 py-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">Navigation</h3>
                        <NavigationChips isMobile />
                      </div>

                      <div className="pt-4 border-t">
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</h3>
                        <div className="space-y-2">
                          <Button variant="ghost" className="w-full justify-start">
                            <Search className="mr-2 h-4 w-4" />
                            Search
                          </Button>
                          <Button variant="ghost" className="w-full justify-start">
                            <Plus className="mr-2 h-4 w-4" />
                            Quick Add
                          </Button>
                          <Button variant="ghost" className="w-full justify-start">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="lg:hidden pb-3 border-b">
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {navigationItems.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
                      ${
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                      }
                    `}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.title}</span>
                    {/* {item.badge && (
                      <Badge
                        variant={active ? "secondary" : "destructive"}
                        className="h-4 w-4 p-0 flex items-center justify-center text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )} */}
                  </Link>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </header>
  )
}