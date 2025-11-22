import React, { useRef, useState, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { sendContactNotification, sendContactConfirmation } from '../../aws/emailService';
import { validateEmailBeforeSending } from '../../utils/emailValidation';

const Contact = () => {
    const { theme } = useTheme();
    const form = useRef();
    const [statusMessage, setStatusMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messageLength, setMessageLength] = useState(0);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [emailSuggestion, setEmailSuggestion] = useState(null);

    // Validation rules
    const validateField = useCallback((name, value) => {
        switch (name) {
            case 'user_name':
                if (!value.trim()) return 'Name is required';
                if (value.length < 2) return 'Name must be at least 2 characters';
                if (value.length > 50) return 'Name must not exceed 50 characters';
                if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name should contain only letters';
                return '';
            
            case 'user_email':
                if (!value.trim()) return 'Email is required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
                return '';
            
            case 'subject':
                if (!value.trim()) return 'Subject is required';
                if (value.length < 3) return 'Subject must be at least 3 characters';
                if (value.length > 100) return 'Subject must not exceed 100 characters';
                return '';
            
            case 'message':
                if (!value.trim()) return 'Message is required';
                if (value.length < 10) return 'Message must be at least 10 characters';
                if (value.length > 1000) return 'Message must not exceed 1000 characters';
                return '';
            
            default:
                return '';
        }
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        
        // Track message length for character counter
        if (name === 'message') {
            setMessageLength(value.length);
        }
        
        // Only validate if field was already touched
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    }, [touched, validateField]);

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const validateForm = () => {
        const newErrors = {};
        const formElements = form.current.elements;
        
        ['user_name', 'user_email', 'subject', 'message'].forEach(key => {
            const value = formElements[key]?.value || '';
            const error = validateField(key, value);
            if (error) newErrors[key] = error;
        });
        
        setErrors(newErrors);
        setTouched({
            user_name: true,
            user_email: true,
            subject: true,
            message: true
        });
        return Object.keys(newErrors).length === 0;
    };

    const clearForm = () => {
        setMessageLength(0);
        setErrors({});
        setTouched({});
        setStatusMessage('');
        setEmailSuggestion(null);
        form.current.reset();
    };

    const sendEmail = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setStatusMessage("Please fix the errors before submitting.");
            return;
        }

        setIsLoading(true);
        setStatusMessage("Validating email address...");
        setEmailSuggestion(null);
  
        try {
            // Get values from form elements
            const formElements = form.current.elements;
            const name = formElements.user_name.value;
            const email = formElements.user_email.value;
            const subject = formElements.subject.value;
            const message = formElements.message.value;

            // Validate email before sending
            const emailValidation = await validateEmailBeforeSending(email);
            
            if (!emailValidation.valid) {
                setIsLoading(false);
                setStatusMessage(`❌ ${emailValidation.error}`);
                setErrors(prev => ({ ...prev, user_email: emailValidation.error }));
                
                // Show suggestion if available
                if (emailValidation.suggestion) {
                    setEmailSuggestion(emailValidation.suggestion);
                }
                return;
            }

            setStatusMessage("Sending your message...");

            // Send notification to admin
            await sendContactNotification({
                name,
                email,
                subject,
                message,
                attachment: null
            });

            // Send confirmation to user
            await sendContactConfirmation({
                name,
                email
            });

            setStatusMessage("Message sent successfully! 🎉 Check your email inbox (or spam folder) for confirmation.");
            setIsLoading(false);
            clearForm();
        } catch (error) {
            console.error('Error sending email:', error);
            setIsLoading(false);
            
            // Display the exact error message from AWS SES
            const errorMessage = error.message || 'Failed to send message. Please try again.';
            setStatusMessage(`❌ ${errorMessage}`);
            
            // If it's an email-related error, also mark the email field
            if (errorMessage.toLowerCase().includes('email') || 
                errorMessage.toLowerCase().includes('address') ||
                errorMessage.toLowerCase().includes('invalid')) {
                setErrors(prev => ({ ...prev, user_email: errorMessage }));
            }
        }
    };

    const getFieldIcon = (fieldName) => {
        if (!touched[fieldName]) return null;
        if (errors[fieldName]) return <FaTimesCircle className="text-red-500" />;
        const value = form.current?.elements[fieldName]?.value;
        if (value && !errors[fieldName]) return <FaCheckCircle className="text-green-500" />;
        return null;
    };

    return (
        <section className={`section w-full py-16 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
        }`} id="contact">
            <div className="container max-w-7xl mx-auto px-4">
                <h2 className={`section__title text-3xl font-bold mb-12 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Get In Touch</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="contact__info flex flex-col justify-start">
                    <h3 className={`text-2xl font-semibold mb-4 transition-colors duration-300 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Let's talk about everything!</h3>
                    <p className={`text-lg transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Don't like forms? Send me an email. 👋</p>
                </div>

                <form action="" className="contact__form space-y-6" ref={form} onSubmit={sendEmail}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Field */}
                        <div className="contact__form-div">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    className={`w-full h-16 px-6 py-3 pr-12 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                                        errors.user_name && touched.user_name
                                            ? 'border-red-500 focus:ring-red-500'
                                            : !errors.user_name && touched.user_name
                                            ? 'border-green-500 focus:ring-green-500'
                                            : 'focus:ring-blue-500'
                                    } ${
                                        theme === 'dark' 
                                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    }`}
                                    name="user_name"
                                    placeholder="Insert your name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    {getFieldIcon('user_name')}
                                </div>
                            </div>
                            {errors.user_name && touched.user_name && (
                                <p className="text-red-500 text-sm mt-1">{errors.user_name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="contact__form-div">
                            <div className="relative">
                                <input 
                                    type="email" 
                                    className={`w-full h-16 px-6 py-3 pr-12 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                                        errors.user_email && touched.user_email
                                            ? 'border-red-500 focus:ring-red-500'
                                            : !errors.user_email && touched.user_email
                                            ? 'border-green-500 focus:ring-green-500'
                                            : 'focus:ring-blue-500'
                                    } ${
                                        theme === 'dark' 
                                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    }`}
                                    name="user_email"
                                    placeholder="Insert your email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    {getFieldIcon('user_email')}
                                </div>
                            </div>
                            {errors.user_email && touched.user_email && (
                                <p className="text-red-500 text-sm mt-1">{errors.user_email}</p>
                            )}
                            {emailSuggestion && (
                                <div className={`mt-2 p-3 rounded-lg border ${
                                    theme === 'dark' 
                                        ? 'bg-yellow-900/30 border-yellow-600 text-yellow-200' 
                                        : 'bg-yellow-50 border-yellow-300 text-yellow-800'
                                }`}>
                                    <p className="text-sm">
                                        Did you mean{' '}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                form.current.elements.user_email.value = emailSuggestion;
                                                setEmailSuggestion(null);
                                                setErrors(prev => ({ ...prev, user_email: '' }));
                                            }}
                                            className="font-semibold underline hover:no-underline"
                                        >
                                            {emailSuggestion}
                                        </button>
                                        ?
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Subject Field */}
                    <div className="contact__form-div">
                        <div className="relative">
                            <input 
                                type="text" 
                                className={`w-full h-16 px-6 py-3 pr-12 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-300 ${
                                    errors.subject && touched.subject
                                        ? 'border-red-500 focus:ring-red-500'
                                        : !errors.subject && touched.subject
                                        ? 'border-green-500 focus:ring-green-500'
                                        : 'focus:ring-blue-500'
                                } ${
                                    theme === 'dark' 
                                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                }`}
                                name="subject"
                                placeholder="Insert your subject"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                {getFieldIcon('subject')}
                            </div>
                        </div>
                        {errors.subject && touched.subject && (
                            <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                        )}
                    </div>

                    {/* Message Field */}
                    <div className="contact__form-div">
                        <div className="relative">
                            <textarea 
                                name="message" 
                                cols="30" 
                                rows="10" 
                                className={`w-full h-40 px-6 py-3 pr-12 border rounded-lg shadow-sm focus:outline-none focus:ring-2 resize-none transition-all duration-300 ${
                                    errors.message && touched.message
                                        ? 'border-red-500 focus:ring-red-500'
                                        : !errors.message && touched.message
                                        ? 'border-green-500 focus:ring-green-500'
                                        : 'focus:ring-blue-500'
                                } ${
                                    theme === 'dark' 
                                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                }`}
                                placeholder="Write your message"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            ></textarea>
                            <div className="absolute right-4 top-4">
                                {getFieldIcon('message')}
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            {errors.message && touched.message && (
                                <p className="text-red-500 text-sm">{errors.message}</p>
                            )}
                            <p className={`text-sm ml-auto ${
                                messageLength > 1000 ? 'text-red-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                {messageLength}/1000
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`flex-1 py-3 px-6 rounded-lg shadow focus:outline-none transition-all duration-300 flex items-center justify-center gap-2 ${
                                isLoading 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : ''
                            } ${
                                theme === 'dark'
                                    ? 'bg-blue-700 text-white hover:bg-blue-600'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Message'
                            )}
                        </button>
                        
                        <button 
                            type="button"
                            onClick={clearForm}
                            className={`py-3 px-6 rounded-lg shadow focus:outline-none transition-all duration-300 ${
                                theme === 'dark'
                                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                                    : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
                            }`}
                        >
                            Clear
                        </button>
                    </div>

                    {statusMessage && (
                        <p className={`text-center text-lg mt-4 font-semibold transition-colors duration-300 ${
                            statusMessage.includes('successfully') 
                                ? 'text-green-500' 
                                : statusMessage.includes('fix the errors')
                                ? 'text-red-500'
                                : theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                            {statusMessage}
                        </p>
                    )}
                </form>
            </div>
            </div>
        </section>
    );
}

export default Contact;
