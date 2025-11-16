import React from 'react';
import { FaInstagram, FaLinkedin, FaGithub, FaMedium, FaYoutube } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import { useTheme } from '../../context/ThemeContext';

const HeaderSocials = () => {
    const { theme } = useTheme();
    
    const socialLinks = [
        { 
            href: "https://www.instagram.com/", 
            icon: FaInstagram, 
            label: "Instagram",
            color: "text-pink-600 hover:text-pink-700",
            darkColor: "dark:text-pink-400 dark:hover:text-pink-300",
            bgColor: "hover:bg-pink-50 dark:hover:bg-pink-900/30"
        },
        { 
            href: "https://github.com/Bvardhankumarreddy", 
            icon: FaGithub, 
            label: "GitHub",
            color: "text-gray-800 hover:text-gray-900",
            darkColor: "dark:text-gray-300 dark:hover:text-white",
            bgColor: "hover:bg-gray-100 dark:hover:bg-gray-700/50"
        },
        { 
            href: "https://www.linkedin.com/in/bhopathi-vardhan", 
            icon: FaLinkedin, 
            label: "LinkedIn",
            color: "text-blue-600 hover:text-blue-700",
            darkColor: "dark:text-blue-400 dark:hover:text-blue-300",
            bgColor: "hover:bg-blue-50 dark:hover:bg-blue-900/30"
        },
        { 
            href: "https://medium.com/@bhopathivardhan654321", 
            icon: FaMedium, 
            label: "Medium",
            color: "text-gray-900 hover:text-black",
            darkColor: "dark:text-gray-300 dark:hover:text-white",
            bgColor: "hover:bg-gray-100 dark:hover:bg-gray-700/50"
        },
        { 
            href: "https://www.youtube.com/@thetechsage-r8f", 
            icon: FaYoutube, 
            label: "YouTube",
            color: "text-red-600 hover:text-red-700",
            darkColor: "dark:text-red-400 dark:hover:text-red-300",
            bgColor: "hover:bg-red-50 dark:hover:bg-red-900/30"
        },
        { 
            href: "https://leetcode.com/u/uLkm18Au9S/", 
            icon: SiLeetcode, 
            label: "LeetCode",
            color: "text-orange-600 hover:text-orange-700",
            darkColor: "dark:text-orange-400 dark:hover:text-orange-300",
            bgColor: "hover:bg-orange-50 dark:hover:bg-orange-900/30"
        },
    ];

    return (
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-11 my-3 sm:my-4 md:my-5 ml-4 sm:ml-8 md:ml-16 lg:ml-32">
            {socialLinks.map((social, index) => (
                <a 
                    key={index}
                    href={social.href} 
                    className={`text-2xl transition-all duration-300 p-3 rounded-full ${social.color} ${social.darkColor} ${social.bgColor} transform hover:scale-110`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                >
                    <social.icon />
                </a>
            ))}
        </div>
    )
}

export default HeaderSocials;
