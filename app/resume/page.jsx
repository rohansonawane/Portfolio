"use client";

import {FaHtml5,FaCss3,FaJs,FaReact,FaFigma,FaNodeJs,FaWordpress,FaShopify,FaPython,FaPhp} from 'react-icons/fa';
import {SiTailwindcss, SiNextdotjs} from 'react-icons/si';
import Social from '@/components/Social';
import { motion } from "framer-motion";
import SkillsSection from "@/components/SkillsSection";
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';
import {ScrollArea} from '@/components/ui/scroll-area';

// about data

const about = {
  title: 'About me',
  description: "A Full Stack Developer and AI/ML enthusiast with 7+ years of experience. Currently pursuing an MS in Computer Science at CSUDH, I specialize in creating innovative tech solutions.",
  info: [
    {
      fieldName: "Name",
      fieldValue: "Rohan Sonawane"
    },
    {
      fieldName: "Phone",
      fieldValue: "+1 562 350 4742"
    },
    {
      fieldName: "Experience",
      fieldValue: "8+ Years"
    },
    {
      fieldName: "Address",
      fieldValue: "Los Angeles, CA"
    },
    {
      fieldName: "Email",
      fieldValue: "rohansonawane28@gmail.com"
    },
  ]
};

const experience = {
  icon: '/assets/resume/badge.svg',
  title: 'My Experience',
  description:"As a Full Stack Web Developer with over seven years of experience, I've specialized in crafting secure, high-quality web solutions that prioritize user experience and system performance. My expertise spans a wide range of technologies, including PHP, Python, JavaScript (React.js, Node.js), SQL, and more.", 
  items:[
    {
      company: "CSUDH",
      position: "AR/VR Developer",
      duration: "2023-Present"
    },
    {
      company: "Self-Employed",
      position: "Full Stack SDE",
      duration: "2020-2023"
    },
    {
      company: "Briefkase",
      position: "TechLead - Full Stack SDE",
      duration: "2019-2020"
    },
    {
      company: "Briefkase",
      position: "Senior - Full Stack SDE",
      duration: "2017-2019"
    },
    {
      company: "Briefkase",
      position: "Junior - Full Stack SDE",
      duration: "2016-2017"
    },
  ]
};

const education = {
  icon: '/assets/resume/cap.svg',
  title: "My Education",
  description: "I am currently pursuing a Master of Science in Computer Science at California State University, Dominguez Hills. With a solid foundation in software engineering and over seven years of industry experience, I specialize in AI, web development, and innovative tech solutions. My academic journey and hands-on experience enable me to stay at the forefront of emerging technologies.", 
  items:[
    {
      institution: "CSUDH",
      degree: "Master's in Computer Science",
      duration: "2023-2025"
    },
    {
      institution: "PVPPCOE",
      degree: "Bachelor's in Information Technology",
      duration: "2012-2016"
    } 
  ]
}

const skills = {
  icon: '/assets/resume/cap.svg',
  title: "My skills",
  description: "Expert in Full Stack Development, AI, and Machine Learning, with proficiency in PHP, Python, JavaScript, and frameworks like Django. Skilled in cloud platforms (AWS) and digital marketing for comprehensive solutions.", 
  skilllist:[
    {
      icon:<FaPython />,
      name: "Python"
    },
    {
      icon:<FaPhp />,
      name: "PHP"
    },
    {
      icon: <FaHtml5 />,
      name: "html 5"
    },
    {
      icon: <FaCss3 />,
      name: "CSS 3"
    },
    {
      icon: <FaJs />,
      name: "JavaScript"
    },
    {
      icon: <FaReact />,
      name: "React.js"
    },
    {
      icon: <SiNextdotjs />,
      name: "next.js"
    },
    {
      icon: <SiTailwindcss />,
      name: "tailwind.css"
    },
    {
      icon: <FaNodeJs />,
      name: "node.js"
    },
    {
      icon: <FaFigma />,
      name: "Figma"
    },
    {
      icon:<FaWordpress />,
      name: "WordPress"
    },
    {
      icon:<FaShopify />,
      name: "Shopify"
    },

    
  ]
}

