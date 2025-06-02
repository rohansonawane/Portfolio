"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FaReact, FaNodeJs, FaPython, FaDatabase } from "react-icons/fa";
import { SiTypescript, SiTailwindcss, SiMongodb, SiDocker } from "react-icons/si";

const FloatingSkills = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Enhanced parallax effect with reduced movement on mobile
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const x1 = useTransform(scrollYProgress, [0, 1], [0, -25]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, 25]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const leftSkills = [
    { icon: <FaReact className="w-5 h-5 md:w-6 md:h-6" /> },
    { icon: <FaNodeJs className="w-5 h-5 md:w-6 md:h-6" /> },
    { icon: <FaPython className="w-5 h-5 md:w-6 md:h-6" /> },
    { icon: <FaDatabase className="w-5 h-5 md:w-6 md:h-6" /> }
  ];

  const rightSkills = [
    { icon: <SiTypescript className="w-5 h-5 md:w-6 md:h-6" /> },
    { icon: <SiTailwindcss className="w-5 h-5 md:w-6 md:h-6" /> },
    { icon: <SiMongodb className="w-5 h-5 md:w-6 md:h-6" /> },
    { icon: <SiDocker className="w-5 h-5 md:w-6 md:h-6" /> }
  ];

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full z-20 pointer-events-none">
      {/* Left Skills Box */}
      <motion.div
        style={{ y: y1, x: x1, opacity }}
        className="absolute left-[5%] md:left-[15%] top-[85%] -translate-y-1/2"
      >
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-2 md:p-4 border border-white/10">
          <div className="flex gap-3 md:gap-6">
            {leftSkills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-accent hover:scale-110 transition-transform duration-300"
              >
                {skill.icon}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Skills Box */}
      <motion.div
        style={{ y: y2, x: x2, opacity }}
        className="absolute right-[5%] md:right-[15%] top-[35%] -translate-y-1/2"
      >
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-2 md:p-4 border border-white/10">
          <div className="flex gap-3 md:gap-6">
            {rightSkills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-accent hover:scale-110 transition-transform duration-300"
              >
                {skill.icon}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FloatingSkills; 