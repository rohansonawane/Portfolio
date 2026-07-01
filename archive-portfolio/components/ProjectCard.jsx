"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const ProjectCard = ({ project }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors duration-300"
    >
      <div className="relative h-48 w-full">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-white/80 mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-4">
          {project.github && (
            <Link
              href={project.github}
              target="_blank"
              className="text-accent hover:text-white transition-colors duration-300"
            >
              GitHub
            </Link>
          )}
          {project.live && (
            <Link
              href={project.live}
              target="_blank"
              className="text-accent hover:text-white transition-colors duration-300"
            >
              Live Demo
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard; 