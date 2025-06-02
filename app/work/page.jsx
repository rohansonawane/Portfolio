"use client";

import { motion } from "framer-motion";
import { projects } from "@/lib/constants";
import ProjectCard from "@/components/ProjectCard";

const Work = () => {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center py-12 xl:py-0">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="h1 mb-4">My Work</h1>
          <p className="text-white/80 max-w-[600px] mx-auto">
            A collection of projects showcasing my expertise in full-stack development,
            AI/ML, VR, and data visualization.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;