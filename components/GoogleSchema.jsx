"use client";

const GoogleSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Rohan Sonawane",
    "url": "https://rohansonawane.com",
    "image": "https://rohansonawane.com/assets/profile-image.png",
    "sameAs": [
      "https://github.com/rohansonawane",
      "https://www.linkedin.com/in/rohanbsonawane/",
      "https://x.com/rohanbsonawane",
      "https://linktr.ee/rsonawane"
    ],
    "jobTitle": "Full Stack Developer",
    "worksFor": {
      "@type": "Organization",
      "name": "California State University, Dominguez Hills"
    },
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "California State University, Dominguez Hills",
      "sameAs": "https://www.csudh.edu/"
    },
    "description": "A seasoned Full Stack Developer with a Master's degree in Computer Science from California State University, Dominguez Hills. Specializing in building scalable applications, AI/ML solutions, and immersive VR experiences.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Long Beach",
      "addressRegion": "CA",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-562-350-4742",
      "contactType": "personal",
      "email": "rohanbsonawane28@gmail.com",
      "availableLanguage": ["English"]
    },
    "knowsAbout": [
      "Full Stack Development",
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "Machine Learning",
      "Artificial Intelligence",
      "Virtual Reality",
      "Web Development",
      "Mobile Development"
    ],
    "skills": [
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "JavaScript",
      "TypeScript",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "MongoDB",
      "PostgreSQL",
      "Git",
      "Docker",
      "AWS",
      "Machine Learning",
      "AI",
      "VR Development"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

export default GoogleSchema; 