const Resume = () => {
  return (
    <motion.div 
      initial={{opacity:0}} 
      animate={{opacity:1, transition:{ delay: 2.4, duration:0.4, ease: 'easeIn'}}}
      className="min-h-[80vh] flex items-center justify-center py-12 xl:py-0"
    >
      <div className="container mx-auto">
        <Tabs defaultValue="experience" className="flex flex-col xl:flex-row gap-[60px]">
          <TabsList className="flex flex-col w-full max-w-[380px] mx-auto xl:mx-0 gap-6">
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="about">About me</TabsTrigger>
            <div className="mb-8 xl:mb-0">
              <Social containerStyles="flex gap-6" iconStyles="w-9 h-9 border border-accent rounded-full flex justify-center items-center text-accent text-base hover:bg-accent hover:text-primary hover:transition-all duration-500" />
            </div>
          </TabsList>

          <div className="min-h-[70vh] w-full">
            <TabsContent value="experience" className="w-full">
              <div className="flex flex-col gap-[30px] text-center xl:text-left">
                <h3 className="text-4xl font-bold">Work Experience</h3>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-6">
                    {/* Current Role */}
                    <div className="bg-white/5 p-6 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white">AI / VR Research Assistant and Software Engineer</h3>
                          <p className="text-accent">California State University Dominguez Hills</p>
                        </div>
                        <p className="text-white/80">Aug 2023 – May 2025</p>
                      </div>
                      <p className="text-white/80 mb-4">Carson, CA</p>
                      {/* <ul className="list-disc list-inside text-white/80 space-y-2"> */}
                        {/* <li>Designed and developed an immersive VR classroom using Unity (XR Toolkit, C#, OpenAI, Convai), increasing student engagement by 40% and receiving positive faculty feedback.</li> */}
                        {/* <li>Built LLM-powered NPC teachers with context-aware dialogue, improving knowledge retention by 50% through natural, human-like interaction.</li> */}
                        {/* <li>Produced high-fidelity 3D assets in Blender and developed the department's official website, enhancing digital presence and accessibility.</li> */}
                        {/* <li>Mentored 6 students in 3D sketching, Blender, Unity, and VR development, leading to projects such as a pendulum simulation, Tesla 3D model, and a VR cannon shooting game that won a special prize.</li> */}
                      {/* </ul> */}
                    </div>

                    {/* Previous Roles */}
                    <div className="space-y-6">
                      <div className="bg-white/5 p-6 rounded-lg">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white">Full Stack Software Development Engineer</h3>
                            <p className="text-accent">Self-Employed</p>
                          </div>
                          <p className="text-white/80">Aug 2020 – Jul 2023</p>
                        </div>
                        <p className="text-white/80 mb-4">Mumbai, India</p>
                        {/* <ul className="list-disc list-inside text-white/80 space-y-2"> */}
                          {/* <li>Built and deployed 15+ full-stack web applications using React.js, Node.js, PHP, and SQL, improving UI responsiveness and user satisfaction by 40%.</li> */}
                          {/* <li>Implemented CI/CD pipelines using GitHub Actions and Docker; refactored legacy systems to optimize performance, reducing load times by 50% and accelerating deployments.</li> */}
                          {/* <li>Developed custom WordPress templates, modules, and plugins including a petition system and a donation platform with recurring payments and Google Sheets integration.</li> */}
                          {/* <li>Oversaw the full SDLC for 7 client projects, from requirement analysis to delivery, cutting delivery times by 50% through workflow optimization.</li> */}
                          {/* <li>Consulted with clients to deliver tailored solutions, resulting in a 95% satisfaction rate and repeat business from 5 clients.</li> */}
                        {/* </ul> */}
                      </div>

                      <div className="bg-white/5 p-6 rounded-lg">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white">Full Stack Software Development Engineer</h3>
                            <p className="text-accent">Briefkase Digital Communications Private Limited</p>
                          </div>
                          <p className="text-white/80">Jun 2016 – Sep 2020</p>
                        </div>
                        <p className="text-white/80 mb-4">Mumbai, India</p>
                        {/* <ul className="list-disc list-inside text-white/80 space-y-2"> */}
                          {/* <li>Directed a 5-member development team to deliver 60+ scalable web applications, accelerating project delivery by 60% and product reliability by 70%.</li> */}
                          {/* <li>Spearheaded Agile SDLC implementation by integrating Git-based version control, sprint planning, and test-driven/behavior-driven development (TDD/BDD).</li> */}
                          {/* <li>Revamped websites for performance, SEO, and security, achieving 70% faster load speeds, boosting organic traffic and 80% secured websites.</li> */}
                          {/* <li>Design and Developed custom WordPress, Magento, and Shopify themes and plugins for improved UI/UX, Performance and Security.</li> */}
                          {/* <li>Collaborated cross-functionally with marketing and UI/UX design teams to architect and implement optimized web application interfaces.</li> */}
                        {/* </ul> */}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="education" className="w-full">
              <div className="flex flex-col gap-[30px] text-center xl:text-left">
                <h3 className="text-4xl font-bold">Education</h3>
                <ScrollArea className="h-[400px]">
                  <div className="bg-white/5 p-6 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">Master of Science in Computer Science</h3>
                        <p className="text-accent">California State University Dominguez Hills</p>
                      </div>
                      <p className="text-white/80">Aug 2023 – May 2025</p>
                    </div>
                    <p className="text-white/80 mb-4">Carson, CA</p>
                    <div className="space-y-4">
                      <p className="text-white/80">GPA: 3.75</p>
                      <div>
                        <h4 className="text-white font-semibold mb-2">Relevant Coursework:</h4>
                        <p className="text-white/80">Data Structures & Algorithms, Computer Organization & Programming, Machine Learning, Artificial Intelligence, Object-Oriented Analysis & Design, Design and Analysis of Algorithms, Cloud Computing, Distributed Systems.</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-2">Leadership:</h4>
                        <p className="text-white/80">Director of Student Services, CSUDH ASI - Developed and implemented inclusive programs in collaboration with campus departments, increasing student engagement and addressing student needs.</p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="skills" className="w-full">
              <div className="flex flex-col gap-[30px] text-center xl:text-left">
                <h3 className="text-4xl font-bold">Skills</h3>
                <SkillsSection />
              </div>
            </TabsContent>

            <TabsContent value="about" className="w-full text-center xl:text-left">
              <div className="flex flex-col gap-[30px]">
                <h3 className="text-4xl font-bold">About me</h3>
                <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">
                  A Full Stack Developer and AI/ML enthusiast with 8+ years of experience. Currently pursuing an MS in Computer Science at CSUDH, I specialize in creating innovative tech solutions.
                </p>
                <ul className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 max-w-[620px] mx-auto xl:mx-0">
                  <li className="flex items-center justify-center xl:justify-start gap-4">
                    <span className="text-white/60">Name</span>
                    <span className="text-xl">Rohan Sonawane</span>
                  </li>
                  <li className="flex items-center justify-center xl:justify-start gap-4">
                    <span className="text-white/60">Phone</span>
                    <span className="text-xl">+1 562 350 4742</span>
                  </li>
                  <li className="flex items-center justify-center xl:justify-start gap-4">
                    <span className="text-white/60">Experience</span>
                    <span className="text-xl">8+ Years</span>
                  </li>
                  <li className="flex items-center justify-center xl:justify-start gap-4">
                    <span className="text-white/60">Address</span>
                    <span className="text-xl">Los Angeles, CA</span>
                  </li>
                  <li className="flex items-center justify-center xl:justify-start gap-4">
                    <span className="text-white/60">Email</span>
                    <span className="text-xl">rohansonawane28@gmail.com</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Resume;
