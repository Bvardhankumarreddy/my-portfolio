import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaStar, FaTrash, FaEye, FaLock, FaSignOutAlt } from 'react-icons/fa';
import { getUnapprovedReviews, updateReviewApproval, deleteReview } from '../../aws/reviewService';
import './adminpanel.css';

const AdminPanel = () => {
    const [pendingReviews, setPendingReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [selectedReview, setSelectedReview] = useState(null);

    // Simple password authentication (in production, use proper auth)
    const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'admin123';

    useEffect(() => {
        // Check if already authenticated in session
        const auth = sessionStorage.getItem('adminAuth');
        if (auth === 'true') {
            setIsAuthenticated(true);
            fetchPendingReviews();
        } else {
            setLoading(false);
        }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            sessionStorage.setItem('adminAuth', 'true');
            setError('');
            fetchPendingReviews();
        } else {
            setError('Invalid password');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('adminAuth');
        setPassword('');
    };

    const fetchPendingReviews = async () => {
        setLoading(true);
        try {
            const reviews = await getUnapprovedReviews();
            setPendingReviews(reviews);
        } catch (error) {
            console.error('Error fetching pending reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (reviewId) => {
        try {
            await updateReviewApproval(reviewId, true);
            setPendingReviews(pendingReviews.filter(r => r.id !== reviewId));
            setSelectedReview(null);
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
                setSelectedReview(null);
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
            <div className="admin-login">
                <div className="login-container">
                    <div className="login-header">
                        <FaLock className="lock-icon" />
                        <h2>Admin Access</h2>
                        <p>Enter password to manage reviews</p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                className="password-input"
                                autoFocus
                            />
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <button type="submit" className="login-button">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <div>
                    <h1>Review Moderation</h1>
                    <p>Pending reviews: {pendingReviews.length}</p>
                </div>
                <button onClick={handleLogout} className="logout-button">
                    <FaSignOutAlt /> Logout
                </button>
            </div>

            {loading ? (
                <div className="loading">Loading pending reviews...</div>
            ) : pendingReviews.length === 0 ? (
                <div className="no-reviews">
                    <FaCheck className="check-icon" />
                    <h2>All Clear!</h2>
                    <p>No pending reviews at the moment.</p>
                </div>
            ) : (
                <div className="reviews-grid">
                    {pendingReviews.map((review) => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <div>
                                    <h3>{review.name}</h3>
                                    <p className="review-title">{review.title}</p>
                                </div>
                                <div className="rating">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={i < review.rating ? 'star-filled' : 'star-empty'}
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            <div className="review-meta">
                                <span><strong>Company:</strong> {review.company}</span>
                                <span><strong>Role:</strong> {review.role}</span>
                            </div>

                            <p className="review-comment">{review.comment}</p>

                            <div className="review-footer">
                                <span className="review-date">
                                    {formatDate(review.createdAt)}
                                </span>
                                <div className="action-buttons">
                                    <button
                                        onClick={() => setSelectedReview(review)}
                                        className="btn-view"
                                        title="View Details"
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        onClick={() => handleApprove(review.id)}
                                        className="btn-approve"
                                        title="Approve"
                                    >
                                        <FaCheck />
                                    </button>
                                    <button
                                        onClick={() => handleReject(review.id)}
                                        className="btn-reject"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {selectedReview && (
                <div className="modal-overlay" onClick={() => setSelectedReview(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedReview(null)}>
                            <FaTimes />
                        </button>
                        <h2>Review Details</h2>
                        <div className="modal-body">
                            <div className="detail-row">
                                <strong>Name:</strong> {selectedReview.name}
                            </div>
                            <div className="detail-row">
                                <strong>Company:</strong> {selectedReview.company}
                            </div>
                            <div className="detail-row">
                                <strong>Role:</strong> {selectedReview.role}
                            </div>
                            <div className="detail-row">
                                <strong>Rating:</strong>
                                <div className="rating">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={i < selectedReview.rating ? 'star-filled' : 'star-empty'}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="detail-row">
                                <strong>Comment:</strong>
                                <p>{selectedReview.comment}</p>
                            </div>
                            <div className="detail-row">
                                <strong>Submitted:</strong> {formatDate(selectedReview.createdAt)}
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button
                                onClick={() => handleApprove(selectedReview.id)}
                                className="btn-approve-large"
                            >
                                <FaCheck /> Approve Review
                            </button>
                            <button
                                onClick={() => handleReject(selectedReview.id)}
                                className="btn-reject-large"
                            >
                                <FaTrash /> Delete Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
