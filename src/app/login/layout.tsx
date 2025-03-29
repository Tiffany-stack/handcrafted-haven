'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import HumMenu from "../ui/navegation/hum-menu";
import NavBar from "../ui/navegation/nav-bar";


export const experimental_ppr = true;
 
export default function Layout({ children }: { children: React.ReactNode }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
        if (window.scrollY <= 120) {
            setIsVisible(true); // Show when at the top
        } else {
            setIsVisible(false); // Hide on scroll down
        }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
        window.removeEventListener("scroll", handleScroll);
        };
    }, []);

  return (
    <div className="bg-gray-50 relative min-h-screen">
        <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={isVisible ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 text-white text-center py-4 shadow-lg z-50"
        >
            <div className="hidden md:block fixed top-0 left-0 right-0">
                <NavBar />
            </div>
            <div className='md:hidden fixed top-0 left-0 right-0'>
                <HumMenu />
            </div>
        </motion.div>

        <div className="flex-1">{children}</div>

        {/* Footer Section */}
        <footer className="bg-gray-800 text-white py-8 text-center">
            <p>© 2025 Handcrafted Haven. All rights reserved.</p>
        </footer>
    </div>
  );
}