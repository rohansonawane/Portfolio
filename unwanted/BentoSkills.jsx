"use client";

import { motion } from "framer-motion";
import { 
  FaPython, FaJava, FaPhp, FaHtml5, FaCss3, FaJs, FaReact, FaNodeJs, 
  FaWordpress, FaShopify, FaDocker, FaAws, FaGoogle, FaGitAlt,
  FaDatabase, FaServer, FaCloud, FaTools, FaCode, FaBrain, FaChartLine
} from 'react-icons/fa';
import { 
  SiTypescript, SiCplusplus, SiCsharp, SiDotnet, SiMysql, SiPostgresql, 
  SiMongodb, SiRedis, SiAmazonaws, SiGooglecloud, SiJenkins, SiVercel, 
  SiKubernetes, SiTerraform, SiApachehadoop, SiApachespark, SiTensorflow, 
  SiPytorch, SiScikitlearn, SiOpenai, SiPowerbi, SiGraphql, SiFigma, 
  SiTailwindcss, SiNextdotjs, SiAngular, SiFlask, SiDjango, SiExpress, 
  SiBootstrap, SiUnity, SiBlender, SiGo
} from 'react-icons/si';

const skillCategories = [
  {
    title: "Programming Languages",
    description: "Core languages I work with",
    icon: <FaCode className="text-4xl text-accent" />,
    skills: [
      { name: "Python", icon: <FaPython /> },
      { name: "Go", icon: <SiGo /> },
      { name: "JavaScript", icon: <FaJs /> },
      { name: "TypeScript", icon: <SiTypescript /> },
      { name: "PHP", icon: <FaPhp /> },
      { name: "Java", icon: <FaJava /> },
      { name: "C++", icon: <SiCplusplus /> },
      { name: "C#", icon: <SiCsharp /> },
      { name: ".NET", icon: <SiDotnet /> },
      { name: "SQL", icon: <FaDatabase /> },
      { name: "HTML5", icon: <FaHtml5 /> },
      { name: "CSS3", icon: <FaCss3 /> }
    ]
  },
  {
    title: "Frameworks & Tools",
    description: "Frameworks and development tools",
    icon: <FaTools className="text-4xl text-accent" />,
    skills: [
      { name: "React", icon: <FaReact /> },
      { name: "Next.js", icon: <SiNextdotjs /> },
      { name: "Angular", icon: <SiAngular /> },
      { name: "Flask", icon: <SiFlask /> },
      { name: "Django", icon: <SiDjango /> },
      { name: "Express.js", icon: <SiExpress /> },
      { name: "WordPress", icon: <FaWordpress /> },
      { name: "Bootstrap", icon: <SiBootstrap /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss /> },
      { name: "CMS", icon: <FaTools /> },
      { name: "Unity 3D", icon: <SiUnity /> },
      { name: "Blender", icon: <SiBlender /> }
    ]
  },
  {
    title: "Cloud & DevOps",
    description: "Infrastructure and deployment stack",
    icon: <FaCloud className="text-4xl text-accent" />,
    skills: [
      { name: "AWS", icon: <FaAws /> },
      { name: "Google Cloud", icon: <SiGooglecloud /> },
      { name: "Docker", icon: <FaDocker /> },
      { name: "Jenkins", icon: <SiJenkins /> },
      { name: "Git", icon: <FaGitAlt /> },
      { name: "Vercel", icon: <SiVercel /> },
      { name: "Kubernetes", icon: <SiKubernetes /> },
      { name: "Terraform", icon: <SiTerraform /> },
      { name: "MySQL", icon: <SiMysql /> },
      { name: "PostgreSQL", icon: <SiPostgresql /> },
      { name: "MongoDB", icon: <SiMongodb /> },
      { name: "Redis", icon: <SiRedis /> }
    ]
  },
  {
    title: "AI/ML & Data",
    description: "Advanced technologies and analytics",
    icon: <FaBrain className="text-4xl text-accent" />,
    skills: [
      { name: "Machine Learning", icon: <FaBrain /> },
      { name: "TensorFlow", icon: <SiTensorflow /> },
      { name: "PyTorch", icon: <SiPytorch /> },
      { name: "scikit-learn", icon: <SiScikitlearn /> },
      { name: "OpenAI", icon: <SiOpenai /> },
      { name: "Power BI", icon: <SiPowerbi /> },
      { name: "Data Analysis", icon: <FaChartLine /> },
      { name: "GraphQL", icon: <SiGraphql /> },
      { name: "UI/UX Design", icon: <SiFigma /> },
      { name: "REST API", icon: <FaServer /> }
    ]
  }
];

const BentoSkills = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {skillCategories.map((category, index) => (
          <div 
            key={index}
            className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-accent/50 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {category.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors duration-300">{category.title}</h3>
                <p className="text-white/60 text-xs">{category.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {category.skills.map((skill, skillIndex) => (
                <motion.div
                  key={skillIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: skillIndex * 0.05 }}
                  className="group/skill"
                >
                  <div className="relative overflow-hidden bg-white/5 hover:bg-white/10 rounded-lg p-2 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 group-hover/skill:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute -inset-1 bg-accent/20 blur-xl opacity-0 group-hover/skill:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex flex-col items-center justify-center">
                      <motion.div 
                        className="text-2xl mb-1 text-accent"
                        whileHover={{ 
                          scale: 1.2,
                          rotate: [0, -5, 5, -5, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        {skill.icon}
                      </motion.div>
                      <span className="text-xs text-white/80 text-center group-hover/skill:text-white transition-colors duration-300">{skill.name}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BentoSkills; 