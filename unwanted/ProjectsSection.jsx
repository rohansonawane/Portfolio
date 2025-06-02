"use client";

import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { SiUnity, SiGooglechrome, SiNextdotjs, SiPython } from 'react-icons/si';

const ProjectsSection = () => {
  const projects = [
    {
      title: "VR Classroom with AI Teachers",
      description: "Designed and developed an immersive VR classroom using Unity (XR Toolkit, C#, OpenAI, Convai), increasing student engagement by 40% and receiving positive faculty feedback.",
      tech: ["Unity", "C#", "OpenAI", "Convai", "Blender"],
      icon: <SiUnity className="text-2xl" />,
      link: "#"
    },
    {
      title: "Selective Content Hider",
      description: "Chrome extension for real-time hiding of website elements, enhancing user productivity and focus. Features drag-to-select UI and robust CSS selector logic.",
      tech: ["JavaScript", "HTML5", "CSS3", "Chrome APIs"],
      icon: <SiGooglechrome className="text-2xl" />,
      link: "#"
    },
    {
      title: "Portfolio Website",
      description: "Modern, responsive portfolio website using Next.js and Tailwind CSS, showcasing projects and skills with an accessible UI and smooth animations.",
      tech: ["Next.js", "React.js", "Tailwind CSS", "Framer Motion"],
      icon: <SiNextdotjs className="text-2xl" />,
      link: "https://rohansonawane.tech"
    },
    {
      title: "Cancer Subtype Classification",
      description: "Built a deep neural network to classify 6 cancer subtypes from integrated mRNA, miRNA, and SNV data, achieving 88.5% AUC and 78.2% accuracy.",
      tech: ["Python", "Deep Learning", "Multi-Omics", "XAI"],
      icon: <SiPython className="text-2xl" />,
      link: "#"
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl mx-auto px-4 py-16"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">Featured Projects</h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          A selection of my most impactful projects, showcasing my expertise in full-stack development, AI/ML, and immersive technologies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors duration-300"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-accent">{project.icon}</div>
                <div className="flex gap-4">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-accent transition-colors duration-300"
                  >
                    <FaExternalLinkAlt />
                  </a>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
              <p className="text-white/60 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-3 py-1 text-sm bg-white/10 rounded-full text-white/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default ProjectsSection; 