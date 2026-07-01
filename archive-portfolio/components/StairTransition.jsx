"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Stairs from "./Stairs";

const StairTransition = () => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <div key={pathname} className="fixed inset-0 pointer-events-none z-40">
        <div className="h-full w-full">
          <Stairs />
        </div>
        <motion.div 
          className="absolute inset-0 bg-primary" 
          initial={{opacity: 1}}
          animate={{
            opacity: 0,
            transition: { delay: 1, duration: 0.4, ease: "easeInOut" },
          }}
          style={{
            willChange: "opacity"
          }}
        />
      </div>
    </AnimatePresence>
  );
};

export default StairTransition; 