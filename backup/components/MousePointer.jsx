"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MousePointer = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      <div className="w-4 h-4 rounded-full bg-accent/20 shadow-lg shadow-accent/10" />
    </motion.div>
  );
};

export default MousePointer; 