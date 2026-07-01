"use client";

import {BsArrowDownRight} from 'react-icons/bs';
import Link from 'next/link';

const skills = [
  {
    num: '01',
    title: 'Software Development',
    description: "Skilled Software Development Engineer (SDE) with expertise in full-stack development, scalable architectures, and performance optimization",
    href: ""
  },
  {
    num: '02',
    title: 'UI/UX Design',
    description: "Create intuitive, user-friendly interfaces that enhance user experience and drive engagement.",
    href: ""
  },
  {
    num: '03',
    title: 'AI/ML Solutions',
    description: "Expert in AI/ML, including Generative AI, NLP, computer vision, and model optimization for intelligent, scalable solutions.",
    href: ""
  },
  {
    num: '04',
    title: 'API Development & Integration',
    description: "Build and integrate custom APIs to connect your applications, streamline processes, and enhance functionality across platforms.",
    href: ""
  },
  {
    num: '05',
    title: 'DevOps',
    description: "Experienced in DevOps, CI/CD pipelines, Docker, Kubernetes, cloud automation, and infrastructure as code for seamless deployments.",
    href: ""
  },
  {
    num: '06',
    title: 'SRE',
    description: "Experienced Site Reliability Engineer (SRE) specializing in system scalability, incident response, observability, and automation for high availability",
    href: ""
  },
];

import {motion} from "framer-motion";

const Skills = () => {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center py-12 xl:py-0">
      <div className="container mx-auto">
      <motion.div initial={{opacity:0}} animate={{opacity:1, transition:{delay: 2.4, duration: 0.4, ease: "easeIn"}}}
      className="grid grid-cols-1 md:grid-cols-2 gap-[60px]">
        {skills.map((service, index) =>{
          return <div key={index} className="flex-1 flex flex-col justify-center gap-6 group">
            <div className="w-full flex justify-between items-center">
              <div className="text-5xl font-extrabold text-outline text-transparent group-hover:text-outline-hover ">{service.num}</div>
              <Link href={service.href} className="w-[70px] h-[70px] rounded-full bg-white group-hover:bg-accent transition-all duration-500 flex justify-center items-center hover:-rotate-45">
                <BsArrowDownRight className="text-primary text-3xl"/>
              </Link>
            </div>
            <h2 className="text-[42px] font-bold leading-none text-white group-hover:text-accent transition-all duration-500">{service.title}</h2>
            <p className="text-white/80">{service.description}</p>
            <div className="border-b border-white/20 w-full"></div>
          </div>
        })}
      </motion.div>
      </div>
    </section>
  )
}

export default Skills;
