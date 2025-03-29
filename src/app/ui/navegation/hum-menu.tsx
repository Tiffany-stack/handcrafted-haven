"use client";
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { ArrowRightIcon } from "@heroicons/react/16/solid";

export default function HumMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Contacts", href: "/contacts" },
    { name: "Members", href: "/members" },
  ];

  return (
    <div className="z-10 px-4 md:px-8 py-2 text-white font-bold bg-gray-800 bg-opacity-50 shadow-md backdrop-blur-md rounded-b-lg">
      <div className="flex items-center justify-between px-6 py-2">
        {/* Left: Logo */}
        <Link href={'/'}>
            <div className=" text-2xl font-bold mr-10">HFH</div>
        </Link>

        {/* Right: Hamburger Menu Button (Only Visible on Mobile) */}
        <button onClick={toggleMenu} className="text-white text-2xl md:hidden focus:outline-none">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isOpen && (
        <div className="flex flex-col items-center space-y-4 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "block w-full text-center py-2 px-6 rounded-md text-lg hover:bg-sky-100 hover:text-blue-600 transition",
                { "bg-sky-100 text-blue-600": pathname === link.href }
              )}
              onClick={() => setIsOpen(false)} // Close menu on click
            >
              {link.name}
            </Link>
          ))}

          {/* Log in Button (Only shows if current page matches a nav link) */}
          {navLinks.some(link => link.href === pathname) && (
            <Link href="/login" className="text-white text-base focus:outline-none">
                <div className="flex items-center justify-between">
                    <span>Log in</span>
                    <ArrowRightIcon className="w-5 md:w-6 ml-2" />
                </div>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}