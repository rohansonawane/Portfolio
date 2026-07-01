"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-[298px] h-[298px] md:w-[498px] md:h-[498px]"
        >
          <Image
            src="/assets/Portfolio-picture.png"
            alt="Rohan Sonawane - Full Stack Developer"
            fill
            priority
            quality={90}
            sizes="(max-width: 768px) 298px, (max-width: 1200px) 498px, 100vw"
            className="object-contain rounded-full transition-opacity duration-300"
            style={{
              objectFit: "contain",
              willChange: "transform"
            }}
            loading="eager"
            fetchPriority="high"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero; 