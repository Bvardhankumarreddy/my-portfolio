import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaSadTear, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { unsubscribeFromNewsletter } from '../../aws/newsletterService';
import { useNavigate } from 'react-router-dom';

const NewsletterUnsubscribe = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(''); // 'loading', 'success', 'error'
    const [message, setMessage] = useState('');

    const handleUnsubscribe = async (e) => {
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
            const result = await unsubscribeFromNewsletter(email);
            
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
            setMessage(error.message || 'Failed to unsubscribe. Please try again.');
        }
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className={`min-h-screen flex items-center justify-center py-12 px-4 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
            <div className={`max-w-md w-full rounded-2xl shadow-xl p-8 transition-colors duration-300 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
                {status !== 'success' ? (
                    <>
                        <div className="text-center mb-6">
                            <FaSadTear className={`text-6xl mx-auto mb-4 ${
                                theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
                            }`} />
                            <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                                Sorry to See You Go
                            </h2>
                            <p className={`transition-colors duration-300 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                We'll miss you! You can always resubscribe anytime.
                            </p>
                        </div>

                        <form onSubmit={handleUnsubscribe} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email to unsubscribe"
                                    disabled={status === 'loading'}
                                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                                        theme === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                    } ${status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                            </div>

                            {message && status === 'error' && (
                                <div className={`p-4 rounded-lg ${
                                    theme === 'dark'
                                        ? 'bg-red-900/30 border-2 border-red-500 text-red-400'
                                        : 'bg-red-50 border-2 border-red-500 text-red-700'
                                }`}>
                                    <p className="font-medium">{message}</p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                                        theme === 'dark'
                                            ? 'bg-red-600 hover:bg-red-700 text-white'
                                            : 'bg-red-600 hover:bg-red-700 text-white'
                                    }`}
                                >
                                    {status === 'loading' ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <FaSpinner className="animate-spin" />
                                            Processing...
                                        </span>
                                    ) : (
                                        'Unsubscribe'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleGoHome}
                                    disabled={status === 'loading'}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                                        theme === 'dark'
                                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                                    } ${status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="text-center">
                        <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
                        <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                            Unsubscribed Successfully
                        </h2>
                        <p className={`mb-6 transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            {message}
                        </p>
                        <button
                            onClick={handleGoHome}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                        >
                            Go to Homepage
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsletterUnsubscribe;
