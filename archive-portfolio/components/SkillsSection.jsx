"use client";

import { motion } from "framer-motion";

const SkillsSection = ({ skills }) => {
  return (
    <div className="flex flex-col gap-[30px] text-center xl:text-left">
      <h3 className="text-4xl font-bold">{skills.title}</h3>
      <p className="text-white/80 max-w-[600px] mx-auto xl:mx-0">
        {skills.description}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {skills.skilllist.map((skill, index) => (
          <motion.div
            key={`skill-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center xl:items-start gap-2 bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors duration-300"
          >
            <div className="text-2xl text-accent">
              {skill.icon}
            </div>
            <span className="text-white/80">
              {skill.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection; 