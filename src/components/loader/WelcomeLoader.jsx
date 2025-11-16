import React, { useState, useEffect } from 'react';
import './welcomeLoader.css';
import { useTheme } from '../../context/ThemeContext';

const WelcomeLoader = ({ onLoadingComplete }) => {
    const [isVisible, setIsVisible] = useState(true);
    const { theme } = useTheme();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onLoadingComplete) {
                onLoadingComplete();
            }
        }, 4000);

        return () => clearTimeout(timer);
    }, [onLoadingComplete]);

    if (!isVisible) return null;

    return (
        <div className={`welcome-loader ${theme === 'dark' ? 'dark' : 'light'}`}>
            <div className="welcome-content">
                <div className="typing-container">
                    <h1 className="typing-line typing-line-1">WELCOME TO</h1>
                    <h1 className="typing-line typing-line-2">VARDHAN'S PORTFOLIO</h1>
                    <p className="typing-subtitle">DevOps Engineer</p>
                </div>
                
                <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            
            <div className="background-animation">
                <div className="cube cube-1"></div>
                <div className="cube cube-2"></div>
                <div className="cube cube-3"></div>
            </div>
        </div>
    );
};

export default WelcomeLoader;
