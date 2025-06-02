"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {CiMenuFries, ciMenuFries} from 'react-icons/ci';

const MobileNav = () => {
   const pathname = usePathname();

   const navLinks = [
      { href: "#home", label: "Home" },
      { href: "#experience", label: "Work" },
      { href: "#skills", label: "Skills" },
      { href: "#projects", label: "Projects" },
      { href: "#contact", label: "Contact" },
   ];

   return (
      <Sheet>
         <SheetTrigger className="flex justify-center items-center">
            <CiMenuFries className="text-[32px] text-accent" />
         </SheetTrigger>
         <SheetContent className="flex flex-col">
            <div className="mt-32 mb-40 text-center text-2xl">
               <Link href="/">
                  <h1 className="text-4xl font-semibold">
                     Rohan<span className="text-accent">.</span>
                  </h1>
               </Link>
            </div>

            {/* Nav */}
            
            <nav className="flex flex-col items-center gap-4">
               {navLinks.map((link) => (
                  <Link
                     key={link.href}
                     href={link.href}
                     className={`text-sm font-medium ${
                        pathname === link.href
                           ? "text-accent"
                           : "text-white hover:text-accent"
                     }`}
                     onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(link.href.substring(1));
                        if (element) {
                           element.scrollIntoView({ behavior: "smooth" });
                        }
                     }}
                  >
                     {link.label}
                  </Link>
               ))}
            </nav>
         </SheetContent>
      </Sheet>
   );
}

export default MobileNav;
