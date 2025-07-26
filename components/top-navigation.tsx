"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Home,
  CheckSquare,
  FileText,
  Users,
  BadgeDollarSign
} from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import PricingTables from "@/components/pricing-table"

export function TopNavigation() {
  const pathname = usePathname()
  const { signOut } = useAuth()
  const router = useRouter()
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<any>(null)
  const [showPricingDialog, setShowPricingDialog] = useState(false)
  const [navigationItems, setNavigationItems] = useState([
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Tasks",
      href: "/dashboard/tasks",
      icon: CheckSquare,
    },
    {
      title: "Docs",
      href: "/dashboard/docs",
      icon: FileText,
    }
  ])

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
      
      if (profile?.plan === 'pro' || profile?.plan === 'enterprise') {
        setNavigationItems(prev => [
          ...prev,
          {
            title: "Team",
            href: "/dashboard/team",
            icon: Users,
          }
        ])
      }
    }
    fetchUserData()
  }, [supabase])

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  const isActive = (href: string) => {
    return pathname === href;
  }

  const NavigationChips = ({ isMobile = false }) => (
    <div className={`flex ${isMobile ? "flex-col space-y-2" : "flex-wrap gap-2"}`}>
      {navigationItems.map((item) => {
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
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
          </Link>
        )
      })}
    </div>
  )

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {profile?.plan === "free" ? (
              <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
                <img
                  src="https://api.dicebear.com/7.x/personas/svg?seed=personal"
                  alt="Personal Icon"
                  className="rounded-lg h-10 w-10 md:h-10 md:w-10 bg-blue-200"
                />
                <span className="font-semibold text-lg md:text-xl">Personal board</span>
              </Link>
            ) : (
              <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
                <img src="https://api.dicebear.com/7.x/personas/svg?seed=personal" alt="Startup Logo" className="bg-blue-200 rounded-lg h-10 w-10 md:h-10 md:w-10" />
                <span className="font-semibold text-lg md:text-xl"></span>
              </Link>
            )}

            <div className="hidden lg:flex flex-1 justify-center max-w-4xl mx-8">
              <NavigationChips />
            </div>

            <div className="flex items-center gap-2 md:gap-3">
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
                  <DropdownMenuItem onClick={() => setShowPricingDialog(true)}>
                    <BadgeDollarSign className="mr-2 h-4 w-4" />
                    <span>Upgrade plans</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={profile ? handleSignOut : () => router.push("/auth/login")}>
                    <span>{profile ? "Sign out" : "Sign in"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="lg:hidden pb-3 border-b">
            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-2">
                <NavigationChips isMobile />
              </div>
            </ScrollArea>
          </div>
        </div>
      </header>

      <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
        <DialogContent className="max-w-4xl p-8">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Upgrade Your Plan</DialogTitle>
          </DialogHeader>
          <div className="">
            <PricingTables />
          </div>
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => setShowPricingDialog(false)}
              className="mt-4"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}