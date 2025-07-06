import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FaStar, FaRegStar, FaUser, FaCalendarAlt } from 'react-icons/fa';
import { API_ENDPOINTS } from '../../utils/config';
import './ProductRating.css';

const ProductRating = ({ productId, currentRating, onRatingUpdate }) => {
  const { user } = useSelector((state) => state.auth);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.GET_REVIEWS(productId));
      if (response.data.success) {
        setReviews(response.data.data.reviews);
        
        // Check if current user has already rated
        if (user) {
          const userReview = response.data.data.reviews.find(
            review => review.user._id === user._id
          );
          if (userReview) {
            setUserRating(userReview.stars);
            setComment(userReview.comment || '');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (rating) => {
    if (!user) {
      setError('Please log in to rate this product');
      return;
    }
    setUserRating(rating);
    setShowReviewForm(true);
  };

  const handleStarHover = (rating) => {
    setHoverRating(rating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmitRating = async () => {
    if (!user) {
      setError('Please log in to rate this product');
      return;
    }

    if (!user._id) {
      setError('User ID not available. Please log in again.');
      return;
    }

    if (userRating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      console.log('=== FRONTEND RATING DEBUG ===');
      console.log('Product ID:', productId);
      console.log('User ID:', user._id);
      console.log('Stars:', userRating);
      console.log('Comment:', comment.trim());
      console.log('User object:', user);

      const payload = {
        userId: user._id,
        stars: userRating,
        comment: comment.trim()
      };

      console.log('Request payload:', payload);

      const response = await axios.post(API_ENDPOINTS.ADD_RATING(productId), payload);

      console.log('Rating response:', response.data);

      if (response.data.success) {
        setSuccess(response.data.message);
        setShowReviewForm(false);
        
        // Update the product rating in parent component
        if (onRatingUpdate) {
          onRatingUpdate(response.data.data.rating);
        }
        
        // Refresh reviews
        await fetchReviews();
        
        // Clear form after successful submission
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setError(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, size = 'text-xl') => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = interactive 
            ? (hoverRating >= star || userRating >= star)
            : rating >= star;
          
          return (
            <span
              key={star}
              className={`${size} cursor-pointer transition-colors duration-200 ${
                filled ? 'text-yellow-400' : 'text-gray-400'
              } ${interactive ? 'hover:text-yellow-300' : ''}`}
              onClick={interactive ? () => handleStarClick(star) : undefined}
              onMouseEnter={interactive ? () => handleStarHover(star) : undefined}
              onMouseLeave={interactive ? handleStarLeave : undefined}
            >
              {filled ? <FaStar /> : <FaRegStar />}
            </span>
          );
        })}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Customer Reviews</h3>
          <div className="flex items-center space-x-2">
            {renderStars(currentRating, false, 'text-lg')}
            <span className="text-gray-300">({currentRating.toFixed(1)})</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-2xl font-bold text-yellow-400">{reviews.length}</div>
            <div className="text-sm text-gray-400">Total Reviews</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-400">
              {reviews.filter(r => r.stars >= 4).length}
            </div>
            <div className="text-sm text-gray-400">5-4 Stars</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-2xl font-bold text-yellow-400">
              {reviews.filter(r => r.stars >= 3 && r.stars < 4).length}
            </div>
            <div className="text-sm text-gray-400">3 Stars</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-2xl font-bold text-red-400">
              {reviews.filter(r => r.stars < 3).length}
            </div>
            <div className="text-sm text-gray-400">1-2 Stars</div>
          </div>
        </div>
      </div>

      {/* Rate This Product */}
      {user && (
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-2xl">
          <h4 className="text-lg font-semibold text-white mb-4">Rate This Product</h4>
          
          {!showReviewForm ? (
            <div className="text-center">
              <p className="text-gray-400 mb-3">Click on the stars to rate this product</p>
              {renderStars(userRating, true, 'text-3xl')}
              {userRating > 0 && (
                <p className="text-yellow-400 mt-2">You rated this product {userRating} star{userRating > 1 ? 's' : ''}</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-400 mb-3">Your Rating</p>
                {renderStars(userRating, true, 'text-3xl')}
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Your Review (Optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  rows="3"
                  maxLength="500"
                />
                <p className="text-sm text-gray-400 mt-1">{comment.length}/500 characters</p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleSubmitRating}
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-3 px-4 rounded-lg font-semibold hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Rating'}
                </button>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-400">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-green-400">
          {success}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Customer Reviews</h4>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                      <FaUser className="text-black text-sm" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {review.user?.username || review.user?.email?.split('@')[0] || 'Anonymous'}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <FaCalendarAlt />
                        <span>{formatDate(review.createdAt || new Date())}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(review.stars, false, 'text-sm')}
                  </div>
                </div>
                
                {review.comment && (
                  <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductRating; 