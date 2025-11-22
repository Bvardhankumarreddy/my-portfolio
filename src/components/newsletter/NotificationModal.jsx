import React, { useState } from 'react';
import { FaPaperPlane, FaLinkedin, FaYoutube, FaMedium, FaTimes } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { sendManualNotification } from '../../aws/contentNotificationService';

const NotificationModal = ({ onClose }) => {
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        platform: 'linkedin',
        title: '',
        url: '',
        excerpt: '',
        author: 'Vardhan Kumar Reddy',
        publishDate: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const platformOptions = [
        { value: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, color: '#0A66C2' },
        { value: 'youtube', label: 'YouTube', icon: FaYoutube, color: '#FF0000' },
        { value: 'medium', label: 'Medium', icon: FaMedium, color: '#000000' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await sendManualNotification(formData);
            setResult(response);
            
            // Auto-close after 3 seconds on success
            if (response.success) {
                setTimeout(() => {
                    onClose();
                }, 3000);
            }
        } catch (err) {
            setError(err.message || 'Failed to send notifications');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`w-full max-w-2xl rounded-xl shadow-2xl p-6 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <FaPaperPlane className={`text-2xl ${
                            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                        <h2 className={`text-2xl font-bold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                            Notify Subscribers
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg transition-colors ${
                            theme === 'dark'
                                ? 'hover:bg-gray-700 text-gray-400'
                                : 'hover:bg-gray-100 text-gray-600'
                        }`}
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Platform Selection */}
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>Platform *</label>
                        <div className="grid grid-cols-3 gap-3">
                            {platformOptions.map((platform) => {
                                const Icon = platform.icon;
                                const isSelected = formData.platform === platform.value;
                                return (
                                    <button
                                        key={platform.value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, platform: platform.value }))}
                                        className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                                            isSelected
                                                ? `border-[${platform.color}] bg-opacity-10`
                                                : theme === 'dark'
                                                ? 'border-gray-600 hover:border-gray-500'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                        style={isSelected ? { borderColor: platform.color, backgroundColor: `${platform.color}15` } : {}}
                                    >
                                        <Icon className="text-3xl" style={{ color: platform.color }} />
                                        <span className={`text-sm font-semibold ${
                                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>{platform.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                                theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder="Enter the title of your post"
                        />
                    </div>

                    {/* URL */}
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>URL *</label>
                        <input
                            type="url"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                                theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder="https://..."
                        />
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className={`block text-sm font-semibold mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>Excerpt (Optional)</label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            rows="3"
                            className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                                theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder="Brief description to include in the email..."
                        />
                    </div>

                    {/* Result Message */}
                    {result && (
                        <div className={`p-4 rounded-lg ${
                            result.success
                                ? 'bg-green-100 border border-green-400 text-green-700'
                                : 'bg-red-100 border border-red-400 text-red-700'
                        }`}>
                            <p className="font-semibold">
                                {result.success ? '✅ Success!' : '❌ Error'}
                            </p>
                            <p className="text-sm mt-1">{result.message}</p>
                            {result.sent > 0 && (
                                <p className="text-sm mt-1">
                                    Sent to {result.sent} subscriber{result.sent !== 1 ? 's' : ''}
                                    {result.failed > 0 && ` (${result.failed} failed)`}
                                </p>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            <FaPaperPlane /> {loading ? 'Sending...' : 'Send Notifications'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                                theme === 'dark'
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NotificationModal;
