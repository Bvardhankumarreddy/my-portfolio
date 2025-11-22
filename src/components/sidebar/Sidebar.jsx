import React, { useState, useEffect } from 'react';
import './sidebar.css';
import Logo from "../../assests/logo.svg";
import { useTheme } from '../../context/ThemeContext';
import { FaDownload, FaEnvelope } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showProfile, setShowProfile] = useState(true);

    const navItems = [
        { href: "#home", icon: "icon-home", label: "Home" },
        { href: "#about", icon: "icon-user-following", label: "About" },
        { href: "#projects", icon: "icon-briefcase", label: "Projects" },
        { href: "#resume", icon: "icon-graduation", label: "Resume" },
        { href: "#blog", icon: "icon-note", label: "Blog" },
        { href: "#contact", icon: "icon-bubble", label: "Contact" },
    ];

    // Track active section and scroll progress
    useEffect(() => {
        const handleScroll = () => {
            // Calculate scroll progress
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
            setScrollProgress(progress);

            // Determine active section
            const sections = navItems.map(item => item.href.substring(1));
            let currentSection = 'home';

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        currentSection = section;
                        break;
                    }
                }
            }
            setActiveSection(currentSection);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial call

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
        {/* Scroll Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
            <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${scrollProgress}%` }}
            ></div>
        </div>

        <aside className={`fixed left-0 top-0 border-r p-6 w-28 min-h-screen flex-col justify-between z-10 hidden md:flex transition-colors duration-300 ${
            theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-gray-100 border-gray-200'
        }`}>
            {/* Logo with Mini Profile */}
            <div className="flex flex-col items-center space-y-4">
                <motion.a 
                    href="#home" 
                    className="flex justify-center group relative"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                >
                    <img 
                        src={Logo} 
                        alt="Vardhan's Portfolio" 
                        className="w-12 h-12 rounded-full border-2 border-yellow-400 shadow-lg" 
                    />
                    {/* Online Status Indicator */}
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                </motion.a>

                {/* Quick Action Buttons */}
                <div className="flex flex-col gap-2 w-full">
                    <a
                        href="#contact"
                        aria-label="Contact Me"
                        className={`w-full p-2 rounded-lg transition-all duration-300 flex items-center justify-center ${
                            theme === 'dark'
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                        title="Contact Me"
                    >
                        <FaEnvelope className="text-sm" />
                    </a>
                    <a
                        href="/resume.pdf"
                        download
                        aria-label="Download Resume"
                        className={`w-full p-2 rounded-lg transition-all duration-300 flex items-center justify-center ${
                            theme === 'dark'
                                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                : 'bg-purple-500 hover:bg-purple-600 text-white'
                        }`}
                        title="Download Resume"
                    >
                        <FaDownload className="text-sm" />
                    </a>
                </div>
            </div>

            <nav className="flex flex-col items-center space-y-6" role="navigation" aria-label="Main navigation">
                {navItems.map((item, index) => {
                    const isActive = activeSection === item.href.substring(1);
                    return (
                        <div key={index} className="relative group">
                            <a
                                href={item.href}
                                aria-label={item.label}
                                aria-current={isActive ? 'page' : undefined}
                                className={`relative text-2xl transition-all duration-300 flex items-center justify-center w-12 h-12 rounded-lg ${
                                    isActive 
                                        ? 'text-yellow-400 bg-yellow-400/10 scale-110' 
                                        : theme === 'dark' 
                                            ? 'text-white hover:text-yellow-400 hover:bg-yellow-400/5' 
                                            : 'text-gray-900 hover:text-yellow-400 hover:bg-yellow-400/5'
                                }`}
                            >
                                <i className={item.icon}></i>
                                
                                {/* Active indicator dot */}
                                {isActive && (
                                    <motion.span 
                                        className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    />
                                )}
                            </a>

                            {/* Enhanced Tooltip */}
                            <div className={`absolute left-full ml-4 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 shadow-lg ${
                                theme === 'dark' 
                                    ? 'bg-gray-700 text-white' 
                                    : 'bg-gray-900 text-white'
                            }`}>
                                {item.label}
                                {/* Tooltip arrow */}
                                <span className={`absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent ${
                                    theme === 'dark' ? 'border-r-gray-700' : 'border-r-gray-900'
                                }`}></span>
                            </div>
                        </div>
                    );
                })}
            </nav>

            <div className="flex justify-center">
                <span className={`text-xs transition-colors duration-300 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                    &copy; 2024-25
                </span>
            </div>
        </aside>
        
        
        
        {/* Enhanced Mobile Menu Button */}
        <motion.button 
            className={`fixed bottom-5 right-5 p-4 rounded-full md:hidden z-50 transition-all duration-300 shadow-lg ${
                theme === 'dark' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
            }`}
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: isOpen ? 90 : 0 }}
            aria-label="Toggle mobile menu"
            aria-expanded={isOpen}
        >
            <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
            >
                {isOpen ? '✕' : '☰'}
            </motion.div>
        </motion.button>

         {/* Mobile Bottom Navigation with Animation */}
         <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className={`fixed bottom-0 left-0 w-full border-t p-4 md:hidden z-50 backdrop-blur-lg ${
                        theme === 'dark' 
                            ? 'bg-gray-800/95 border-gray-700' 
                            : 'bg-white/95 border-gray-200'
                    }`}
                    role="navigation"
                    aria-label="Mobile navigation"
                >
                    <div className="flex justify-around items-center">
                        {navItems.map((item, index) => {
                            const isActive = activeSection === item.href.substring(1);
                            return (
                                <motion.a
                                    key={index}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label={item.label}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                                        isActive 
                                            ? 'text-yellow-400 scale-110' 
                                            : theme === 'dark' 
                                                ? 'text-white hover:text-yellow-400' 
                                                : 'text-gray-900 hover:text-yellow-400'
                                    }`}
                                >
                                    <i className={`${item.icon} text-xl`}></i>
                                    <span className="text-xs font-medium">{item.label}</span>
                                    {isActive && (
                                        <motion.span 
                                            layoutId="mobile-active-indicator"
                                            className="w-1 h-1 bg-yellow-400 rounded-full"
                                        />
                                    )}
                                </motion.a>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        </>
    );
};

export default Sidebar