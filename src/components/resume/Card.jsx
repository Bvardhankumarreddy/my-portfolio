import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaChevronDown, FaChevronUp, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';

const Card = (props) => {
    const { theme } = useTheme();
    const [expanded, setExpanded] = useState(false);
    const hasDetails = props.responsibilities || props.technologies || props.achievements;
    
    // Respond to expandAll prop changes
    useEffect(() => {
        if (props.expandAll !== undefined) {
            setExpanded(props.expandAll && hasDetails);
        }
    }, [props.expandAll, hasDetails]);
    
    return (
        <div className={`relative pl-10 pb-8 border-l-2 last:pb-0 transition-colors duration-300 ${
            theme === 'dark' ? 'border-blue-500' : 'border-blue-400'
        }`}>
            {/* Timeline Icon with gradient */}
            <div className={`absolute -left-5 top-0 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg transition-all duration-300 ${
                hasDetails ? 'bg-gradient-to-br from-blue-500 to-purple-600' : theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
            }`}>
                <i className={`${props.icon} text-white`}></i>
            </div>
            
            <div className={`p-5 rounded-xl transition-all duration-300 border-2 ${
                expanded 
                    ? theme === 'dark' 
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-blue-500 shadow-2xl' 
                        : 'bg-gradient-to-br from-white to-blue-50 border-blue-400 shadow-2xl'
                    : theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 hover:border-blue-600 shadow-lg hover:shadow-xl' 
                        : 'bg-white border-gray-200 hover:border-blue-300 shadow-md hover:shadow-lg'
            } ${hasDetails ? 'cursor-pointer' : ''}`}
                onClick={() => hasDetails && setExpanded(!expanded)}
            >
                <div className="flex justify-between items-start mb-3">
                    <span className={`text-sm font-bold px-4 py-1.5 rounded-full shadow-md transition-all duration-300 ${
                        theme === 'dark' 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    }`}>{props.year}</span>
                    {hasDetails && (
                        <button className={`p-2 rounded-full transition-all duration-300 ${
                            theme === 'dark' 
                                ? 'text-blue-400 hover:bg-gray-700 hover:text-blue-300' 
                                : 'text-blue-600 hover:bg-blue-100 hover:text-blue-700'
                        }`}>
                            {expanded ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
                        </button>
                    )}
                </div>
                
                <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{props.title}</h3>
                
                {props.company && (
                    <div className={`flex items-center gap-2 mb-2 transition-colors duration-300`}>
                        <FaBuilding className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                        <p className={`text-md font-bold transition-colors duration-300 ${
                            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        }`}>{props.company}</p>
                    </div>
                )}
                
                {props.location && (
                    <div className={`flex items-center gap-2 mb-3 transition-colors duration-300`}>
                        <FaMapMarkerAlt className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={14} />
                        <p className={`text-sm transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>{props.location}</p>
                    </div>
                )}
                
                <p className={`leading-relaxed transition-colors duration-300 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>{props.desc}</p>
                
                {expanded && hasDetails && (
                    <div className="mt-6 space-y-5 animate-fadeIn">
                        {/* Achievements/Metrics */}
                        {props.achievements && (
                            <div className={`p-4 rounded-lg ${
                                theme === 'dark' ? 'bg-gray-900 bg-opacity-50' : 'bg-blue-50'
                            }`}>
                                <h4 className={`text-sm font-bold mb-3 uppercase tracking-wide transition-colors duration-300 ${
                                    theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
                                }`}>🎯 Key Metrics</h4>
                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                    {Object.entries(props.achievements).map(([key, value]) => (
                                        <div key={key} className={`p-2.5 sm:p-3 rounded-lg text-center shadow-md transition-all duration-300 hover:scale-105 ${
                                            theme === 'dark' 
                                                ? 'bg-gradient-to-br from-blue-900 to-purple-900 border border-blue-700' 
                                                : 'bg-gradient-to-br from-blue-100 to-purple-100 border border-blue-200'
                                        }`}>
                                            <div className={`text-xl sm:text-2xl font-bold transition-colors duration-300 ${
                                                theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                                            }`}>{value}</div>
                                            <div className={`text-[10px] sm:text-xs capitalize font-semibold transition-colors duration-300 ${
                                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                            }`}>{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Responsibilities */}
                        {props.responsibilities && (
                            <div className={`p-4 rounded-lg ${
                                theme === 'dark' ? 'bg-gray-900 bg-opacity-50' : 'bg-green-50'
                            }`}>
                                <h4 className={`text-sm font-bold mb-3 uppercase tracking-wide transition-colors duration-300 ${
                                    theme === 'dark' ? 'text-green-400' : 'text-green-700'
                                }`}>💼 Key Responsibilities</h4>
                                <ul className="space-y-2">
                                    {props.responsibilities.map((resp, index) => (
                                        <li key={index} className={`flex items-start text-sm leading-relaxed transition-colors duration-300 ${
                                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            <span className={`mt-1 mr-3 w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                                                theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-500 text-white'
                                            }`}>✓</span>
                                            <span>{resp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {/* Technologies */}
                        {props.technologies && (
                            <div className={`p-4 rounded-lg ${
                                theme === 'dark' ? 'bg-gray-900 bg-opacity-50' : 'bg-purple-50'
                            }`}>
                                <h4 className={`text-sm font-bold mb-3 uppercase tracking-wide transition-colors duration-300 ${
                                    theme === 'dark' ? 'text-purple-400' : 'text-purple-700'
                                }`}>🛠️ Technologies Used</h4>
                                <div className="flex flex-wrap gap-2">
                                    {props.technologies.map((tech, index) => (
                                        <span 
                                            key={index}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all duration-300 hover:scale-110 ${
                                                theme === 'dark' 
                                                    ? 'bg-gradient-to-r from-purple-900 to-blue-900 text-purple-200 border border-purple-700' 
                                                    : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                                            }`}
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Card;