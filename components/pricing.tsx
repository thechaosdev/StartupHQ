import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Infinity } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-24">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold">            
            Pricing Plans
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 w-full mx-auto">
          <Card className="relative w-full">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl">Free</CardTitle>
              <div className="text-4xl font-bold">$0</div>
              <CardDescription>Perfect for personal use</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Browse all components</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Copy code snippets</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Basic documentation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Community support</span>
                </div>
              </div>
              <Link href="/auth/signup" className="block">
                <Button className="w-full bg-transparent" variant="outline">
                  Get Started Free
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="relative border-primary shadow-lg scale-105 w-full">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">Most Popular</Badge>
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl flex items-center justify-center space-x-2">
                <Crown className="h-5 w-5 text-primary" />
                <span>Pro</span>
              </CardTitle>
              <div className="text-4xl font-bold">$29</div>
              <CardDescription>per month, billed monthly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Everything in Free</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Save components to favorites</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">AI component generator</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Commercial use license</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Priority support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Early access to new components</span>
                </div>
              </div>
              <Link href="/auth/signup?plan=pro" className="block">
                <Button className="w-full">Upgrade to Pro</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="relative w-full">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500">Limited Time</Badge>
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl flex items-center justify-center space-x-2">
                <Infinity className="h-5 w-5 text-orange-500" />
                <span>Lifetime</span>
              </CardTitle>
              <div className="space-y-1">
                <div className="text-4xl font-bold">$299</div>
                <div className="text-sm text-muted-foreground line-through">$348 per year</div>
              </div>
              <CardDescription>One-time payment, lifetime access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Everything in Pro</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Lifetime updates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Exclusive components</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Direct founder access</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Custom component requests</span>
                </div>
              </div>
              <Link href="/auth/signup?plan=lifetime" className="block">
                <Button className="w-full" variant="secondary">
                  Get Lifetime Access
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
