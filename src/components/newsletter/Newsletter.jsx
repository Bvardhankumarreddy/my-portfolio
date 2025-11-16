import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaEnvelope, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { subscribeToNewsletter } from '../../aws/newsletterService';

const Newsletter = () => {
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(''); // 'loading', 'success', 'error'
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setStatus('error');
            setMessage('Please enter a valid email address.');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const result = await subscribeToNewsletter(email);
            
            if (result.success) {
                setStatus('success');
                setMessage(result.message);
                setEmail('');
            } else {
                setStatus('error');
                setMessage(result.message);
            }

        } catch (error) {
            setStatus('error');
            setMessage(error.message || 'Failed to subscribe. Please try again.');
        }
    };

    return (
        <section className={`py-16 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
            <div className="container max-w-4xl mx-auto px-4">
                <div className={`rounded-2xl shadow-xl p-8 md:p-12 transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                }`}>
                    <div className="text-center mb-8">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                            theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'
                        }`}>
                            <FaEnvelope className={`text-3xl ${
                                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                            }`} />
                        </div>
                        <h2 className={`text-3xl font-bold mb-3 transition-colors duration-300 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                            Subscribe to My Newsletter
                        </h2>
                        <p className={`text-lg transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            Get the latest updates on DevOps, Cloud, and Tech directly in your inbox
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                disabled={status === 'loading'}
                                className={`flex-1 px-6 py-4 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                                    theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                } ${status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                                    theme === 'dark'
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                } shadow-lg hover:shadow-xl`}
                            >
                                {status === 'loading' ? (
                                    <span className="flex items-center gap-2">
                                        <FaSpinner className="animate-spin" />
                                        Subscribing...
                                    </span>
                                ) : (
                                    'Subscribe'
                                )}
                            </button>
                        </div>

                        {message && (
                            <div className={`mt-4 p-4 rounded-lg ${
                                status === 'success'
                                    ? theme === 'dark'
                                        ? 'bg-green-900/30 border-2 border-green-500 text-green-400'
                                        : 'bg-green-50 border-2 border-green-500 text-green-700'
                                    : theme === 'dark'
                                        ? 'bg-red-900/30 border-2 border-red-500 text-red-400'
                                        : 'bg-red-50 border-2 border-red-500 text-red-700'
                            }`}>
                                <div className="flex items-center gap-2">
                                    {status === 'success' && <FaCheckCircle />}
                                    <p className="font-medium">{message}</p>
                                </div>
                            </div>
                        )}
                    </form>

                    <div className={`mt-8 pt-6 border-t text-center text-sm transition-colors duration-300 ${
                        theme === 'dark' ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-500'
                    }`}>
                        <p>📬 New blog posts • 🚀 Project updates • 💡 Tech tips & tutorials</p>
                        <p className="mt-2">You can unsubscribe anytime. No spam, I promise! 🛡️</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
