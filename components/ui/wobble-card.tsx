"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const WobbleCard = ({
    children,
    containerClassName,
    image,
    className,
}: {
    children: React.ReactNode;
    containerClassName?: string;
    image: string;
    className?: string;
    url?: string;
}) => {
    const content = (
        <motion.section
            className={cn(
                "mx-auto w-full relative rounded-2xl overflow-hidden border border-white",
                containerClassName
            )}
            style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderWidth: "1px",
            }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-80 z-10"></div>

            <div
                className="relative h-full sm:mx-0 sm:rounded-2xl overflow-hidden"
                style={{
                    boxShadow:
                        "0 10px 32px rgba(34, 42, 53, 0.12), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.05), 0 4px 6px rgba(34, 42, 53, 0.08), 0 24px 108px rgba(47, 48, 55, 0.10)",
                }}
            >
                <motion.div
                    className={cn(
                        "relative h-full px-4 py-20 sm:px-10 z-20",
                        className
                    )}
                >
                    {children}
                </motion.div>
            </div>
        </motion.section>
    );

    return (
        content
    );
};