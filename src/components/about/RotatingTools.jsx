import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './rotatingTools.css';

const RotatingTools = () => {
    const { theme } = useTheme();
    const containerRef = useRef(null);

    const tools = [
        { name: 'Docker', icon: '🐳', color: '#2496ED' },
        { name: 'Kubernetes', icon: '☸️', color: '#326CE5' },
        { name: 'AWS', icon: '☁️', color: '#FF9900' },
        { name: 'Terraform', icon: '🔧', color: '#7B42BC' },
        { name: 'Jenkins', icon: '🔨', color: '#D24939' },
        { name: 'Git', icon: '📦', color: '#F05032' },
        { name: 'Linux', icon: '🐧', color: '#FCC624' },
        { name: 'Python', icon: '🐍', color: '#3776AB' },
    ];

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let rotationX = 0;
        let rotationY = 0;
        let animationId;

        const animate = () => {
            rotationY += 0.5;
            rotationX = Math.sin(rotationY * 0.01) * 10;
            
            container.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, []);

    return (
        <div className="rotating-tools-wrapper">
            <div className="scene">
                <div className="cube" ref={containerRef}>
                    {tools.map((tool, index) => (
                        <div
                            key={index}
                            className={`cube-face face-${index + 1} ${
                                theme === 'dark' ? 'face-dark' : 'face-light'
                            }`}
                            style={{ '--tool-color': tool.color }}
                        >
                            <div className="tool-content">
                                <span className="tool-icon">{tool.icon}</span>
                                <span className={`tool-name ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>{tool.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RotatingTools;
