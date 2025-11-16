import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { projectsData, categories, techStackColors } from './projectsData';
import { FaExternalLinkAlt, FaGithub, FaChevronLeft, FaChevronRight, FaTh, FaList } from 'react-icons/fa';
import { useVisitCounter } from '../countvists/VisitCounter';

const Projects = () => {
    const { theme } = useTheme();
    const [activeCategory, setActiveCategory] = useState("All Projects");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const visitCount = useVisitCounter();

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    // Calculate filtered projects and pagination first
    const filteredProjects = activeCategory === "All Projects" 
        ? projectsData 
        : projectsData.filter(project => project.category === activeCategory);

    const projectsPerPage = isMobile ? 1 : 2;
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

    // Detect mobile view
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Loading simulation
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        
        return () => clearTimeout(timer);
    }, [activeCategory]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handlePrev();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                handleNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, totalPages]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % totalPages);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
    };

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    // Touch handlers for swipe
    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNext();
        } else if (isRightSwipe) {
            handlePrev();
        }
    };

    const startIdx = currentIndex * projectsPerPage;
    const currentProjects = filteredProjects.slice(startIdx, startIdx + projectsPerPage);

    return (
        <section className={`section w-full py-16 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
        }`} id="projects">
            <div className="container max-w-7xl mx-auto px-6">
                <h2 className={`section__title text-4xl font-bold text-center mb-12 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Projects</h2>

                {/* View Toggle and Filter Row */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10">
                    {/* Filter Buttons */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => {
                                    setActiveCategory(category);
                                    setCurrentIndex(0);
                                }}
                                style={activeCategory === category ? {
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    borderColor: '#10b981',
                                    fontWeight: '700',
                                    boxShadow: '0 4px 6px rgba(16, 185, 129, 0.4)'
                                } : {}}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border-2 ${
                                    activeCategory === category
                                        ? 'transform scale-105'
                                        : theme === 'dark'
                                            ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:border-gray-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* View Toggle Buttons */}
                    <div className={`flex gap-2 p-1 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                    }`}>
                        <button
                            onClick={() => {
                                setViewMode('card');
                                setCurrentIndex(0);
                            }}
                            className={`p-2 rounded-md transition-all duration-300 ${
                                viewMode === 'card'
                                    ? theme === 'dark'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-blue-600 text-white'
                                    : theme === 'dark'
                                        ? 'text-gray-400 hover:text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                            }`}
                            aria-label="Card view"
                        >
                            <FaTh size={18} />
                        </button>
                        <button
                            onClick={() => {
                                setViewMode('list');
                                setCurrentIndex(0);
                            }}
                            className={`p-2 rounded-md transition-all duration-300 ${
                                viewMode === 'list'
                                    ? theme === 'dark'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-blue-600 text-white'
                                    : theme === 'dark'
                                        ? 'text-gray-400 hover:text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                            }`}
                            aria-label="List view"
                        >
                            <FaList size={18} />
                        </button>
                    </div>
                </div>

                {/* Linear Project Card Display */}
                {isLoading ? (
                    // Skeleton Loading
                    <div className="relative max-w-7xl mx-auto px-16">
                        <div className={`grid ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
                            {Array.from({ length: projectsPerPage }).map((_, idx) => (
                                <div 
                                    key={idx}
                                    className={`rounded-lg shadow-2xl overflow-hidden animate-pulse ${
                                        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                                    }`}
                                >
                                    <div className={`h-56 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                    <div className="p-6 space-y-4">
                                        <div className={`h-6 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                        <div className={`h-4 rounded w-3/4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                        <div className="flex gap-2">
                                            <div className={`h-6 w-16 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                            <div className={`h-6 w-20 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                            <div className={`h-6 w-16 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className={`h-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                            <div className={`h-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : filteredProjects.length > 0 ? (
                    <div 
                        className="relative max-w-7xl mx-auto px-16"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        {/* Navigation Arrows */}
                        {totalPages > 1 && (
                            <>
                                <button
                                    onClick={handlePrev}
                                    className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full transition-all duration-300 shadow-lg hover:scale-110 ${
                                        theme === 'dark'
                                            ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                                            : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200'
                                    }`}
                                    aria-label="Previous projects"
                                >
                                    <FaChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full transition-all duration-300 shadow-lg hover:scale-110 ${
                                        theme === 'dark'
                                            ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                                            : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200'
                                    }`}
                                    aria-label="Next projects"
                                >
                                    <FaChevronRight size={24} />
                                </button>
                            </>
                        )}

                        {/* Projects Grid - Card or List View */}
                        <div className={`grid gap-6 ${
                            viewMode === 'list' 
                                ? 'grid-cols-1' 
                                : 'grid-cols-1 md:grid-cols-2'
                        }`}>
                            {currentProjects.map((project) => (
                                <div 
                                    key={project.id}
                                    className={`rounded-lg shadow-2xl overflow-hidden transition-all duration-500 ${
                                        viewMode === 'list' ? 'flex flex-col md:flex-row' : 'flex flex-col'
                                    } ${
                                        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                                    }`}
                                >
                                    {/* Project Image */}
                                    <div className={`relative overflow-hidden bg-white flex-shrink-0 ${
                                        viewMode === 'list' ? 'md:w-80 h-56 md:h-auto' : 'h-56'
                                    }`}>
                                        {project.images && project.images[0] && (
                                            <img 
                                                src={project.images[0]} 
                                                alt={project.title} 
                                                className="w-full h-full object-contain" 
                                            />
                                        )}
                                        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                                            {project.category}
                                        </div>
                                    </div>

                                    {/* Project Content - Flex grow to fill space */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {project.title}
                                        </h3>

                                        <p className={`text-sm mb-4 transition-colors duration-300 ${
                                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                            {project.shortDescription}
                                        </p>

                                        {/* Tech Stack Badges - Fixed height container */}
                                        <div className="mb-4 min-h-[60px]">
                                            <div className="flex flex-wrap gap-2">
                                                {project.techStack.map((tech, index) => (
                                                    <span 
                                                        key={index} 
                                                        className={`${techStackColors[tech] || 'bg-gray-500'} text-white text-xs px-2.5 py-1 rounded-full font-medium`}
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Features List - Fixed height container */}
                                        <div className="mb-4 min-h-[72px]">
                                            <h4 className={`text-xs font-semibold mb-2 transition-colors duration-300 ${
                                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                            }`}>Key Features:</h4>
                                            <ul className={`space-y-1 transition-colors duration-300 ${
                                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                            }`}>
                                                {project.features.slice(0, 3).map((feature, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <span className="text-blue-500 mr-2 text-xs">•</span>
                                                        <span className="text-xs">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Spacer to push metrics and buttons to bottom */}
                                        <div className="flex-grow"></div>

                                        {/* Metrics - Responsive grid */}
                                        <div className={`grid grid-cols-3 gap-2 sm:gap-3 mb-4 p-3 rounded-lg ${
                                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                                        }`}>
                                            {Object.entries(project.metrics).map(([key, value]) => {
                                                // Use dynamic visitor count for portfolio project (id: 3)
                                                const displayValue = project.id === 3 && key === 'visitors' 
                                                    ? `${parseInt(visitCount, 10)}+` 
                                                    : value;
                                                
                                                return (
                                                    <div key={key} className="text-center">
                                                        <div className={`text-xs sm:text-sm font-bold transition-colors duration-300 ${
                                                            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                                                        }`}>
                                                            {displayValue}
                                                        </div>
                                                        <div className={`text-[10px] sm:text-xs mt-0.5 transition-colors duration-300 break-words ${
                                                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                        }`}>
                                                            {key}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Action Buttons - At bottom */}
                                        <div className="flex gap-3">
                                            <a 
                                                href={project.liveUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                                            >
                                                <FaExternalLinkAlt size={14} />
                                                Live Demo
                                            </a>
                                            {project.githubUrl && (
                                                <a 
                                                    href={project.githubUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className={`flex-1 text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${
                                                        theme === 'dark' 
                                                            ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                                                    }`}
                                                >
                                                    <FaGithub size={16} />
                                                    GitHub
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Dots */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                {Array.from({ length: totalPages }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleDotClick(index)}
                                        className={`transition-all duration-300 rounded-full ${
                                            index === currentIndex
                                                ? 'w-8 h-3 bg-blue-600'
                                                : theme === 'dark'
                                                    ? 'w-3 h-3 bg-gray-600 hover:bg-gray-500'
                                                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                                        }`}
                                        aria-label={`Go to page ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Project Counter */}
                        <div className={`text-center mt-4 text-sm transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            Showing {startIdx + 1}-{Math.min(startIdx + projectsPerPage, filteredProjects.length)} of {filteredProjects.length} projects
                        </div>
                    </div>
                ) : (
                    <div className={`text-center py-12 transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        <p className="text-xl">No projects found in this category.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Projects;