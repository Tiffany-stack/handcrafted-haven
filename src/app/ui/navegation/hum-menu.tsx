"use client";
import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { Profile } from "@/app/lib/definitions";

export default function HumMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const toggleMenu = () => setIsOpen(!isOpen);
  const [isUser, setIsUser] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const router = useRouter();

 useEffect(() => {
    const fetchProfile = async () => {
      try {
          const res = await fetch(`../../api/users/`, { method: 'GET' });
          if (!res.ok) throw new Error("User not found");
          const data = await res.json();
          if(data?.baseinfo.email) {
            setProfile(data);
            setIsUser(true);
          } else {
              setIsUser(false);
          }
      } catch (err) {
          setIsUser(false);
          setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
          setLoading(false);
      }
    };

    fetchProfile();
  }, []);
 
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Members", href: "/members" },
    { name: "Products", href: "/navegation/products" },
    { name: "Contacts", href: "/contacts" },
    ...(isUser ? [{ name: "Product Management", href: "/navegation/product-management" }] : []),
  ];
 
  async function handleLogout() {
      try {
          setLoading(true); // Indicate loading state
  
          const res = await fetch('/api/users/', { method: 'DELETE' });
  
          if (!res.ok) throw new Error("Failed to logout");
  
          await res.json(); // Optional: Handle response if necessary
  
          setProfile(null);
          setIsUser(false);
          setError("no user");
          router.push('/login');
      } catch (err) {
          setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
          setLoading(false); // Stop loading state
      }
  } 
     
  return (
    <div className="z-10 px-4 md:px-8 py-2 text-white font-bold bg-gray-800 bg-opacity-50 shadow-md backdrop-blur-md rounded-b-lg">
      <div className="flex items-center justify-between px-6 py-2">
        {/* Left: Logo */}
        <Link key={"logo"}href={'/'}>
        <img src="/favicon.ico" alt="Handcrafted Haven Logo" className="h-8 w-8 mr-10" /> 
        </Link>

        {profile?.baseinfo?.first_name && <span className="text-white text-base">
            Hello, {profile?.baseinfo?.first_name}!
        </span>} 

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
          {error ? navLinks.some(link => link.href === pathname) && (
                  <Link key={"loginh"} href="/login" className="text-white text-base focus:outline-none">
                      <div className="flex items-center justify-between">
                          <span>Log in</span>
                          <ArrowRightIcon className="w-5 md:w-6 ml-2" />
                      </div>
                  </Link>
              )
                : profile?.baseinfo?.first_name && <div className="flex items-center justify-between space-x-4">
                        <button
                            onClick={handleLogout} // Add the logout function
                            className="bg-red-600 text-white px-4 py-2 rounded-lg focus:outline-none hover:bg-red-700"
                        >
                            Logout
                        </button>
                  </div>  
          }
        </div>
      )}
    </div>
  );
}