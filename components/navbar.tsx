"use client";

import Link from "next/link";
import Image from 'next/image';
import logo from "@/assets/100xbrain.png"
import { Button } from "@/components/ui/button";

export function Navbar() {

   return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
      
        <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2">
      <Image 
    src={logo}
    alt="100xbrain Logo"
    width={60}
    height={60}
  />
        </Link>
            <div>
              <h1 className="text-3xl mt-2 font-bold text-gray-900">100xbrain.</h1>
              {/* <p className="text-sm text-gray-500">second brain for your startups.</p> */}
            </div>
          </div>

        <nav className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
