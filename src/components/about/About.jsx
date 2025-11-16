import React, { useState } from 'react';
import Image from "../../assests/bvkr2.png";
import AboutBox from './AboutBox';
import resume from "../../assests/BVKR_Resume_Devops.pdf";
import { useTheme } from '../../context/ThemeContext';
import './about.css';

const About = () => {
    const { theme } = useTheme();
    const [showPreview, setShowPreview] = useState(false);
    
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {skills.map((skill, index) => (
                            <div 
                                key={index}
                                className={`p-4 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 ${
                                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                                }`}
                            >
                                <div className="flex justify-center mb-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${skill.bgColor}`}>
                                        <span className="text-2xl">{skill.icon}</span>
                                    </div>
                                </div>
                                <h3 className={`font-semibold text-xs mb-2 transition-colors duration-300 ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>{skill.name}</h3>
                                
                                {/* Progress Bar */}
                                <div className={`w-full h-2 rounded-full mb-2 ${
                                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                                }`}>
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${skill.progressColor}`}
                                        style={{ width: `${skill.percentage}%` }}
                                    ></div>
                                </div>
                                
                                <p className={`text-xl font-bold transition-colors duration-300 ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>{skill.percentage}%</p>
                            </div>
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
    { name: "Cloud Platforms", percentage: 50, bgColor: "bg-blue-100", progressColor: "bg-blue-500", icon: "☁️" },
    { name: "Infrastructure Code", percentage: 70, bgColor: "bg-red-100", progressColor: "bg-red-500", icon: "🏗️" },
    { name: "CI/CD pipelines", percentage: 70, bgColor: "bg-cyan-100", progressColor: "bg-cyan-500", icon: "🔄" },
    { name: "Version Control", percentage: 85, bgColor: "bg-purple-100", progressColor: "bg-purple-500", icon: "👥" },
    { name: "Networking", percentage: 65, bgColor: "bg-orange-100", progressColor: "bg-orange-500", icon: "📊" },
    { name: "Cloud Cost Management", percentage: 90, bgColor: "bg-teal-100", progressColor: "bg-teal-500", icon: "💳" },
    { name: "Scripting & Programming", percentage: 80, bgColor: "bg-green-100", progressColor: "bg-green-500", icon: "💻" },
    { name: "Containerization", percentage: 70, bgColor: "bg-pink-100", progressColor: "bg-pink-500", icon: "🐳" },
];

export default About;
