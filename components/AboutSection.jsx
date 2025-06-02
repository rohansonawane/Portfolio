"use client";

import { motion } from "framer-motion";
import { FaLaptopCode } from 'react-icons/fa';
import { ScrollArea } from '@/components/ui/scroll-area';

const AboutSection = () => {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-6">About Me</h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8">
            A seasoned Full Stack Developer with a Master's degree in Computer Science from California State University, Dominguez Hills. 
            With over 8 years of hands-on experience in software development, I specialize in building scalable applications, 
            implementing AI/ML solutions, and creating immersive VR experiences. My expertise spans across modern web technologies, 
            cloud architecture, and emerging tech trends, enabling me to deliver innovative solutions that drive business growth.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection; 