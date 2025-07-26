"use client";

import { WobbleCard } from "@/components/ui/wobble-card";
import React from "react";

export default function LixLaunch() {
    return (
        <section className="py-24 px-4 bg-muted/50">
            <div className="">
                <h2 className="text-6xl font-bold text-center max-w-1xl mx-auto text-white">
                    LIX Launches!
                </h2>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
                    <WobbleCard
                        image="https://play-lh.googleusercontent.com/9FuYQc0AEJACWn2VmjqRI0R6kkMrEZw1TChkoNoVdqJ3ygRVluDLGmIDgna9xmHfCiw=w2560-h1440-rw"
                        containerClassName="col-span-1 lg:col-span-2 h-full bg-black min-h-[500px] lg:min-h-[300px]"
                        className=""
                        url="https://play.google.com/store/apps/details?id=com.theerastudios.ibuddy"
                    >
                        <div className="max-w-xs">
                            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                                Introducing PharmBuddy
                            </h2>
                            <p className="mt-8 text-left text-base/6 text-white">
                                A Platform created to help aspiring Pharmacy and
                                Life sciences students learn about different
                                Pharma Career opportunities, Job preparation,
                                Skill Development and update on Job vacancy.
                            </p>
                        </div>
                    </WobbleCard>

                    <WobbleCard
                        containerClassName="col-span-1 min-h-[300px] bg-white"
                        image="https://images.unsplash.com/photo-1553877690-c351cc96375a?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    >
                        <div className="flex items-center justify-center h-full">
                            <h2 className="text-center text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                                More, Launching Soon
                            </h2>
                        </div>
                    </WobbleCard>

                    <WobbleCard
                        url="https://gharkacoder.netlify.app/"
                        containerClassName="col-span-1 lg:col-span-3 bg-black min-h-[500px] lg:min-h-[500px] xl:min-h-[300px]"
                        image="https://gharkacoder.netlify.app/assets/images/hero/hero.png"
                    >
                        <div className="max-w-sm">
                            <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                                Introducing Ghar Ka Coder
                            </h2>
                            <p className="mt-8 max-w-[26rem] text-left  text-base/6 text-neutral-200">
                                A community-driven tech hub, where tech
                                enthusiasts (introvert devs) can learn,
                                collaborate, and innovate. Stay updated with the
                                latest tech, gain skills through challenges, and
                                connect with like-minded individuals.
                            </p>
                        </div>
                    </WobbleCard>
                </div>
            </div>
        </section>
    );
}