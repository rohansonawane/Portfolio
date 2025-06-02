"use client";

import { useState, useEffect } from "react";
import CountUp from "react-countup";

const stats = [
  {
    value: 8,
    suffix: "+",
    text: "Years of Experience"
  },
  {
    value: 60,
    suffix: "+",
    text: "Projects Completed"
  },
  {
    value: 30,
    suffix: "+",
    text: "Technologies Mastered"
  },
  {
    value: 95,
    suffix: "%",
    text: "Client Satisfaction Rate"
  }
];

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
    <section className="pt-2 pb-4" aria-label="Statistics">
      <div className="container mx-auto">
        <div className="stats-container grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[80vw] mx-auto xl:max-w-none">
          {stats.map((item, index) => (
            <div 
              key={index}
              className="flex flex-row items-center justify-center gap-4"
              role="statistic"
            >
              {isVisible && (
                <div className="text-4xl xl:text-6xl font-extrabold text-accent">
                  <CountUp
                    end={item.value}
                    duration={5}
                    delay={2}
                    aria-label={`${item.value} ${item.text}`}
                  />
                  {item.suffix}
                </div>
              )}
              <p className="text-white/80 text-left text-lg">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats; 