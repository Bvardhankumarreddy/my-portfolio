import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { verifyNewsletterSubscription } from '../../aws/newsletterService';

const NewsletterVerify = () => {
    const { theme } = useTheme();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifySubscription = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link. No token provided.');
                return;
            }

            try {
                const result = await verifyNewsletterSubscription(token);
                
                if (result.success) {
                    setStatus('success');
                    setMessage(result.message);
                } else {
                    setStatus('error');
                    setMessage(result.message);
                }

            } catch (error) {
                setStatus('error');
                setMessage(error.message || 'Failed to verify your subscription.');
            }
        };

        verifySubscription();
    }, [searchParams]);

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className={`min-h-screen flex items-center justify-center py-12 px-4 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
            <div className={`max-w-md w-full rounded-2xl shadow-xl p-8 text-center transition-colors duration-300 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
                {status === 'loading' && (
                    <>
                        <FaSpinner className={`text-6xl mx-auto mb-6 animate-spin ${
                            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                        <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                            Verifying Your Subscription...
                        </h2>
                        <p className={`transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            Please wait while we confirm your email address.
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
                        <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                            Email Verified Successfully!
                        </h2>
                        <p className={`mb-6 transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            {message}
                        </p>
                        <p className={`mb-6 transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            You'll now receive updates about new blog posts, projects, and tech insights!
                        </p>
                        <button
                            onClick={handleGoHome}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                        >
                            Go to Homepage
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-6" />
                        <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                            Verification Failed
                        </h2>
                        <p className={`mb-6 transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            {message}
                        </p>
                        <button
                            onClick={handleGoHome}
                            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                                theme === 'dark'
                                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                            }`}
                        >
                            Go to Homepage
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default NewsletterVerify;
