import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaStar, FaTrash, FaLock, FaSignOutAlt, FaPlus, FaEdit, FaProjectDiagram, FaCertificate, FaBlog, FaPaperPlane } from 'react-icons/fa';
import { getUnapprovedReviews, updateReviewApproval, deleteReview } from '../../aws/reviewService';
import { 
    getProjects, addProject, updateProject, deleteProject,
    getCertifications, addCertification, updateCertification, deleteCertification,
    getBlogs, addBlog, updateBlog, deleteBlog 
} from '../../aws/contentService';
import AddEditModal from './AddEditModal';
import NotificationModal from '../newsletter/NotificationModal';
import './adminpanel.css';
import { useTheme } from '../../context/ThemeContext';

const AdminPanel = () => {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState('reviews'); // reviews, projects, certifications, blogs
    const [pendingReviews, setPendingReviews] = useState([]);
    const [projects, setProjects] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('project'); // project, certification, blog
    const [editingItem, setEditingItem] = useState(null);
    const [error, setError] = useState('');
    const [showNotificationModal, setShowNotificationModal] = useState(false);

    // Simple password authentication
    const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'admin123';

    useEffect(() => {
        const auth = sessionStorage.getItem('adminAuth');
        if (auth === 'true') {
            setIsAuthenticated(true);
            fetchAllData();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [reviewsData, projectsData, certificationsData, blogsData] = await Promise.all([
                getUnapprovedReviews(),
                getProjects(),
                getCertifications(),
                getBlogs()
            ]);
            setPendingReviews(reviewsData);
            setProjects(projectsData);
            setCertifications(certificationsData);
            setBlogs(blogsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            sessionStorage.setItem('adminAuth', 'true');
            setError('');
            fetchAllData();
        } else {
            setError('Invalid password');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('adminAuth');
        setPassword('');
    };

    // Review handlers
    const handleApprove = async (reviewId) => {
        try {
            await updateReviewApproval(reviewId, true);
            setPendingReviews(pendingReviews.filter(r => r.id !== reviewId));
        } catch (error) {
            console.error('Error approving review:', error);
            alert('Failed to approve review');
        }
    };

    const handleReject = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                await deleteReview(reviewId);
                setPendingReviews(pendingReviews.filter(r => r.id !== reviewId));
            } catch (error) {
                console.error('Error deleting review:', error);
                alert('Failed to delete review');
            }
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    if (!isAuthenticated) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
            }`}>
                <div className={`w-full max-w-md p-8 rounded-xl shadow-2xl ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="text-center mb-6">
                        <FaLock className={`text-5xl mx-auto mb-4 ${
                            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                        <h2 className={`text-3xl font-bold mb-2 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>Admin Access</h2>
                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                            Enter password to access admin panel
                        </p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-colors ${
                                    error 
                                        ? 'border-red-500 focus:border-red-600'
                                        : theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                }`}
                            />
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen p-6 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
        }`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className={`mb-6 p-4 md:p-6 rounded-xl shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h1 className={`text-2xl md:text-3xl font-bold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>Admin Dashboard</h1>
                        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => setShowNotificationModal(true)}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all text-sm sm:text-base"
                            >
                                <FaPaperPlane /> <span className="hidden sm:inline">Notify Subscribers</span><span className="sm:hidden">Notify</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                            >
                                <FaSignOutAlt /> Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className={`mb-6 p-4 rounded-xl shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="flex flex-wrap gap-2">
                        <TabButton 
                            active={activeTab === 'reviews'}
                            onClick={() => setActiveTab('reviews')}
                            icon={<FaStar />}
                            label={`Reviews (${pendingReviews.length})`}
                            theme={theme}
                        />
                        <TabButton 
                            active={activeTab === 'projects'}
                            onClick={() => setActiveTab('projects')}
                            icon={<FaProjectDiagram />}
                            label={`Projects (${projects.length})`}
                            theme={theme}
                        />
                        <TabButton 
                            active={activeTab === 'certifications'}
                            onClick={() => setActiveTab('certifications')}
                            icon={<FaCertificate />}
                            label={`Certifications (${certifications.length})`}
                            theme={theme}
                        />
                        <TabButton 
                            active={activeTab === 'blogs'}
                            onClick={() => setActiveTab('blogs')}
                            icon={<FaBlog />}
                            label={`Blogs (${blogs.length})`}
                            theme={theme}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className={`p-6 rounded-xl shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Loading...
                            </p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'reviews' && (
                                <ReviewsTab 
                                    reviews={pendingReviews}
                                    onApprove={handleApprove}
                                    onReject={handleReject}
                                    formatDate={formatDate}
                                    theme={theme}
                                />
                            )}
                            {activeTab === 'projects' && (
                                <ContentTab
                                    type="project"
                                    items={projects}
                                    onAdd={() => {
                                        setModalType('project');
                                        setEditingItem(null);
                                        setShowModal(true);
                                    }}
                                    onEdit={(item) => {
                                        setModalType('project');
                                        setEditingItem(item);
                                        setShowModal(true);
                                    }}
                                    onDelete={async (id) => {
                                        if (window.confirm('Delete this project?')) {
                                            await deleteProject(id);
                                            fetchAllData();
                                        }
                                    }}
                                    theme={theme}
                                />
                            )}
                            {activeTab === 'certifications' && (
                                <ContentTab
                                    type="certification"
                                    items={certifications}
                                    onAdd={() => {
                                        setModalType('certification');
                                        setEditingItem(null);
                                        setShowModal(true);
                                    }}
                                    onEdit={(item) => {
                                        setModalType('certification');
                                        setEditingItem(item);
                                        setShowModal(true);
                                    }}
                                    onDelete={async (id) => {
                                        if (window.confirm('Delete this certification?')) {
                                            await deleteCertification(id);
                                            fetchAllData();
                                        }
                                    }}
                                    theme={theme}
                                />
                            )}
                            {activeTab === 'blogs' && (
                                <ContentTab
                                    type="blog"
                                    items={blogs}
                                    onAdd={() => {
                                        setModalType('blog');
                                        setEditingItem(null);
                                        setShowModal(true);
                                    }}
                                    onEdit={(item) => {
                                        setModalType('blog');
                                        setEditingItem(item);
                                        setShowModal(true);
                                    }}
                                    onDelete={async (id) => {
                                        if (window.confirm('Delete this blog?')) {
                                            await deleteBlog(id);
                                            fetchAllData();
                                        }
                                    }}
                                    theme={theme}
                                />
                            )}
                        </>
                    )}

                    {/* Add/Edit Modal */}
                    {showModal && (
                        <AddEditModal
                            type={modalType}
                            item={editingItem}
                            onSave={async (data) => {
                                if (modalType === 'project') {
                                    if (editingItem) {
                                        await updateProject(editingItem.id, data);
                                    } else {
                                        await addProject(data);
                                    }
                                } else if (modalType === 'certification') {
                                    if (editingItem) {
                                        await updateCertification(editingItem.id, data);
                                    } else {
                                        await addCertification(data);
                                    }
                                } else if (modalType === 'blog') {
                                    if (editingItem) {
                                        await updateBlog(editingItem.id, data);
                                    } else {
                                        await addBlog(data);
                                    }
                                }
                                fetchAllData();
                                setShowModal(false);
                                setEditingItem(null);
                            }}
                            onClose={() => {
                                setShowModal(false);
                                setEditingItem(null);
                            }}
                        />
                    )}

                    {/* Notification Modal */}
                    {showNotificationModal && (
                        <NotificationModal
                            onClose={() => setShowNotificationModal(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

// Tab Button Component
const TabButton = ({ active, onClick, icon, label, theme }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
            active
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                : theme === 'dark'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

// Reviews Tab Component
const ReviewsTab = ({ reviews, onApprove, onReject, formatDate, theme }) => {
    const [expandedReviews, setExpandedReviews] = React.useState({});

    const toggleExpand = (reviewId) => {
        setExpandedReviews(prev => ({
            ...prev,
            [reviewId]: !prev[reviewId]
        }));
    };

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12">
                <FaStar className={`text-6xl mx-auto mb-4 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                }`} />
                <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    No pending reviews
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((review) => {
                const isExpanded = expandedReviews[review.id];
                const isLongText = review.comment.length > 150;
                
                return (
                    <div
                        key={review.id}
                        className={`p-5 rounded-lg border-2 transition-all hover:shadow-lg ${
                            theme === 'dark'
                                ? 'border-gray-700 bg-gray-700'
                                : 'border-gray-200 bg-gray-50'
                        }`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h3 className={`font-bold text-lg ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>{review.name}</h3>
                                <p className={`text-sm ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>{review.role} at {review.company}</p>
                            </div>
                            <div className="flex gap-1 ml-2">
                                {[...Array(review.rating)].map((_, i) => (
                                    <FaStar key={i} className="text-yellow-500 text-sm" />
                                ))}
                            </div>
                        </div>
                        
                        <div className={`text-sm mb-3 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            <p className={`whitespace-pre-wrap ${!isExpanded && isLongText ? 'line-clamp-4' : ''}`}>
                                {review.comment}
                            </p>
                            {isLongText && (
                                <button
                                    onClick={() => toggleExpand(review.id)}
                                    className={`text-xs mt-2 underline ${
                                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                                    } hover:no-underline`}
                                >
                                    {isExpanded ? 'Show less' : 'Read more'}
                                </button>
                            )}
                        </div>
                        
                        <p className={`text-xs mb-4 ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        }`}>{formatDate(review.createdAt)}</p>
                        
                        <div className="flex gap-2">
                            <button
                                onClick={() => onApprove(review.id)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                            >
                                <FaCheck /> Approve
                            </button>
                            <button
                                onClick={() => onReject(review.id)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                            >
                                <FaTimes /> Reject
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Content Tab Component (for Projects, Certifications, Blogs)
const ContentTab = ({ type, items, onAdd, onEdit, onDelete, theme }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                    Manage {type.charAt(0).toUpperCase() + type.slice(1)}s
                </h2>
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                    <FaPlus /> Add New
                </button>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-12">
                    <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        No {type}s yet. Click "Add New" to create one.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className={`p-4 rounded-lg border-2 transition-all hover:shadow-lg ${
                                theme === 'dark'
                                    ? 'border-gray-700 bg-gray-700'
                                    : 'border-gray-200 bg-gray-50'
                            }`}
                        >
                            <h3 className={`font-bold text-lg mb-2 ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>{item.title}</h3>
                            <p className={`text-sm mb-4 line-clamp-2 ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>{item.shortDescription || item.excerpt || item.description}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEdit(item)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                    <FaEdit /> Edit
                                </button>
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
