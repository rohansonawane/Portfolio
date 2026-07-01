"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CiMenuFries } from 'react-icons/ci';
import { useState, useEffect, useRef } from "react";
import Nav from "./Nav";
import { Button } from "./ui/button";
import Link from "next/link";

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const scrollPositionRef = useRef(0);
  const isClosingRef = useRef(false);

  // Handle menu open/close
  const handleOpenChange = (newOpen) => {
    if (newOpen) {
      // Save scroll position when opening
      scrollPositionRef.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      isClosingRef.current = false;
    } else {
      // Mark as closing to prevent scroll jumps
      isClosingRef.current = true;
      document.body.style.overflow = 'unset';
      
      // Use requestAnimationFrame to ensure the scroll position is restored after the menu animation
      requestAnimationFrame(() => {
        if (isClosingRef.current) {
          window.scrollTo({
            top: scrollPositionRef.current,
            behavior: 'instant'
          });
          isClosingRef.current = false;
        }
      });
    }
    setOpen(newOpen);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
      isClosingRef.current = false;
    };
  }, []);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger className="flex justify-center items-center">
        <CiMenuFries className="text-[32px] text-accent" />
      </SheetTrigger>
      <SheetContent className="flex flex-col overflow-y-auto">
        <div className="mt-32 mb-40 text-center text-2xl">
          <button 
            onClick={() => {
              handleOpenChange(false);
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            }} 
            className="text-4xl font-semibold"
          >
            Rohan<span className="text-accent">.</span>
          </button>
        </div>

        {/* Use the same Nav component as desktop */}
        <div className="flex flex-col items-center gap-8">
          <Nav />
          <Link href="#contact" onClick={() => handleOpenChange(false)}>
            <Button>Hire me</Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
