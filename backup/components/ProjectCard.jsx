"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiGithub, FiExternalLink } from "react-icons/fi";

const ProjectCard = ({ project }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 p-6 rounded-lg hover:bg-white/10 transition-colors"
    >
      <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
      <p className="text-white/80 mb-4">{project.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map((tech, index) => (
          <span
            key={index}
            className="px-3 py-1 text-sm bg-accent/20 text-accent rounded-full"
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
            rel="noopener noreferrer"
            className="text-white/80 hover:text-accent transition-colors"
            aria-label={`View ${project.title} on GitHub`}
          >
            <FiGithub className="text-xl" />
          </Link>
        )}
        {project.live && (
          <Link
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-accent transition-colors"
            aria-label={`View ${project.title} live`}
          >
            <FiExternalLink className="text-xl" />
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard; 