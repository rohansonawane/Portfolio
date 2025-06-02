"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Twitter, Phone, MapPin, Link as LinkIcon } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Get In Touch</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            I'm currently open to new opportunities and collaborations. Let's discuss how we can work together to achieve your goals.
          </p>
        </div>

        {/* Contact Information Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors duration-300 text-center"
          >
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-accent/10">
                <Phone className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-white">Phone</h3>
            </div>
            <a href="tel:+15623504742" className="text-white/60 hover:text-accent transition-colors duration-300">
              +1 (562) 350-4742
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors duration-300 text-center"
          >
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-accent/10">
                <Mail className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-white">Email</h3>
            </div>
            <a href="mailto:rohanbsonawane28@gmail.com" className="text-white/60 hover:text-accent transition-colors duration-300">
              rohanbsonawane28@gmail.com
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors duration-300 text-center"
          >
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-accent/10">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-white">Location</h3>
            </div>
            <p className="text-white/60">Long Beach, California, United States</p>
          </motion.div>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6">
          <motion.a
            href="mailto:rohanbsonawane28@gmail.com"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors duration-300"
            title="Email"
          >
            <Mail className="w-6 h-6 text-accent" />
          </motion.a>
          <motion.a
            href="https://github.com/rohansonawane"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors duration-300"
            title="GitHub"
          >
            <Github className="w-6 h-6 text-accent" />
          </motion.a>
          <motion.a
            href="https://www.linkedin.com/in/rohanbsonawane/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors duration-300"
            title="LinkedIn"
          >
            <Linkedin className="w-6 h-6 text-accent" />
          </motion.a>
          <motion.a
            href="https://x.com/rohanbsonawane"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors duration-300"
            title="X (Twitter)"
          >
            <Twitter className="w-6 h-6 text-accent" />
          </motion.a>
          <motion.a
            href="https://linktr.ee/rsonawane"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors duration-300"
            title="Linktree"
          >
            <LinkIcon className="w-6 h-6 text-accent" />
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 