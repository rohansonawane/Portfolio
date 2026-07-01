"use client";

import { motion } from "framer-motion";

const GridPattern = ({ className = "", opacity = 0.1, size = "sm" }) => {
  const gridSize = {
    sm: "bg-[size:20px_20px]",
    md: "bg-[size:30px_30px]",
    lg: "bg-[size:40px_40px]",
  }[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: opacity,
        scale: 1,
        rotate: [0, 5, -5, 0],
      }}
      transition={{ 
        duration: 1.5,
        ease: "easeInOut",
        rotate: {
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }
      }}
      className={`absolute inset-0 pointer-events-none ${gridSize} ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `,
      }}
    />
  );
};

export default GridPattern; 