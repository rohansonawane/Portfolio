"use client";

import { motion } from "framer-motion";
import { FiMail, FiGithub, FiLinkedin, FiTwitter, FiMapPin, FiClock, FiSend } from "react-icons/fi";
import { useState } from "react";

const GetInTouch = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Add your form submission logic here
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const socialLinks = [
    {
      name: "Email",
      icon: FiMail,
      url: "mailto:your.email@example.com",
      color: "hover:text-red-400",
      label: "your.email@example.com",
    },
    {
      name: "GitHub",
      icon: FiGithub,
      url: "https://github.com/yourusername",
      color: "hover:text-purple-400",
      label: "@yourusername",
    },
    {
      name: "LinkedIn",
      icon: FiLinkedin,
      url: "https://linkedin.com/in/yourusername",
      color: "hover:text-blue-400",
      label: "in/yourusername",
    },
    {
      name: "Twitter",
      icon: FiTwitter,
      url: "https://twitter.com/yourusername",
      color: "hover:text-sky-400",
      label: "@yourusername",
    },
  ];

  return (
    <div className="w-full py-20 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90" />
      
      <div className="max-w-6xl mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
            Let's Build Something Amazing
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            I'm always excited to collaborate on innovative projects and bring creative ideas to life. Let's discuss how we can work together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-accent/50 transition-colors duration-300"
          >
            <h3 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
              <FiSend className="text-accent" />
              Send me a message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/60 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-accent transition-colors"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-accent transition-colors"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white/60 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-accent transition-colors resize-none"
                  placeholder="Tell me about your project..."
                  required
                ></textarea>
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full px-6 py-3 rounded-lg bg-gradient-to-r from-accent to-purple-500 text-white font-medium transition-all duration-300 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-accent/50 transition-colors duration-300">
              <h3 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
                <FiMail className="text-accent" />
                Contact Information
              </h3>
              <p className="text-white/60 mb-8">
                Feel free to reach out through any of these platforms. I'll get back to you within 24 hours.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 text-white/60 ${link.color} transition-all duration-300 hover:bg-white/10 hover:border-accent/50`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <link.icon className="text-xl" />
                    <div className="flex flex-col">
                      <span className="font-medium">{link.name}</span>
                      <span className="text-sm opacity-60">{link.label}</span>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-accent/50 transition-colors duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiMapPin className="text-xl text-accent" />
                  <h3 className="text-xl font-semibold text-white">Location</h3>
                </div>
                <p className="text-white/60">
                  San Francisco, California<br />
                  Available for remote work worldwide
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-accent/50 transition-colors duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiClock className="text-xl text-accent" />
                  <h3 className="text-xl font-semibold text-white">Availability</h3>
                </div>
                <p className="text-white/60">
                  Open to new opportunities<br />
                  Response within 24 hours
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GetInTouch; 