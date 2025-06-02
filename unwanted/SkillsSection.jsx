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
    title: "Cloud, DevOps & Data",
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
      { name: "Redis", icon: <SiRedis /> },
      { name: "Hadoop", icon: <SiApachehadoop /> },
      { name: "Spark", icon: <SiApachespark /> }
    ]
  },
  {
    title: "AI/ML & Business",
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
      { name: "REST API", icon: <FaServer /> },
      { name: "Cloud Services", icon: <FaCloud /> }
    ]
  }
];

const SkillsSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
        {skillCategories.map((category, index) => (
          <div key={index} className="bg-white/5 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-accent mb-4">{category.title}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {category.skills.map((skill, skillIndex) => (
                <div
                  key={skillIndex}
                  className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-lg hover:bg-accent/20 transition-colors duration-300"
                >
                  <div className="text-2xl mb-2 text-accent">{skill.icon}</div>
                  <span className="text-sm text-white/80 text-center">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SkillsSection; 