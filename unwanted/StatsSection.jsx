import { motion } from "framer-motion";

const StatsSection = () => {
  const stats = [
    {
      title: "Years of Experience",
      value: "8",
      description: "Professional Development"
    },
    {
      title: "GPA at CSUDH",
      value: "4.0",
      description: "Computer Science"
    },
    {
      title: "Projects Completed",
      value: "60+",
      description: "Real-world Applications"
    },
    {
      title: "LeetCode Problems",
      value: "500+",
      description: "Problem Solving"
    }
  ];

  return (
    <section className="py-20 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <h3 className="text-4xl font-bold text-accent mb-2">{stat.value}</h3>
              <h4 className="text-xl font-semibold text-white mb-2">{stat.title}</h4>
              <p className="text-white/60">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection; 