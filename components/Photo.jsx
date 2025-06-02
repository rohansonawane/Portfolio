"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Photo = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full h-full relative">
      {/* Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.4, ease: 'easeIn' }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.4, ease: 'easeInOut' }}
          className="w-[298px] h-[298px] xl:w-[498px] xl:h-[498px] absolute"
        >
          <Image
            src="/assets/Portfolio-picture.png"
            priority
            quality={90}
            fill
            sizes="(max-width: 768px) 298px, (max-width: 1200px) 498px, 100vw"
            alt="Rohan Sonawane - Full Stack Developer"
            className={`object-contain rounded-full transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsLoading(false)}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
          )}
        </motion.div>
        {/* Circle */}
        <motion.svg
          className="w-[300px] xl:w-[506px] h-[300px] xl:h-[506px]"
          fill="transparent"
          viewBox="0 0 506 506"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <motion.circle
            cx="253"
            cy="253"
            r="250"
            stroke="#00ff99"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ strokeDasharray: "24 10 0 0" }}
            animate={{
              strokeDasharray: ["15 120 25 25", "16 25 92 72", "4 250 22 22"],
              rotate: [120, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </motion.svg>
      </motion.div>
    </div>
  );
};

export default Photo;