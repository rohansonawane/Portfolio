import Link from "next/link";

import { FaGithub, FaLinkedinIn, FaYoutube, FaTwitter, FaLinktree} from "react-icons/fa";
import { SiLinktree } from "react-icons/si";

const socials = [
  {icon: <FaGithub key="github" />, path: "https://github.com/rohansonawane"},
  {icon: <FaLinkedinIn key="linkedin" />, path: "https://www.linkedin.com/in/rohanbsonawane/"},
  {icon: <SiLinktree key="linktree" />, path: "https://linktr.ee/rsonawane"}
]

const Social = ({containerStyles, iconStyles}) => {
  return (
    <div className={containerStyles}>
      {socials.map((item, index) => (
        <Link 
          key={`social-${index}`} 
          href={item.path} 
          className={iconStyles} 
          target="_blank"
        >
        {item.icon}
        </Link>
      ))}
    </div>
  )
}

export default Social