"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const titles = [
  "Software Engineer",
  "Software Development Engineer",
  "Full Stack Engineer",
  "Front-End Engineer",
  "Back-End Engineer",
  "Machine Learning Engineer",
  "Data Engineer",
  "Artificial Intelligence Engineer",
  "Natural Language Processing Engineer",
  "Deep Learning Engineer",
  "Application Developer",
  "Game Developer",
  "Site Reliability Engineer",
  "Development and Operations Engineer",
  "System Administrator",
  "Information Technology Engineer",
  "Network Operations Center Engineer",
  "Network Engineer",
  "Cloud Engineer",
  "Infrastructure Engineer",
  "Data Scientist",
  "Data Analyst",
  "Business Intelligence Developer",
  "Quality Assurance Engineer",
  "Test Engineer",
  "Security Engineer",
  "Security Operations Center Analyst",
  "Identity and Access Management Engineer",
  "Penetration Tester",
  "User Experience Engineer",
  "User Interface Engineer",
  "Product Manager",
  "Technical Program Manager",
  "Technical Support Engineer",
  "Technical Account Manager"
];

const AnimatedText = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTitle = titles[currentIndex];
    let timeout;

    if (!isDeleting && displayText === currentTitle) {
      timeout = setTimeout(() => setIsDeleting(true), 1000);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % titles.length);
    } else {
      const delta = isDeleting ? -1 : 1;
      timeout = setTimeout(() => {
        setDisplayText(currentTitle.substring(0, displayText.length + delta));
      }, isDeleting ? 50 : 100);
    }

    return () => clearTimeout(timeout);
  }, [displayText, currentIndex, isDeleting]);

  return (
    <div className="h-8 overflow-hidden">
      <motion.span
        key={currentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl text-accent font-semibold inline-block"
      >
        {displayText}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-[2px] h-5 bg-accent ml-1"
        />
      </motion.span>
    </div>
  );
};

export default AnimatedText; 