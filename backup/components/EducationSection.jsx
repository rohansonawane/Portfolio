"use client";

import { motion } from "framer-motion";
import { FaGraduationCap, FaAward } from 'react-icons/fa';

const EducationSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl mx-auto px-4 py-16"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">Education</h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          My academic journey and achievements in computer science and technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/5 p-6 rounded-lg hover:bg-white/10 transition-colors duration-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="text-accent text-2xl">
              <FaGraduationCap />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Master of Science in Computer Science</h3>
              <p className="text-white/60">California State University Dominguez Hills</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white/60">
              <span>Carson, CA</span>
              <span>•</span>
              <span>Aug. 2023 – May 2025</span>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <span>GPA:</span>
              <span className="text-accent font-bold">3.75</span>
            </div>
            <div>
              <h4 className="text-white mb-2">Relevant Coursework:</h4>
              <ul className="grid grid-cols-2 gap-2">
                {[
                  "Data Structures & Algorithms",
                  "Computer Organization & Programming",
                  "Machine Learning",
                  "Artificial Intelligence",
                  "Object-Oriented Analysis & Design",
                  "Design and Analysis of Algorithms",
                  "Cloud Computing",
                  "Distributed Systems"
                ].map((course, index) => (
                  <li key={index} className="text-white/60 flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>{course}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/5 p-6 rounded-lg hover:bg-white/10 transition-colors duration-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="text-accent text-2xl">
              <FaAward />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Leadership & Achievements</h3>
              <p className="text-white/60">CSUDH ASI</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-white/60">
              <h4 className="text-white mb-2">Director of Student Services</h4>
              <p>
                Developed and implemented inclusive programs in collaboration with campus departments, 
                increasing student engagement and addressing student needs.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default EducationSection; 