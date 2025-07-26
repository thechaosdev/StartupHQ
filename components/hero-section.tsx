import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PointerHighlight } from "./ui/pointer-highlight";
import { StickyBanner } from "./ui/sticky-banner";

export function HeroSection() {
  return (  
  <>
  <StickyBanner className="bg-gradient-to-b from-blue-500 to-blue-600">
      <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
        Announcing free team boards for early supporters.{" "}
        {/* <a href="#" className="transition duration-200 hover:underline">
          Read announcement
        </a> */}
      </p>
    </StickyBanner>
    <section className="py-32 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <div className="space-y-6">
              <h1 className="text-sm font-bold text-gray-500">
                <span className="inline-block w-2 h-2 mr-2 align-middle bg-green-500 rounded-full"></span>
                We are live
              </h1>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Manage your{" "}
                <span className="relative inline-block">
                  <PointerHighlight
                    rectangleClassName="bg-blue-200 dark:bg-blue-200 "
                    pointerClassName="text-black"
                  >
                    <span className="relative z-10">startups</span>
                  </PointerHighlight>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Everything your team needs{" "}
              <span className="bg-blue-200 text-gray-800">real-time chat, task tracking, collaborative documents, and video meetings unified in one workspace</span> 
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Try it out
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section></>
  );
}