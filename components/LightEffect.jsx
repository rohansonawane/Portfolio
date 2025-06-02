"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LightEffect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Vertical lightsaber beams */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`vertical-${i}`}
          initial={{ y: -100, opacity: 0 }}
          animate={{
            y: ["-100%", "200%"],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 1,
            ease: "linear",
          }}
          className="absolute w-[2px] h-[200px]"
          style={{
            left: `${25 * (i + 1)}%`,
            background: "linear-gradient(to bottom, transparent, #00ff99, transparent)",
            filter: "blur(1px)",
          }}
        />
      ))}

      {/* Horizontal lightsaber beams */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`horizontal-${i}`}
          initial={{ x: -100, opacity: 0 }}
          animate={{
            x: ["-100%", "200%"],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 1 + 0.5,
            ease: "linear",
          }}
          className="absolute h-[2px] w-[200px]"
          style={{
            top: `${25 * (i + 1)}%`,
            background: "linear-gradient(to right, transparent, #00ff99, transparent)",
            filter: "blur(1px)",
          }}
        />
      ))}

      {/* Mouse-following light */}
      <motion.div
        animate={{
          x: mousePosition.x - 150,
          y: mousePosition.y - 150,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
          mass: 2,
        }}
        className="absolute w-[300px] h-[300px] rounded-full bg-accent/10 blur-[100px]"
      />
    </div>
  );
};

export default LightEffect; 