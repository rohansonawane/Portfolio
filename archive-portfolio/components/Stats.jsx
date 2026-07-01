"use client";

import { motion } from "framer-motion";
import { FaCode, FaProjectDiagram, FaStar, FaLaptopCode } from "react-icons/fa";
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const stats = [
  {
    id: 'experience',
    number: "8+",
    text: "Years of Experience",
    icon: <FaCode className="text-2xl text-accent mb-2" />,
    description: "Full Stack Development"
  },
  {
    id: 'satisfaction',
    number: "95%",
    text: "Client Satisfaction",
    icon: <FaStar className="text-2xl text-accent mb-2" />,
    description: "Happy Clients"
  },
  {
    id: 'projects',
    number: "100+",
    text: "Projects Completed",
    icon: <FaProjectDiagram className="text-2xl text-accent mb-2" />,
    description: "Across Various Domains"
  },
  {
    id: 'technologies',
    number: "30+",
    text: "Technologies",
    icon: <FaLaptopCode className="text-2xl text-accent mb-2" />,
    description: "Mastered"
  }
];

const Stats = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[1400px] mx-auto xl:mx-0 mt-8">
      {stats.map((stat) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center justify-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300"
        >
          <motion.div
            key={`${stat.id}-icon`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 }}
            className="mb-2"
          >
            {stat.icon}
          </motion.div>
          <motion.div
            key={`${stat.id}-number`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-3xl font-bold text-accent mb-1"
          >
            {inView ? (
              <CountUp
                end={parseInt(stat.number)}
                duration={2.5}
                suffix={stat.number.includes('+') ? '+' : '%'}
              />
            ) : (
              stat.number
            )}
          </motion.div>
          <motion.div
            key={`${stat.id}-text`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-sm text-white/80 text-center"
          >
            {stat.text}
          </motion.div>
          <motion.div
            key={`${stat.id}-description`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-xs text-white/60 text-center mt-1"
          >
            {stat.description}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default Stats;