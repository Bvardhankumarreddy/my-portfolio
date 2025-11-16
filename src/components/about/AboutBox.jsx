import React, { useState, useEffect, useRef } from 'react';
import { useVisitCounter } from "../countvists/VisitCounter";
import { useTheme } from '../../context/ThemeContext';

// AboutBox Component with Counter Animation
const AboutBox = () => {
    const { theme } = useTheme();
    const visitCount = useVisitCounter(); // Get dynamic global visit count
    const [counts, setCounts] = useState(stats.map(() => 0));
    const [hasAnimated, setHasAnimated] = useState(false);
    const sectionRef = useRef(null);

    // Update stats with dynamic visit count
    const dynamicStats = stats.map((stat, index) => {
        if (index === 1) { // Visits to Site card
            return { ...stat, count: visitCount }; // Use actual global count
        }
        return stat;
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    // Animate counters using dynamic stats
                    dynamicStats.forEach((stat, index) => {
                        let start = 0;
                        const end = stat.count;
                        const duration = 2000; // 2 seconds
                        const increment = end / (duration / 16); // 60fps
                        
                        const timer = setInterval(() => {
                            start += increment;
                            if (start >= end) {
                                setCounts(prev => {
                                    const newCounts = [...prev];
                                    newCounts[index] = end;
                                    return newCounts;
                                });
                                clearInterval(timer);
                            } else {
                                setCounts(prev => {
                                    const newCounts = [...prev];
                                    newCounts[index] = Math.floor(start);
                                    return newCounts;
                                });
                            }
                        }, 16);
                    });
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, [hasAnimated, visitCount]); // Add visitCount to dependencies
    
    return (
        <div ref={sectionRef} className="w-full max-w-7xl mx-auto px-2 sm:px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {dynamicStats.map((stat, index) => (
                    <div 
                        key={index} 
                        className={`group relative p-6 lg:p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        }`}
                        style={{
                            background: theme === 'dark' 
                                ? `linear-gradient(135deg, rgba(31, 41, 55, 1) 0%, rgba(17, 24, 39, 1) 100%)`
                                : `linear-gradient(135deg, ${stat.gradientFrom} 0%, ${stat.gradientTo} 100%)`
                        }}
                    >
                    {/* Gradient Border Effect */}
                    <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                        style={{
                            background: `linear-gradient(135deg, ${stat.accentColor}, transparent)`,
                            padding: '2px',
                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            WebkitMaskComposite: 'xor',
                            maskComposite: 'exclude'
                        }}
                    ></div>

                    {/* Glow Effect on Hover */}
                    <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"
                        style={{ background: stat.accentColor }}
                    ></div>

                    {/* Icon with Animation */}
                    <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110`}
                        style={{ 
                            background: `linear-gradient(135deg, ${stat.accentColor}, ${stat.secondaryColor})`,
                            boxShadow: `0 4px 15px ${stat.accentColor}40`
                        }}
                    >
                        <i className={`text-3xl ${stat.icon} text-white`}></i>
                    </div>

                    {/* Counter with Animation */}
                    <h3 className={`relative z-10 text-4xl font-bold mb-2 transition-colors duration-300 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                        {counts[index]}
                        {stat.suffix}
                    </h3>

                    {/* Label */}
                    <span className={`relative z-10 text-sm font-medium transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>{stat.label}</span>

                    {/* Tooltip on Hover */}
                    <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none ${
                        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-800'
                    }`}>
                        {stat.tooltip}
                        <div className={`absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent ${
                            theme === 'dark' ? 'border-t-gray-900' : 'border-t-gray-800'
                        }`}></div>
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
};

const stats = [
    { 
        count: 12, 
        suffix: '+',
        label: "Projects Completed", 
        icon: "icon-fire",
        accentColor: "#f59e0b",
        secondaryColor: "#ef4444",
        gradientFrom: "#fef3c7",
        gradientTo: "#fde68a",
        tooltip: "Successfully deployed DevOps projects"
    },
    { 
        count: 150, 
        suffix: '+',
        label: "Visits to Site", 
        icon: "icon-people",
        accentColor: "#3b82f6",
        secondaryColor: "#8b5cf6",
        gradientFrom: "#dbeafe",
        gradientTo: "#bfdbfe",
        tooltip: "Total portfolio visitors"
    },
    { 
        count: 45, 
        suffix: '+',
        label: "CI/CD Pipelines", 
        icon: "icon-refresh",
        accentColor: "#10b981",
        secondaryColor: "#14b8a6",
        gradientFrom: "#d1fae5",
        gradientTo: "#a7f3d0",
        tooltip: "Automated deployment pipelines built"
    },
    { 
        count: 25, 
        suffix: '+',
        label: "Infrastructure as Code", 
        icon: "icon-wallet",
        accentColor: "#8b5cf6",
        secondaryColor: "#ec4899",
        gradientFrom: "#ede9fe",
        gradientTo: "#ddd6fe",
        tooltip: "IaC projects with Terraform & Ansible"
    },
];

export default AboutBox;