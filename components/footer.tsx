import Link from "next/link";
import Image from 'next/image';
import { Linkedin, Twitter, Instagram } from "lucide-react";
import logo from "@/assets/log.png";

export function Footer() {
  return (
    <footer className="px-4 py-12">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center space-y-8">
          
        <div className="flex items-center border border-black rounded-xl p-2 relative overflow-hidden">
  <div className="absolute inset-0 -z-10 opacity-10" style={{
    backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
    backgroundSize: '10px 10px'
  }}></div>
  
  <Link href="/" className="flex items-center space-x-2">
    <Image 
      src={logo}
      alt="Startup HQ Logo"
      width={50}
      height={50}
      className="rounded-lg"
    />
  </Link>
  <div className="ml-2">
    <h1 className="text-xl font-bold text-gray-900">Startup HQ</h1>
    <p className="text-sm text-gray-500">Manage startup efficiently</p>
  </div>
</div>

          {/* <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
              Terms & Conditions
            </Link>
            <Link href="/refunds" className="text-sm text-muted-foreground hover:text-primary">
              Refunds & Cancellations
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
              Contact Us
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
          </div> */}

          <div className="w-full max-w-md border-t border-gray-200"></div>

          <div className="flex space-x-3">
            <Link href="https://www.instagram.com/infoxrehman/" className="text-black border border-black rounded-xl p-4">
              <Instagram size={22} />
            </Link>
            <Link href="https://x.com/infoxrehman/" className="text-black border border-black rounded-xl p-4">
              <Twitter size={22} />
            </Link>
            <Link href="https://www.linkedin.com/in/khan-abdul-rehman/" className="text-black border border-black rounded-xl p-4">
              <Linkedin size={22} />
            </Link>
          </div>

          <p className="text-sm text-black">
            © startuphq
          </p>
        </div>
      </div>
    </footer>
  );
}