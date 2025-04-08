"use client";
//import { HomeIcon, PhoneIcon } from '@heroicons/react/24/outline';
{/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
//import { FaFacebook, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { ArrowRightIcon } from '@heroicons/react/16/solid';
import { useEffect, useState } from 'react';
import { Profile } from '@/app/lib/definitions';

export default function NavBar() {
    const pathname = usePathname();
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

    //if (loading) return <p>Loading...</p>;
    //if (error) return <p>Error: {error}</p>;

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
    
            const res = await fetch('/api/users/', {method: 'DELETE'});
    
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
        <div className="flex z-10 px-4 md:px-8 py-2 items-center text-white font-bold bg-gray-800 bg-opacity-50 shadow-md backdrop-blur-md rounded-b-lg">

            <div className="flex items-center justify-between px-6 py-2 w-full">
                <div className='flex items-center'>
                    {/* Left Logo */}
                    <Link key={"logo"} href={'/'}>
                    <img src="/favicon.ico" alt="Handcrafted Haven Logo" className="h-8 w-8 mr-10" />
                    </Link>

                    <div className="border-transparent px-6"></div>

                    {/* Navigation Links with Vertical Separators */}
                    <div className="flex">
                        {navLinks.map((link, index) => {
                            return (
                                <div key={link.name} className="flex items-center">
                                    <Link
                                        href={link.href}
                                        className={clsx(
                                            'flex h-[45px] items-center justify-center gap-2 px-4 text-sm hover:bg-sky-100 hover:text-blue-600 rounded-md md:px-3',
                                            {
                                                'bg-sky-100 text-blue-600': pathname === link.href,
                                            },
                                        )}
                                    >
                                        <p className="hidden md:block">{link.name}</p>
                                    </Link>

                                    {/* Vertical Line (Except After Last Item) */}
                                    {index < navLinks.length - 1 && (
                                        <div className="h-6 w-px bg-gray-500 mx-2"></div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Log in Button (Only shows if current page matches a nav link) */}
                
                {error ? navLinks.some(link => link.href === pathname) && (
                        <Link key={"login"} href="/login" className="text-white text-base focus:outline-none">
                            <div className="flex items-center justify-between">
                                <span>Log in</span>
                                <ArrowRightIcon className="w-5 md:w-6 ml-2" />
                            </div>
                        </Link>
                    )
                        : profile?.baseinfo?.first_name && <div className="flex items-center justify-between space-x-4">
                                <span className="text-white text-base">
                                    Hello, {profile?.baseinfo?.first_name}!
                                </span>
                                <button
                                    onClick={handleLogout} // Add the logout function
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg focus:outline-none hover:bg-red-700"
                                >
                                    Logout
                                </button>
                        </div>
                }
            </div>
        </div>
    )
}