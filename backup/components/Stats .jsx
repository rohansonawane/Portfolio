"use client"

import { useState, useEffect } from "react";
import CountUp from "react-countup";
import { stats } from "@/lib/constants";

const Stats = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
   },
      { threshold: 0.1 }
    );
    
    const element = document.querySelector('.stats-container');
    if (element) observer.observe(element);
    
    return () => observer.disconnect();
  }, []);

  return (
    <section className="pt-4 pb-12 xl:pt-0 xl:pb-0" aria-label="Statistics">
      <div className="container mx-auto">
        <div className="stats-container grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[80vw] mx-auto xl:max-w-none">
          {stats.map((item, index) => (
            <div 
              key={index}
              className="flex flex-col items-center justify-center xl:items-start"
              role="statistic"
            >
              {isVisible && (
                     <CountUp
                     end={item.num}
                     duration={5}
                     delay={2}
                     className="text-4xl xl:text-6xl font-extrabold"
                  aria-label={`${item.num} ${item.text}`}
                     />
              )}
              <p className="text-white/80 text-center xl:text-left">{item.text}</p>
                  </div>
          ))}
         </div>
      </div>
    </section>
  );
};

export default Stats; 
