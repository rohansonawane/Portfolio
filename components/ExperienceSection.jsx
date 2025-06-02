"use client";

import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaReact, FaNodeJs, FaPhp, FaUnity, FaPython, FaDocker, FaGitAlt, FaWordpress, FaShopify, FaAws } from 'react-icons/fa';
import { SiOpenai, SiTensorflow, SiMongodb, SiMysql, SiTailwindcss, SiNextdotjs, SiTypescript } from 'react-icons/si';

const ExperienceSection = () => {
  const experiences = [
    {
      title: "AI / VR Research Assistant",
      company: "CSU Dominguez Hills",
      location: "Carson, CA",
      period: "Aug 2023 - May 2025",
      skills: [
        { name: "Unity", icon: <FaUnity className="text-2xl" /> },
        { name: "OpenAI", icon: <SiOpenai className="text-2xl" /> },
        { name: "Python", icon: <FaPython className="text-2xl" /> },
        { name: "TensorFlow", icon: <SiTensorflow className="text-2xl" /> },
        { name: "React", icon: <FaReact className="text-2xl" /> },
        { name: "Next.js", icon: <SiNextdotjs className="text-2xl" /> }
      ],
      achievements: [
        "Developed immersive VR classroom with Unity & OpenAI, boosting engagement by 40%",
        "Created LLM-powered NPC teachers improving knowledge retention by 50%",
        "Built department website and mentored 6 students in VR development"
      ],
      animation: { x: -100, opacity: 0 }
    },
    {
      title: "Full Stack SDE",
      company: "Self-Employed",
      location: "Mumbai, India",
      period: "Aug 2020 - Jul 2023",
      skills: [
        { name: "React", icon: <FaReact className="text-2xl" /> },
        { name: "Node.js", icon: <FaNodeJs className="text-2xl" /> },
        { name: "TypeScript", icon: <SiTypescript className="text-2xl" /> },
        { name: "AWS", icon: <FaAws className="text-2xl" /> },
        { name: "PHP", icon: <FaPhp className="text-2xl" /> },
        { name: "Docker", icon: <FaDocker className="text-2xl" /> },
        { name: "Git", icon: <FaGitAlt className="text-2xl" /> },
        { name: "MongoDB", icon: <SiMongodb className="text-2xl" /> }
      ],
      achievements: [
        "Built 15+ full-stack apps improving UI responsiveness by 40%",
        "Implemented CI/CD pipelines reducing load times by 50%",
        "Delivered 7 client projects with 95% satisfaction rate"
      ],
      animation: { y: 50, opacity: 0 }
    },
    {
      title: "Full Stack SDE",
      company: "Briefkase Digital Communications",
      location: "Mumbai, India",
      period: "Jun 2016 - Sep 2020",
      skills: [
        { name: "WordPress", icon: <FaWordpress className="text-2xl" /> },
        { name: "Shopify", icon: <FaShopify className="text-2xl" /> },
        { name: "TypeScript", icon: <SiTypescript className="text-2xl" /> },
        { name: "AWS", icon: <FaAws className="text-2xl" /> },
        { name: "PHP", icon: <FaPhp className="text-2xl" /> },
        { name: "MySQL", icon: <SiMysql className="text-2xl" /> },
        { name: "React", icon: <FaReact className="text-2xl" /> }
      ],
      achievements: [
        "Led 5-member team delivering 60+ web applications",
        "Improved website performance by 70% and security by 80%",
        "Developed custom themes for WordPress, Magento & Shopify"
      ],
      animation: { x: 100, opacity: 0 }
    }
  ];

  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent opacity-30" />
      <div className="absolute inset-0 bg-[url('/assets/honeycomb-pattern.svg')] opacity-5" />
      
      <div className="relative flex flex-col gap-[30px] text-center xl:text-left">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-white mb-4 text-center"
        >
          Work Experience
        </motion.h2>
        <p className="text-white/60 max-w-2xl mx-auto text-center">As a Full Stack Web Developer with over seven years of experience, I've specialized in crafting secure, high-quality web solutions that prioritize user experience and system performance.</p>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={exp.animation}
              whileInView={{ x: 0, y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-accent/50 transition-all duration-300 h-full"
            >
              <div className="flex flex-col gap-2 mb-4">
                <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                <div className="flex flex-col gap-1">
                  <p className="text-accent">{exp.company}</p>
                  <div className="flex flex-col gap-2">
                    <div className="h-[1px] w-full bg-white/10"></div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/60 text-sm">{exp.location}</span>
                      <div className="h-4 w-[1px] bg-white/20"></div>
                      <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                        {exp.period}
                      </span>
                    </div>
                    <div className="h-[1px] w-full bg-white/10"></div>
                  </div>
                </div>
              </div>
              
              {/* Skills Section */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-3">
                  {exp.skills.map((skill, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-accent hover:bg-accent/20 transition-colors duration-300"
                    >
                      {skill.icon}
                      <span className="text-sm text-white/80">{skill.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="h-[1px] w-full bg-white/10 mb-4"></div>
              
              <ul className="space-y-4">
                {exp.achievements.map((achievement, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="group"
                  >
                    <div className="relative overflow-hidden bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute -inset-1 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <p className="text-white/80 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
                          {achievement}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceSection; 