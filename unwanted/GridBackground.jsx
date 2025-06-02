"use client";

import { motion } from "framer-motion";

const GridBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-black">
      {/* Main grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:14px_24px]">
        {/* Accent color glow effects */}
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-accent opacity-10 blur-[100px]"></div>
        <div className="absolute left-1/4 bottom-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-accent opacity-10 blur-[100px]"></div>
        <div className="absolute right-1/4 top-1/2 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-accent opacity-10 blur-[100px]"></div>
      </div>
      
      {/* Gradient overlays */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#1a1a1a,transparent)]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_800px_at_80%_-100px,#0a0a0a,transparent)]"
      />
      
      {/* Accent color highlights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),transparent_70%)]"></div>
    </div>
  );
};

export default GridBackground; 