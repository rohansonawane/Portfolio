"use client";

import { useEffect } from 'react';

const TawkToChat = () => {
  useEffect(() => {
    // Initialize Tawk_API
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Create script element
    const s1 = document.createElement("script");
    s1.async = true;
    s1.src = 'https://embed.tawk.to/683d14095174bb190976b470/1isn9chfv';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');

    // Insert script
    const s0 = document.getElementsByTagName("script")[0];
    s0.parentNode.insertBefore(s1, s0);

    // Cleanup function
    return () => {
      // Remove the script when component unmounts
      if (s1.parentNode) {
        s1.parentNode.removeChild(s1);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return null; // This component doesn't render anything
};

export default TawkToChat; 