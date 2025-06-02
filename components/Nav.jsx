"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Nav = () => {
   const pathname = usePathname();

   const navLinks = [
      { href: "#home", label: "Home" },
      { href: "#experience", label: "Work" },
      { href: "#skills", label: "Skills" },
      { href: "#projects", label: "Projects" },
      { href: "#contact", label: "Contact" },
   ];

   return (
      <nav className="flex items-center gap-8">
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
   );
};

export default Nav;
