import React, { useState, useEffect } from 'react';
import { Star, StarHalf, Search, Eye, EyeOff, Award, TrendingUp, Calendar, MessageSquare, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

interface Review {
  id: number;
  type: 'host-to-guest' | 'guest-to-host';
  status: string;
  overallRating: number;
  comment: string;
  categories: {
    cleanliness?: number;
    communication?: number;
    respect_house_rules?: number;
    accuracy?: number;
    location?: number;
    checkin?: number;
    value?: number;
  };
  submittedAt: string;
  guestName: string;
  listingName: string;
  channel: string;
  approved: boolean;
  featured: boolean;
}

const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const starRating = rating / 2;

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        if (star <= Math.floor(starRating)) {
          // full star
          return <Star key={star} className={`${sizeClasses[size]} text-yellow-400 fill-current`} />;
        } else if (star - 0.5 <= starRating) {
          // half star
          return <StarHalf key={star} className={`${sizeClasses[size]} text-yellow-400 fill-current`} />;
        } else {
          // empty star
          return <Star key={star} className={`${sizeClasses[size]} text-gray-300`} />;
        }
      })}
    </div>
  );
};

const Dashboard = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    const filterReviews = () => {
      let filtered = [...reviews];

      // Text search
      if (searchTerm) {
        filtered = filtered.filter(review =>
          review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.listingName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filters
      filtered = filtered.filter(review =>
        (selectedProperty === 'all' || review.listingName === selectedProperty) &&
        (selectedRating === 'all' || review.overallRating >= parseInt(selectedRating)) &&
        (selectedChannel === 'all' || review.channel === selectedChannel)
      );

      // Sort
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return b.overallRating - a.overallRating;
          case 'date':
          default:
            return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        }
      });

      setFilteredReviews(filtered);
    };

    filterReviews();
  }, [reviews, searchTerm, selectedProperty, selectedRating, selectedChannel, sortBy]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews/hostaway');
      const data = await response.json();
      setReviews(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  };

  // const toggleApproval = (reviewId: number) => {
  //   setReviews(reviews.map(review =>
  //     review.id === reviewId ? { ...review, approved: !review.approved } : review
  //   ));
  // };

  // const toggleFeatured = (reviewId: number) => {
  //   setReviews(reviews.map(review =>
  //     review.id === reviewId ? { ...review, featured: !review.featured } : review
  //   ));
  // };

  const toggleApproval = async (reviewId: number) => {
  try {
    // Update local state immediately for better UX
    setReviews(reviews.map(review =>
      review.id === reviewId ? { ...review, approved: !review.approved } : review
    ));

    // Make API call to persist the change
    const reviewToUpdate = reviews.find(r => r.id === reviewId);
    const response = await fetch('/api/reviews/hostaway', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: reviewId,
        approved: !reviewToUpdate?.approved
      }),
    });

    if (!response.ok) {
      // Revert local state if API call failed
      setReviews(reviews.map(review =>
        review.id === reviewId ? { ...review, approved: reviewToUpdate?.approved ?? false } : review
      ));
      console.error('Failed to update review approval status');
    }
  } catch (error) {
    console.error('Error updating review:', error);
    // Revert local state on error
    const reviewToUpdate = reviews.find(r => r.id === reviewId);
    setReviews(reviews.map(review =>
      review.id === reviewId ? { ...review, approved: reviewToUpdate?.approved ?? false } : review
    ));
  }
};

  const toggleFeatured = async (reviewId: number) => {
    try {
      // Update local state immediately for better UX
      setReviews(reviews.map(review =>
        review.id === reviewId ? { ...review, featured: !review.featured } : review
      ));

      // Make API call to persist the change
      const reviewToUpdate = reviews.find(r => r.id === reviewId);
      const response = await fetch('/api/reviews/hostaway', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: reviewId,
          featured: !reviewToUpdate?.featured
        }),
      });

      if (!response.ok) {
        // Revert local state if API call failed
        setReviews(reviews.map(review =>
          review.id === reviewId ? { ...review, approved: reviewToUpdate?.approved ?? false } : review
        ));
        console.error('Failed to update review featured status');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      // Revert local state on error
      const reviewToUpdate = reviews.find(r => r.id === reviewId);
      setReviews(reviews.map(review =>
        review.id === reviewId ? { ...review, approved: reviewToUpdate?.approved ?? false } : review
      ));
    }
  };

  const getUniqueProperties = () => {
    return [...new Set(reviews.map(review => review.listingName))];
  };

  const getStats = () => {
    const total = reviews.length;
    const approved = reviews.filter(r => r.approved).length;
    const featured = reviews.filter(r => r.featured).length;
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length 
      : 0;

    return { total, approved, featured, avgRating };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      {/* Header */}
      <div className="bg-[#284E4C] shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  {/* <div className="bg-gray-800 p-3 rounded-lg"> */}
                    <BarChart3 className="h-9 w-9 text-white" />
                  {/* </div> */}
                  <div className="ml-3" style={{ fontFamily: "Times New Roman, serif" }}>
                    <h1 className="text-2xl font-light text-white">Reviews Dashboard</h1>
                    <p className="text-sm text-white">Manage and monitor guest reviews across all properties</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                <p className="text-xs text-green-600">+{Math.round((stats.approved/stats.total)*100)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Featured</p>
                <p className="text-2xl font-bold text-gray-900">{stats.featured}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</p>
                <StarRating rating={Math.round(stats.avgRating)} size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">

              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reviews, guests, properties..."
                    className="text-gray-600 pl-10 w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Property Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property</label>
                <select
                  className="text-gray-400 w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                >
                  <option value="all">All Properties</option>
                  {getUniqueProperties().map(property => (
                    <option key={property} value={property}>{property}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <select
                  className="text-gray-400 w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                >
                  <option value="all">All Ratings</option>
                  <option value="10">5 Stars</option>
                  <option value="8">4+ Stars</option>
                  <option value="6">3+ Stars</option>
                  <option value="4">2+ Stars</option>
                  <option value="2">1+ Stars</option>
                </select>
              </div>

              {/* Channel Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Channel</label>
                <select
                  className="text-gray-400 w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                >
                  <option value="all">All Channels</option>
                  <option value="airbnb">airbnb</option>
                  <option value="booking.com">booking.com</option>
                  <option value="vrbo">vrbo</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  className="text-gray-400 w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Date (Newest)</option>
                  <option value="rating">Rating (Highest)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-semibold">
                          {review.guestName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{review.guestName}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                              {review.channel}
                            </span>
                            {review.featured && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium flex items-center">
                                <Award className="h-3 w-3 mr-1" />
                                Featured
                              </span>
                            )}
                            {review.approved && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                Approved
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <StarRating rating={review.overallRating} size="md" />
                          <span className="ml-1 text-sm text-gray-600">{review.overallRating}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(review.submittedAt), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 font-medium">{review.listingName}</p>
                    <p className="text-gray-800 mb-4 leading-relaxed">{review.comment}</p>
                    
                    {/* Category Ratings */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                      {Object.entries(review.categories).map(([category, rating]) => (
                        <div key={category} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg">
                          <span className="text-sm text-gray-600 capitalize">
                            {category.replace('_', ' ')}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">{rating}/10</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-6">
                    <button
                      onClick={() => toggleApproval(review.id)}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        review.approved
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-sm'
                      }`}
                    >
                      {review.approved ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                      {review.approved ? 'Approved' : 'Approve'}
                    </button>

                    <button
                      onClick={() => toggleFeatured(review.id)}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        review.featured
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-sm'
                      }`}
                    >
                      <Award className="h-4 w-4 mr-2" />
                      {review.featured ? 'Featured' : 'Feature'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredReviews.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more reviews.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;