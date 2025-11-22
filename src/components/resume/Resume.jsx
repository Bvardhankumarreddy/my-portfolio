import React, { useState } from 'react';
import Data from './Data';
import Card from './Card';
import { useTheme } from '../../context/ThemeContext';

const Resume = () => {
    const { theme } = useTheme();
    const [expandAll, setExpandAll] = useState(false);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'education', 'experience'
    
    const toggleExpandAll = () => {
        setExpandAll(!expandAll);
        // Trigger expand/collapse on all cards
        const event = new CustomEvent('toggleAllCards', { detail: { expand: !expandAll } });
        window.dispatchEvent(event);
    };
    
    const filteredData = activeTab === 'all' 
        ? Data 
        : Data.filter(item => item.category === activeTab);
    
    return (
        <section className={`section w-full py-16 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
        }`} id="resume">
            <div className="container max-w-7xl mx-auto px-6">
                <h2 className={`section__title text-4xl font-bold text-center mb-8 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Experience</h2>

                {/* Interactive Controls */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                    {/* Tab Filters */}
                    <div className={`flex gap-2 p-1 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                    }`}>
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 ${
                                activeTab === 'all'
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                                    : theme === 'dark'
                                        ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setActiveTab('education')}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 ${
                                activeTab === 'education'
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                                    : theme === 'dark'
                                        ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
                            }`}
                        >
                            Education
                        </button>
                        <button
                            onClick={() => setActiveTab('experience')}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 ${
                                activeTab === 'experience'
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                                    : theme === 'dark'
                                        ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
                            }`}
                        >
                            Professional
                        </button>
                    </div>

                    {/* Expand/Collapse All Button */}
                    <button
                        onClick={toggleExpandAll}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
                            theme === 'dark'
                                ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white'
                                : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
                        }`}
                    >
                        {expandAll ? '📖 Collapse All' : '📚 Expand All'}
                    </button>
                </div>

                {/* Education Section */}
                {(activeTab === 'all' || activeTab === 'education') && (
                    <div className={`p-6 rounded-lg shadow-md mb-8 transition-all duration-500 ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                        <h3 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>Education</h3>
                        {Data.filter(val => val.category === "education").map((val, id) => (
                            <Card 
                                key={id} 
                                icon={val.icon} 
                                title={val.title} 
                                year={val.year} 
                                desc={val.desc}
                                company={val.company}
                                expandAll={expandAll}
                            />
                        ))}
                    </div>
                )}

                {/* Professional Experience Section */}
                {(activeTab === 'all' || activeTab === 'experience') && (
                    <div className={`p-6 rounded-lg shadow-md transition-all duration-500 ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                        <h3 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>Professional Experience</h3>
                        {Data.filter(val => val.category === "experience").map((val, index) => (
                            <Card 
                                key={index} 
                                icon={val.icon} 
                                title={val.title} 
                                year={val.year} 
                                desc={val.desc}
                                company={val.company}
                                location={val.location}
                                responsibilities={val.responsibilities}
                                technologies={val.technologies}
                                achievements={val.achievements}
                                expandAll={expandAll}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Resume;