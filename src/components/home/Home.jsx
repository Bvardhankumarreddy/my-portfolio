import React, { useState, useEffect, useRef } from 'react';
import './home.css';
import HeroImage from "../../assests/bvkr_protfolio.png"; 
import { useTheme } from '../../context/ThemeContext';
import FloatingIcons from './FloatingIcons';
import { FaLinkedin, FaGithub, FaEnvelope, FaAws, FaChevronDown, FaCloud, FaYoutube, FaInstagram, FaMedium } from 'react-icons/fa';
import { SiKubernetes, SiTerraform, SiLeetcode, SiGeeksforgeeks } from 'react-icons/si';
import { sendContactNotification, sendContactConfirmation } from '../../aws/emailService';

const Home = () => {
    const { theme } = useTheme();
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);
    const [showHireForm, setShowHireForm] = useState(false);
    const [formStatus, setFormStatus] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const hireFormRef = useRef();

    const roles = ['DevOps Engineer', 'Cloud Enthusiast', 'Automation Expert', 'Infrastructure Architect'];

    useEffect(() => {
        const handleTyping = () => {
            const i = loopNum % roles.length;
            const fullText = roles[i];

            setText(isDeleting 
                ? fullText.substring(0, text.length - 1)
                : fullText.substring(0, text.length + 1)
            );

            setTypingSpeed(isDeleting ? 50 : 150);

            if (!isDeleting && text === fullText) {
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && text === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum, typingSpeed]);

    const handleHireMe = () => {
        setShowHireForm(true);
    };

    const handleCloseForm = () => {
        setShowHireForm(false);
        setFormStatus("");
    };

    const sendHireEmail = async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: hireFormRef.current.from_name.value.trim(),
            email: hireFormRef.current.reply_to.value.trim().toLowerCase(),
            subject: hireFormRef.current.subject?.value?.trim() || 'Hire Me Request',
            message: hireFormRef.current.message.value.trim()
        };

        // Email validation
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (!emailRegex.test(formData.email)) {
            setFormStatus("❌ Please enter a valid email address (e.g., user@example.com).");
            return;
        }

        // Check for common typos in email domains
        const domain = formData.email.split('@')[1];
        
        const commonTypos = {
            'gmial.com': 'gmail.com',
            'gmai.com': 'gmail.com',
            'gmil.com': 'gmail.com',
            'yahooo.com': 'yahoo.com',
            'yaho.com': 'yahoo.com',
            'outlok.com': 'outlook.com',
            'outloo.com': 'outlook.com',
            'hotmial.com': 'hotmail.com',
            'hotmal.com': 'hotmail.com'
        };

        // Check for common typos
        if (commonTypos[domain]) {
            setFormStatus(`❌ Did you mean ${formData.email.split('@')[0]}@${commonTypos[domain]}? Please correct the email.`);
            return;
        }

        // Validate domain structure (must have at least one dot and valid TLD)
        const domainParts = domain.split('.');
        if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
            setFormStatus("❌ Please enter a valid email domain (e.g., @gmail.com, @company.com).");
            return;
        }

        // Check for invalid characters
        if (formData.email.includes('..') || formData.email.startsWith('.') || formData.email.endsWith('.')) {
            setFormStatus("❌ Email address contains invalid formatting.");
            return;
        }

        // Send email via AWS SES
        setIsVerifying(true);
        setFormStatus("Sending your request...");

        try {
            // Send notification to admin
            await sendContactNotification({
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message
            });

            // Send confirmation to user
            await sendContactConfirmation({
                name: formData.name,
                email: formData.email
            });

            setFormStatus("✅ Message sent successfully! I'll get back to you soon. Check your email for confirmation.");
            setIsVerifying(false);
            hireFormRef.current.reset();
            setTimeout(() => {
                handleCloseForm();
            }, 3000);
        } catch (error) {
            console.error('Error sending email:', error);
            setIsVerifying(false);
            
            // Display the exact error message from AWS SES
            const errorMessage = error.message || 'Failed to send message. Please try again.';
            setFormStatus(`❌ ${errorMessage}`);
        }
    };
    
    return (
        <section className={`relative min-h-screen flex flex-col items-center justify-center py-10 text-center transition-colors duration-300 px-4 overflow-hidden ${
            theme === 'dark' 
                ? 'bg-gray-900' 
                : 'bg-gray-100'
        }`} id="home">
            
            <FloatingIcons />
            
            <div className="max-w-md relative z-10">
                
                {/* Profile Image */}
                <div className="relative inline-block mb-6">
                    <img 
                        src={HeroImage} 
                        alt="Vardhan Kumar Reddy Bhopathi" 
                        className="relative w-145 h-145 object-cover shadow-xl rounded-3xl transition-transform duration-300 hover:scale-105" 
                    />
                    
                    {/* Certifications Badge */}
                    <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 px-4 py-2 rounded-full shadow-lg transition-colors duration-300 ${
                        theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}>
                        <FaAws className={`text-2xl ${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'}`} title="AWS Certified" />
                    </div>
                </div>
                
                <h1 className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                    Vardhan Kumar Reddy Bhopathi
                </h1>
                
                {/* Typing Animation */}
                <div className={`block text-lg sm:text-xl mb-2 h-8 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                    <span>{text}</span>
                    <span className="animate-pulse">|</span>
                </div>

                {/* Social Media Links */}
                <div className="flex justify-center items-center gap-1.5 sm:gap-2 md:gap-3 mb-6 px-2">
                    <a 
                        href="https://www.linkedin.com/in/bhopathi-vardhan/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${
                            theme === 'dark' 
                                ? 'bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white' 
                                : 'bg-white hover:bg-blue-600 text-gray-700 hover:text-white shadow-md'
                        }`}
                        title="LinkedIn"
                    >
                        <FaLinkedin className="text-xl sm:text-2xl" />
                    </a>
                    <a 
                        href="https://github.com/Bvardhankumarreddy" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${
                            theme === 'dark' 
                                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
                                : 'bg-white hover:bg-gray-800 text-gray-700 hover:text-white shadow-md'
                        }`}
                        title="GitHub"
                    >
                        <FaGithub className="text-xl sm:text-2xl" />
                    </a>
                    <a 
                        href="https://leetcode.com/u/uLkm18Au9S/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${
                            theme === 'dark' 
                                ? 'bg-gray-800 hover:bg-orange-500 text-gray-300 hover:text-white' 
                                : 'bg-white hover:bg-orange-500 text-gray-700 hover:text-white shadow-md'
                        }`}
                        title="LeetCode"
                    >
                        <SiLeetcode className="text-xl sm:text-2xl" />
                    </a>
                    <a 
                        href="https://www.geeksforgeeks.org/user/bhopathivardhan654321/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${
                            theme === 'dark' 
                                ? 'bg-gray-800 hover:bg-green-600 text-gray-300 hover:text-white' 
                                : 'bg-white hover:bg-green-600 text-gray-700 hover:text-white shadow-md'
                        }`}
                        title="GeeksforGeeks"
                    >
                        <SiGeeksforgeeks className="text-xl sm:text-2xl" />
                    </a>
                    <a 
                        href="https://www.youtube.com/@thetechsage-r8f" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${
                            theme === 'dark' 
                                ? 'bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white' 
                                : 'bg-white hover:bg-red-600 text-gray-700 hover:text-white shadow-md'
                        }`}
                        title="YouTube"
                    >
                        <FaYoutube className="text-xl sm:text-2xl" />
                    </a>
                    <a 
                        href="https://www.instagram.com/vardhan_kumar_reddy_18/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${
                            theme === 'dark' 
                                ? 'bg-gray-800 hover:bg-pink-600 text-gray-300 hover:text-white' 
                                : 'bg-white hover:bg-pink-600 text-gray-700 hover:text-white shadow-md'
                        }`}
                        title="Instagram"
                    >
                        <FaInstagram className="text-xl sm:text-2xl" />
                    </a>
                    <a 
                        href="https://medium.com/@bhopathivardhan654321" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${
                            theme === 'dark' 
                                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
                                : 'bg-white hover:bg-gray-900 text-gray-700 hover:text-white shadow-md'
                        }`}
                        title="Medium"
                    >
                        <FaMedium className="text-xl sm:text-2xl" />
                    </a>
                    <a 
                        href="mailto:bhopathivardhan654321@gmail.com"
                        className={`p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${
                            theme === 'dark' 
                                ? 'bg-gray-800 hover:bg-blue-500 text-gray-300 hover:text-white' 
                                : 'bg-white hover:bg-blue-500 text-gray-700 hover:text-white shadow-md'
                        }`}
                        title="Email"
                    >
                        <FaEnvelope className="text-xl sm:text-2xl" />
                    </a>
                </div>

                <button 
                    onClick={handleHireMe}
                    className={`inline-block px-8 py-3 text-lg font-medium rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                        theme === 'dark'
                            ? 'text-white bg-blue-600 hover:bg-blue-500'
                            : 'text-white bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    Hire Me
                </button>
            </div>
            
            
            {/* Hire Me Modal Form */}
            {showHireForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 px-4" onClick={handleCloseForm}>
                    <div 
                        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl p-8 transition-colors duration-300 ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className={`text-2xl font-bold transition-colors duration-300 ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>Hire Me</h3>
                            <button 
                                onClick={handleCloseForm}
                                className={`transition-colors duration-300 ${
                                    theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form ref={hireFormRef} onSubmit={sendHireEmail} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>Your Name *</label>
                                    <input 
                                        type="text" 
                                        name="from_name"
                                        required
                                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                                            theme === 'dark' 
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>Email *</label>
                                    <input 
                                        type="email" 
                                        name="reply_to"
                                        required
                                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                                            theme === 'dark' 
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
                                        placeholder="john@company.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>Company Name *</label>
                                    <input 
                                        type="text" 
                                        name="company_name"
                                        required
                                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                                            theme === 'dark' 
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
                                        placeholder="Your Company"
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>Position/Role *</label>
                                    <input 
                                        type="text" 
                                        name="position"
                                        required
                                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                                            theme === 'dark' 
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
                                        placeholder="DevOps Engineer"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>Job Type</label>
                                <select 
                                    name="job_type"
                                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                                        theme === 'dark' 
                                            ? 'bg-gray-700 border-gray-600 text-white' 
                                            : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>Job Description / Requirements *</label>
                                <textarea 
                                    name="message"
                                    required
                                    rows="5"
                                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                                        theme === 'dark' 
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    }`}
                                    placeholder="Please describe the role, responsibilities, and any specific requirements..."
                                ></textarea>
                            </div>

                            {formStatus && (
                                <div className={`p-4 rounded-lg ${
                                    formStatus.includes('success') 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {formStatus}
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button 
                                    type="submit"
                                    disabled={isVerifying}
                                    className={`flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 ${
                                        isVerifying ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isVerifying ? 'Verifying...' : 'Send Request'}
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleCloseForm}
                                    disabled={isVerifying}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                                        theme === 'dark' 
                                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    } ${isVerifying ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
        </section>
    );
}

export default Home;