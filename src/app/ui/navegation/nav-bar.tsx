"use client";
//import { HomeIcon, PhoneIcon } from '@heroicons/react/24/outline';
{/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
import { FaFacebook, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { ArrowRightIcon } from '@heroicons/react/16/solid';


export default function NavBar() {
    const pathname = usePathname();

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Contacts", href: "/contacts" },
        { name: "Members", href: "/members" },
    ];

    return (
        <div className="flex z-10 px-4 md:px-8 py-2 items-center text-white font-bold bg-gray-800 bg-opacity-50 shadow-md backdrop-blur-md rounded-b-lg">

            <div className="flex items-center justify-between px-6 py-2 w-full">
                <div className='flex items-center'>
                    {/* Left Logo */}
                    <Link href={'/'}>
                        <div className=" text-2xl font-bold mr-10">HFH</div>
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
                {navLinks.some(link => link.href === pathname) && (
                    <Link href="/login" className="text-white text-base focus:outline-none">
                        <div className="flex items-center justify-between">
                            <span>Log in</span>
                            <ArrowRightIcon className="w-5 md:w-6 ml-2" />
                        </div>
                    </Link>
                )}
            </div>

        </div>
    )
}