"use client";

import React from "react";

export default function DemoVideo() {
    return (
        <section className="py-24 px-4 bg-white">
            <div className="">
                <h2 className="text-5xl font-bold text-center max-w-1xl mx-auto text-black">
                    What is Weekend Jamming?
                </h2>

                <div className="mt-12 max-w-7xl mx-auto w-full">
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                        {/* YouTube Embed */}
                        <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src="https://www.youtube.com/embed/w-n-q5uHBYM?si=SvYYkGhZg3fpdU1r&autoplay=1&loop=1&playlist=w-n-q5uHBYM"
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ border: 0 }}
                        ></iframe>

                        {/* Overlay Content
                        <div className="absolute inset-0 bg-black/30 flex items-center p-8 z-10">
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
                        </div> */}
                    </div>
                </div>
            </div>
        </section>
    );
}
