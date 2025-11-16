import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaArrowUp } from 'react-icons/fa';

const BackToTop = () => {
    const { theme } = useTheme();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className={`fixed bottom-24 right-5 md:bottom-8 md:right-8 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40 group ${
                        theme === 'dark'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                    }`}
                    aria-label="Back to top"
                >
                    <FaArrowUp className="text-xl group-hover:animate-bounce" />
                </button>
            )}
        </>
    );
};

export default BackToTop;
