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

   const handleLinkClick = (e, href) => {
      e.preventDefault();
      const element = document.getElementById(href.substring(1));
      if (element) {
         const headerOffset = 80; // Adjust this value based on your header height
         const elementPosition = element.getBoundingClientRect().top;
         const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

         window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
         });
      }
   };

   return (
      <nav className="flex flex-col xl:flex-row items-center gap-4 xl:gap-8">
         {navLinks.map((link) => (
            <Link
               key={link.href}
               href={link.href}
               className={`text-sm font-medium ${
                  pathname === link.href
                     ? "text-accent"
                     : "text-white hover:text-accent"
               }`}
               onClick={(e) => handleLinkClick(e, link.href)}
            >
               {link.label}
               </Link>
         ))}
      </nav>
   );
};

export default Nav;
