import React, { useState, useRef, useEffect } from 'react';
import Image from "../../assests/bvkr2.png";
import AboutBox from './AboutBox';
import resume from "../../assests/BVKR_Resume_Devops.pdf";
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FaAws, FaDocker, FaGitAlt, FaNetworkWired, FaDollarSign, FaCode, FaCubes } from 'react-icons/fa';
import { SiTerraform } from 'react-icons/si';
import './about.css';

const About = () => {
    const { theme } = useTheme();
    const [showPreview, setShowPreview] = useState(false);
    const [expandedSkill, setExpandedSkill] = useState(null);
    const skillsRef = useRef(null);
    const isInView = useInView(skillsRef, { once: true, amount: 0.2 });
    
    // Calculate years of experience from January 5th, 2023
    const calculateExperience = () => {
        const startDate = new Date('2023-01-05');
        const currentDate = new Date();
        
        let years = currentDate.getFullYear() - startDate.getFullYear();
        let months = currentDate.getMonth() - startDate.getMonth();
        
        if (months < 0) {
            years--;
            months += 12;
        }
        
        if (currentDate.getDate() < startDate.getDate()) {
            months--;
            if (months < 0) {
                years--;
                months += 12;
            }
        }
        
        if (years === 0) {
            return `${months} month${months !== 1 ? 's' : ''}`;
        } else if (months === 0) {
            return `${years} year${years !== 1 ? 's' : ''}`;
        } else {
            return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
        }
    };
    
    const yearsOfExperience = calculateExperience();
    
    const handlePreview = () => {
        setShowPreview(true);
    };
    
    const handleClosePreview = () => {
        setShowPreview(false);
    };
    
    return (
        <section className={`about container section py-16 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
        }`} id='about'>
            <h2 className={`section__title text-4xl font-bold text-center mb-12 transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>About Me</h2>
            <div className="about__container max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="overflow-hidden rounded-3xl">
                    <img src={Image} alt="" className='about__img rounded-3xl w-full object-cover transition-transform duration-500 hover:scale-110'/>
                </div>

                <div className="about__data lg:col-span-2 grid gap-6">
                    <div className="about__info">
                        <h3 className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>Key Strengths</h3>
                        <ul className={`space-y-3 text-base leading-relaxed transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-3 mt-1">▸</span>
                                <span><strong>{yearsOfExperience}</strong> of experience in automating, optimizing, and streamlining operations to enhance scalability and reliability</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-3 mt-1">▸</span>
                                <span>Proficient in leveraging <strong>cloud platforms, CI/CD pipelines, containerization</strong>, and <strong>infrastructure-as-code (IaC)</strong> tools</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-3 mt-1">▸</span>
                                <span>Strong foundation in <strong>AWS, Docker, Kubernetes, and Terraform</strong></span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-3 mt-1">▸</span>
                                <span>Excel in building <strong>robust workflows</strong>, ensuring <strong>high availability</strong>, and driving <strong>continuous improvement</strong></span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-3 mt-1">▸</span>
                                <span>Passionate about delivering <strong>cost-effective, efficient solutions</strong> to complex challenges in dynamic environments</span>
                            </li>
                        </ul>
                    </div>

                    {/* Skills Grid Cards */}
                    <div ref={skillsRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {skills.map((skill, index) => (
                            <motion.div 
                                key={index}
                                layout
                                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                                animate={isInView ? { 
                                    opacity: 1, 
                                    y: 0, 
                                    scale: 1 
                                } : { 
                                    opacity: 0, 
                                    y: 50, 
                                    scale: 0.8 
                                }}
                                transition={{ 
                                    duration: 0.5, 
                                    delay: index * 0.1,
                                    ease: "easeOut"
                                }}
                                className={`relative p-5 rounded-xl shadow-lg cursor-pointer transition-all duration-300 ${
                                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                                } ${expandedSkill === index ? 'ring-2 ring-offset-2' : ''}`}
                                style={{
                                    ringColor: expandedSkill === index ? `rgb(${index * 30}, ${100 + index * 20}, ${200 - index * 10})` : 'transparent'
                                }}
                                onClick={() => setExpandedSkill(expandedSkill === index ? null : index)}
                                whileHover={{ 
                                    scale: 1.05, 
                                    y: -5,
                                    transition: { duration: 0.2 }
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Icon with glow effect */}
                                <motion.div 
                                    className="flex justify-center mb-3"
                                    animate={expandedSkill === index ? { rotate: 360 } : { rotate: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${skill.bgColor} relative overflow-hidden shadow-lg`}>
                                        <motion.div
                                            animate={expandedSkill === index ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <skill.icon className={`text-3xl text-white`} />
                                        </motion.div>
                                        {/* Glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-30 transition-opacity duration-300 transform -skew-x-12"></div>
                                    </div>
                                </motion.div>
                                
                                <h3 className={`font-bold text-sm mb-4 text-center transition-colors duration-300 ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>{skill.name}</h3>

                                {/* Expandable content */}
                                <AnimatePresence>
                                    {expandedSkill === index && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="mt-3 pt-3 border-t border-gray-300"
                                        >
                                            <p className={`text-xs font-semibold mb-2 ${
                                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                            }`}>Technologies:</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {skill.technologies.map((tech, techIndex) => (
                                                    <motion.span
                                                        key={techIndex}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: techIndex * 0.05 }}
                                                        className={`text-xs px-2 py-1 rounded-md ${
                                                            theme === 'dark' 
                                                                ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200' 
                                                                : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700'
                                                        } hover:shadow-md transition-shadow duration-200`}
                                                    >
                                                        {tech}
                                                    </motion.span>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Click indicator */}
                                <motion.div 
                                    className={`absolute bottom-2 right-2 text-xs ${
                                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                    }`}
                                    animate={expandedSkill === index ? { rotate: 180 } : { rotate: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {expandedSkill === index ? '▲' : '▼'}
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-4 mb-8">
                        <a 
                            href={resume} 
                            className={`btn px-6 py-3 rounded-lg text-center font-semibold transition-colors duration-300 inline-flex items-center gap-2 ${
                                theme === 'dark' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'
                            } text-white`} 
                            download="Vardhan_Kumar_Resume.pdf"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Download CV
                        </a>
                        
                        <button 
                            onClick={handlePreview}
                            className={`btn px-6 py-3 rounded-lg text-center font-semibold transition-colors duration-300 inline-flex items-center gap-2 ${
                                theme === 'dark' ? 'bg-green-600 hover:bg-green-500' : 'bg-green-600 hover:bg-green-700'
                            } text-white`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            Preview CV
                        </button>
                    </div>
                </div>
            </div>

            <AboutBox />
            
            {/* Resume Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={handleClosePreview}>
                    <div className="relative w-full h-full max-w-6xl max-h-screen p-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white text-xl font-bold">Resume Preview</h3>
                            <button 
                                onClick={handleClosePreview}
                                className="text-white hover:text-gray-300 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <iframe 
                            src={resume} 
                            className="w-full h-full rounded-lg shadow-2xl"
                            title="Resume Preview"
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

const skills = [
    { 
        name: "Cloud Platforms", 
        percentage: 50, 
        bgColor: "bg-gradient-to-br from-orange-400 to-yellow-500", 
        progressColor: "from-blue-400 to-blue-600", 
        icon: FaAws,
        iconColor: "text-orange-500",
        technologies: ["AWS (EC2, S3, Lambda, RDS)", "Azure (VMs, Blob Storage)", "Google Cloud Platform"],
        experience: "2+ years"
    },
    { 
        name: "Infrastructure Code", 
        percentage: 70, 
        bgColor: "bg-gradient-to-br from-purple-500 to-indigo-600", 
        progressColor: "from-red-400 to-red-600", 
        icon: SiTerraform,
        iconColor: "text-purple-600",
        technologies: ["Terraform", "CloudFormation", "Ansible", "Pulumi"],
        experience: "2+ years"
    },
    { 
        name: "CI/CD pipelines", 
        percentage: 70, 
        bgColor: "bg-gradient-to-br from-blue-400 to-cyan-500", 
        progressColor: "from-cyan-400 to-cyan-600", 
        icon: FaCubes,
        iconColor: "text-blue-500",
        technologies: ["Jenkins", "GitHub Actions", "GitLab CI", "ArgoCD", "CircleCI"],
        experience: "2+ years"
    },
    { 
        name: "Version Control", 
        percentage: 85, 
        bgColor: "bg-gradient-to-br from-red-500 to-orange-600", 
        progressColor: "from-purple-400 to-purple-600", 
        icon: FaGitAlt,
        iconColor: "text-red-600",
        technologies: ["Git", "GitHub", "GitLab", "Bitbucket"],
        experience: "3+ years"
    },
    { 
        name: "Networking", 
        percentage: 65, 
        bgColor: "bg-gradient-to-br from-green-400 to-emerald-500", 
        progressColor: "from-orange-400 to-orange-600", 
        icon: FaNetworkWired,
        iconColor: "text-green-600",
        technologies: ["VPC", "Load Balancers", "DNS", "VPN", "Security Groups"],
        experience: "1.5+ years"
    },
    { 
        name: "Cloud Cost Management", 
        percentage: 90, 
        bgColor: "bg-gradient-to-br from-yellow-400 to-amber-500", 
        progressColor: "from-teal-400 to-teal-600", 
        icon: FaDollarSign,
        iconColor: "text-yellow-600",
        technologies: ["AWS Cost Explorer", "CloudWatch", "Budget Alerts", "Resource Tagging"],
        experience: "2+ years"
    },
    { 
        name: "Scripting & Programming", 
        percentage: 80, 
        bgColor: "bg-gradient-to-br from-teal-400 to-cyan-500", 
        progressColor: "from-green-400 to-green-600", 
        icon: FaCode,
        iconColor: "text-teal-600",
        technologies: ["Python", "Bash", "PowerShell", "JavaScript", "YAML"],
        experience: "3+ years"
    },
    { 
        name: "Containerization", 
        percentage: 70, 
        bgColor: "bg-gradient-to-br from-blue-500 to-blue-600", 
        progressColor: "from-pink-400 to-pink-600", 
        icon: FaDocker,
        iconColor: "text-blue-600",
        technologies: ["Docker", "Kubernetes", "ECS", "Helm", "Docker Compose"],
        experience: "2+ years"
    },
];

export default About;
