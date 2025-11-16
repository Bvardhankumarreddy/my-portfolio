import React, { useState, useRef, useCallback } from 'react';
import { FaStar, FaTimes, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { addReview } from '../../aws/reviewService';
import ReCAPTCHA from 'react-google-recaptcha';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewForm = ({ onClose, theme }) => {
    // Only rating is controlled, text fields are uncontrolled
    const [rating, setRating] = useState(5);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [captchaToken, setCaptchaToken] = useState(null);
    const [captchaError, setCaptchaError] = useState(false);
    const [commentLength, setCommentLength] = useState(0);
    const recaptchaRef = useRef(null);
    const updateTimeoutRef = useRef(null);

    // Refs for uncontrolled fields
    const nameRef = useRef();
    const companyRef = useRef();
    const roleRef = useRef();
    const commentRef = useRef();

    const validateForm = () => {
        const newErrors = {};
        const blockedWords = [
            'fuck', 'shit', 'bitch', 'bastard', 'damn', 'hell', 'crap',
            'dick', 'cock', 'pussy', 'nigger', 'fag', 'retard', 'slut', 'whore',
            'sex', 'porn', 'xxx', 'nude', 'rape', 'kill', 'die', 'hate',
            'spam', 'bot'
        ];
        const containsBadWord = (text) => {
            const lowerText = text.toLowerCase();
            return blockedWords.some(word => {
                const regex = new RegExp(`\\b${word}\\b`, 'i');
                return regex.test(lowerText);
            });
        };
        const name = nameRef.current.value;
        const company = companyRef.current.value;
        const role = roleRef.current.value;
        const comment = commentRef.current.value;

        if (!name.trim()) {
            newErrors.name = 'Name is required';
        } else if (name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        } else if (name.trim().length > 50) {
            newErrors.name = 'Name must be less than 50 characters';
        } else if (!/^[a-zA-Z\s.''-]+$/.test(name.trim())) {
            newErrors.name = 'Name can only contain letters, spaces, and basic punctuation';
        } else if (containsBadWord(name)) {
            newErrors.name = 'Please enter a respectful name';
        } else if (/(.)\1{3,}/.test(name)) {
            newErrors.name = 'Name contains too many repeated characters';
        } else if (/^\d+$/.test(name.trim())) {
            newErrors.name = 'Name cannot be only numbers';
        }

        if (!company.trim()) {
            newErrors.company = 'Company name is required';
        } else if (company.trim().length < 2) {
            newErrors.company = 'Company name must be at least 2 characters';
        } else if (company.trim().length > 100) {
            newErrors.company = 'Company name must be less than 100 characters';
        } else if (containsBadWord(company)) {
            newErrors.company = 'Please enter a respectful company name';
        }

        if (!role.trim()) {
            newErrors.role = 'Role/Position is required';
        } else if (role.trim().length < 2) {
            newErrors.role = 'Role must be at least 2 characters';
        } else if (role.trim().length > 100) {
            newErrors.role = 'Role must be less than 100 characters';
        } else if (containsBadWord(role)) {
            newErrors.role = 'Please enter a respectful role/position';
        }

        if (!comment.trim()) {
            newErrors.comment = 'Please share your feedback';
        } else if (comment.trim().length < 10) {
            newErrors.comment = 'Comment must be at least 10 characters';
        } else if (comment.trim().length > 500) {
            newErrors.comment = 'Comment must be less than 500 characters';
        } else if (containsBadWord(comment)) {
            newErrors.comment = 'Please keep your feedback respectful and professional';
        }

        if (rating < 1 || rating > 5) {
            newErrors.rating = 'Please select a rating';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Check CAPTCHA validation (allow bypass if CAPTCHA failed to load)
        if (!captchaToken && !captchaError) {
            setErrors({ captcha: 'Please complete the CAPTCHA verification' });
            return;
        }

        // Check if user already submitted (stored in localStorage)
        const submittedReviews = JSON.parse(localStorage.getItem('submittedReviews') || '[]');
        const normalizedName = nameRef.current.value.trim().toLowerCase();
        if (submittedReviews.includes(normalizedName)) {
            setErrors({ name: 'You have already submitted a review with this name' });
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            await addReview({
                name: nameRef.current.value.trim(),
                company: companyRef.current.value.trim(),
                role: roleRef.current.value.trim(),
                title: `${roleRef.current.value.trim()} at ${companyRef.current.value.trim()}`,
                rating,
                comment: commentRef.current.value.trim()
            });

            // Store name for duplicate prevention only
            submittedReviews.push(normalizedName);
            localStorage.setItem('submittedReviews', JSON.stringify(submittedReviews));

            setSubmitStatus('success');

            setTimeout(() => {
                // Clear fields
                nameRef.current.value = '';
                companyRef.current.value = '';
                roleRef.current.value = '';
                commentRef.current.value = '';
                setCommentLength(0);
                setCaptchaToken(null);
                setRating(5);
                if (recaptchaRef.current) {
                    recaptchaRef.current.reset();
                }
                setSubmitStatus(null);
                onClose();
            }, 3000);

        } catch (error) {
            console.error('Error submitting review:', error);
            console.error('Error details:', error.message);
            console.error('Error code:', error.code);

            // Reset CAPTCHA on error
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
            setCaptchaToken(null);

            // Show user-friendly error message
            if (error.message.includes('Inappropriate')) {
                setErrors({ name: 'Please use a respectful name' });
            } else {
                setSubmitStatus('error');
            }
            setIsSubmitting(false);
        }
    };

    // No-op for uncontrolled fields, just clear errors and update comment length
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        
        // Update comment length for character counter
        if (name === 'comment') {
            setCommentLength(value.length);
        }
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    const handleRatingClick = (star) => {
        setRating(star);
        if (errors.rating) {
            setErrors(prev => ({ ...prev, rating: '' }));
        }
    };

    const handleCaptchaChange = (token) => {
        setCaptchaToken(token);
        setCaptchaError(false);
        if (errors.captcha) {
            setErrors(prev => ({ ...prev, captcha: '' }));
        }
    };

    const handleCaptchaError = () => {
        setCaptchaError(true);
        setCaptchaToken(null);
        console.warn('reCAPTCHA failed to load or timed out');
    };

    const handleCaptchaExpired = () => {
        setCaptchaToken(null);
        setErrors(prev => ({ ...prev, captcha: 'CAPTCHA expired. Please try again.' }));
    };

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className={`relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-8 ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 ${
                        theme === 'dark' 
                            ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                    }`}
                >
                    <FaTimes size={20} />
                </button>

                <div className="text-center mb-6">
                    <h3 className={`text-2xl font-bold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                        Rate My Work
                    </h3>
                    <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        Your feedback helps me improve
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            ref={nameRef}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                                errors.name
                                    ? 'border-red-500 focus:border-red-500'
                                    : theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            } outline-none`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Company Field */}
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="company"
                            ref={companyRef}
                            onChange={handleChange}
                            placeholder="Enter your company (optional)"
                            className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                                errors.company
                                    ? 'border-red-500 focus:border-red-500'
                                    : theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            } outline-none`}
                        />
                        {errors.company && (
                            <p className="text-red-500 text-sm mt-1">{errors.company}</p>
                        )}
                    </div>

                    {/* Role Field */}
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Your Role/Position <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="role"
                            ref={roleRef}
                            onChange={handleChange}
                            placeholder="Enter your role (optional)"
                            className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                                errors.role
                                    ? 'border-red-500 focus:border-red-500'
                                    : theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            } outline-none`}
                        />
                        {errors.role && (
                            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                        )}
                    </div>

                    <div>
                        <label className={`block text-sm font-semibold mb-3 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Your Rating <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center justify-center gap-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <motion.button
                                    key={star}
                                    type="button"
                                    onClick={() => handleRatingClick(star)}
                                    whileHover={{ scale: 1.2, rotate: 15 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="transition-all focus:outline-none"
                                >
                                    <motion.div
                                        animate={{
                                            scale: star <= rating ? [1, 1.2, 1] : 1,
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <FaStar
                                            size={40}
                                            className={`${
                                                star <= rating
                                                    ? 'text-yellow-500'
                                                    : theme === 'dark'
                                                    ? 'text-gray-600'
                                                    : 'text-gray-300'
                                            } transition-colors cursor-pointer`}
                                        />
                                    </motion.div>
                                </motion.button>
                            ))}
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.p 
                                key={rating}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className={`text-center mt-3 text-sm font-semibold ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}
                            >
                                {rating === 5 && '⭐ Excellent!'}
                                {rating === 4 && '😊 Very Good!'}
                                {rating === 3 && '👍 Good!'}
                                {rating === 2 && '😐 Fair'}
                                {rating === 1 && '😞 Poor'}
                            </motion.p>
                        </AnimatePresence>
                        {errors.rating && (
                            <p className="text-red-500 text-sm text-center mt-2">{errors.rating}</p>
                        )}
                    </div>

                    {/* Comment/Feedback Field */}
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Your Feedback <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="comment"
                            ref={commentRef}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Share your thoughts about my work..."
                            className={`w-full px-4 py-3 rounded-lg border-2 transition-all resize-none ${
                                errors.comment
                                    ? 'border-red-500 focus:border-red-500'
                                    : theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            } outline-none`}
                        />
                        {errors.comment && (
                            <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
                        )}
                        <p className={`text-xs mt-1 text-right ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                            {commentLength}/500
                        </p>
                    </div>

                    {/* reCAPTCHA */}
                    <div className="flex flex-col items-center">
                        {!captchaError ? (
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                                onChange={handleCaptchaChange}
                                onError={handleCaptchaError}
                                onExpired={handleCaptchaExpired}
                                theme={theme === 'dark' ? 'dark' : 'light'}
                            />
                        ) : (
                            <div className={`p-4 rounded-lg border-2 ${
                                theme === 'dark' 
                                    ? 'bg-yellow-900/20 border-yellow-600 text-yellow-400' 
                                    : 'bg-yellow-50 border-yellow-400 text-yellow-800'
                            }`}>
                                <p className="text-sm">⚠️ CAPTCHA failed to load. You can still submit without it.</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCaptchaError(false);
                                        setCaptchaToken('bypass');
                                    }}
                                    className="text-xs underline mt-2"
                                >
                                    Retry CAPTCHA
                                </button>
                            </div>
                        )}
                    </div>
                    {errors.captcha && (
                        <p className="text-red-500 text-sm text-center">{errors.captcha}</p>
                    )}

                    {submitStatus === 'success' && (
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", duration: 0.6 }}
                            className="bg-green-500/20 border-2 border-green-500 text-green-500 p-4 rounded-lg text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            >
                                <FaCheckCircle className="text-4xl mx-auto mb-2" />
                            </motion.div>
                            <p className="font-semibold">Review Submitted Successfully!</p>
                            <p className="text-sm mt-1">Your review is pending approval and will appear soon.</p>
                        </motion.div>
                    )}

                    {submitStatus === 'error' && (
                        <div className="bg-red-500/20 border-2 border-red-500 text-red-500 p-4 rounded-lg text-center">
                            <p className="font-semibold">✗ Something went wrong</p>
                            <p className="text-sm mt-1">Please check the browser console for details or contact the site owner.</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 rounded-lg font-bold text-white transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                            isSubmitting
                                ? 'bg-gray-500'
                                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg'
                        }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <FaSpinner className="animate-spin" />
                                Submitting...
                            </span>
                        ) : (
                            'Submit Rating'
                        )}
                    </button>
                </form>

                <p className={`text-xs text-center mt-4 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                    Your rating will be displayed publicly
                </p>
            </motion.div>
        </motion.div>
        </AnimatePresence>
    );
};

export default ReviewForm;
