import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const AddEditModal = ({ type, item, onSave, onClose }) => {
    const { theme } = useTheme();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (item) {
            setFormData(item);
        } else {
            // Set default form data based on type
            switch (type) {
                case 'project':
                    setFormData({
                        title: '',
                        shortDescription: '',
                        category: 'DevOps & CI/CD',
                        techStack: [],
                        liveUrl: '',
                        githubUrl: '',
                        features: [],
                        metrics: {
                            uptime: '',
                            deploymentTime: '',
                            servers: ''
                        }
                    });
                    break;
                case 'certification':
                    setFormData({
                        title: '',
                        issuer: '',
                        date: '',
                        description: '',
                        category: 'Certifications',
                        validationNumber: '',
                        duration: '',
                        instructor: ''
                    });
                    break;
                case 'blog':
                    setFormData({
                        title: '',
                        excerpt: '',
                        category: 'DevOps',
                        readTime: 5,
                        url: '',
                        tags: [],
                        date: new Date().toISOString().split('T')[0],
                        author: 'Vardhan Kumar Reddy'
                    });
                    break;
                default:
                    break;
            }
        }
    }, [item, type]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Handle nested metrics for projects
        if (name.startsWith('metrics.')) {
            const metricKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                metrics: {
                    ...prev.metrics,
                    [metricKey]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleArrayChange = (e, fieldName) => {
        const { value } = e.target;
        const array = value.split(',').map(item => item.trim()).filter(item => item);
        setFormData(prev => ({
            ...prev,
            [fieldName]: array
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to save. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto" style={{ zIndex: 9999 }}>
            <div className={`w-full max-w-3xl rounded-xl shadow-2xl p-6 my-8 max-h-[90vh] overflow-y-auto ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                        {item ? 'Edit' : 'Add New'} {type.charAt(0).toUpperCase() + type.slice(1)}
                    </h2>
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
                    {type === 'project' && (
                        <ProjectForm formData={formData} handleChange={handleChange} handleArrayChange={handleArrayChange} theme={theme} />
                    )}
                    {type === 'certification' && (
                        <CertificationForm formData={formData} handleChange={handleChange} theme={theme} />
                    )}
                    {type === 'blog' && (
                        <BlogForm formData={formData} handleChange={handleChange} handleArrayChange={handleArrayChange} theme={theme} />
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
                            <FaSave /> {loading ? 'Saving...' : 'Save'}
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

// Project Form Fields
const ProjectForm = ({ formData, handleChange, handleArrayChange, theme }) => (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Title *</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Project Name"
                />
            </div>

            <div className="md:col-span-2">
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Short Description *</label>
                <textarea
                    name="shortDescription"
                    value={formData.shortDescription || ''}
                    onChange={handleChange}
                    required
                    rows="2"
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Brief project description"
                />
            </div>

            <div>
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Category *</label>
                <select
                    name="category"
                    value={formData.category || ''}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                >
                    <option value="DevOps & CI/CD">DevOps & CI/CD</option>
                    <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                    <option value="Automation">Automation</option>
                    <option value="Web Development">Web Development</option>
                </select>
            </div>

            <div>
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Tech Stack (comma-separated) *</label>
                <input
                    type="text"
                    value={formData.techStack?.join(', ') || ''}
                    onChange={(e) => handleArrayChange(e, 'techStack')}
                    required
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="AWS, Docker, Jenkins"
                />
            </div>

            <div>
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Live URL</label>
                <input
                    type="url"
                    name="liveUrl"
                    value={formData.liveUrl || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="https://example.com"
                />
            </div>

            <div>
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>GitHub URL</label>
                <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="https://github.com/..."
                />
            </div>

            <div className="md:col-span-2">
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Features (comma-separated)</label>
                <textarea
                    value={formData.features?.join(', ') || ''}
                    onChange={(e) => handleArrayChange(e, 'features')}
                    rows="3"
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Feature 1, Feature 2, Feature 3"
                />
            </div>

            <div>
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Uptime</label>
                <input
                    type="text"
                    name="metrics.uptime"
                    value={formData.metrics?.uptime || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="99.9%"
                />
            </div>

            <div>
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Deployment Time</label>
                <input
                    type="text"
                    name="metrics.deploymentTime"
                    value={formData.metrics?.deploymentTime || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="5 mins"
                />
            </div>

            <div>
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Servers</label>
                <input
                    type="text"
                    name="metrics.servers"
                    value={formData.metrics?.servers || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="10+"
                />
            </div>
        </div>
    </>
);

// Certification Form Fields
const CertificationForm = ({ formData, handleChange, theme }) => (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Title *</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Certification Name"
                />
            </div>

            <div>
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Issuer *</label>
                <input
                    type="text"
                    name="issuer"
                    value={formData.issuer || ''}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="AWS, Udemy, etc."
                />
            </div>

            <div>
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Date *</label>
                <input
                    type="date"
                    name="date"
                    value={formData.date || ''}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                />
            </div>

            <div>
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Instructor</label>
                <input
                    type="text"
                    name="instructor"
                    value={formData.instructor || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Instructor name"
                />
            </div>

            <div>
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Duration</label>
                <input
                    type="text"
                    name="duration"
                    value={formData.duration || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="20 hours"
                />
            </div>

            <div>
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Validation Number</label>
                <input
                    type="text"
                    name="validationNumber"
                    value={formData.validationNumber || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Certificate ID"
                />
            </div>

            <div className="md:col-span-2">
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Description *</label>
                <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    required
                    rows="3"
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Brief description of the certification"
                />
            </div>
        </div>
    </>
);

// Blog Form Fields
const BlogForm = ({ formData, handleChange, handleArrayChange, theme }) => (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Title *</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Blog Post Title"
                />
            </div>

            <div className="md:col-span-2">
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Excerpt *</label>
                <textarea
                    name="excerpt"
                    value={formData.excerpt || ''}
                    onChange={handleChange}
                    required
                    rows="2"
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Brief summary of the blog post"
                />
            </div>

            <div>
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Category *</label>
                <select
                    name="category"
                    value={formData.category || ''}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                >
                    <option value="DevOps">DevOps</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Cloud">Cloud</option>
                </select>
            </div>

            <div>
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Read Time (minutes) *</label>
                <input
                    type="number"
                    name="readTime"
                    value={formData.readTime || ''}
                    onChange={handleChange}
                    required
                    min="1"
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="5"
                />
            </div>

            <div className="md:col-span-2">
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Medium URL *</label>
                <input
                    type="url"
                    name="url"
                    value={formData.url || ''}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="https://medium.com/@..."
                />
            </div>

            <div>
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Tags (comma-separated) *</label>
                <input
                    type="text"
                    value={formData.tags?.join(', ') || ''}
                    onChange={(e) => handleArrayChange(e, 'tags')}
                    required
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="DevOps, Docker, AWS"
                />
            </div>

            <div>
                <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Date *</label>
                <input
                    type="date"
                    name="date"
                    value={formData.date || ''}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-lg border-2 outline-none transition-colors ${
                        theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                />
            </div>
        </div>
    </>
);

export default AddEditModal;
