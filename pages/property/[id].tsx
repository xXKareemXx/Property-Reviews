import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image'
import { Star, MapPin, Wifi, Car, Coffee, Tv, Users, Award, ArrowLeft, Shield, CheckCircle, House, StarHalf, Bath, BedDouble } from 'lucide-react';
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

const PropertyPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [approvedReviews, setApprovedReviews] = useState<Review[]>([]);
  const [featuredReviews, setFeaturedReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Mock property data - in production this would come from an API
  const property = {
    id: id,
    name: "2B N1 A - 29 Shoreditch Heights",
    type: "Entire Apartment",
    location: "Shoreditch, London",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    price: 120,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
    ],
    amenities: [
      { icon: Wifi, name: "Free WiFi" },
      { icon: Car, name: "Free Parking" },
      { icon: Coffee, name: "Kitchen" },
      { icon: Tv, name: "Smart TV" }
    ],
    description: "Modern and stylish 2-bedroom apartment in the heart of Shoreditch. Perfect for exploring London's vibrant East End with easy access to transport links. The space features contemporary furnishings, a fully equipped kitchen, and comfortable living areas.",
    highlights: [
      "Prime Shoreditch location",
      "Modern amenities",
      "Professional cleaning",
      "24/7 support"
    ]
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews/hostaway');
        const data = await response.json();
        const allReviews = data.data;
        
        // Filter for approved reviews only and specific property if needed
        const propertyReviews = allReviews.filter((review: Review) => 
          review.listingName === property.name
        );
        
        setReviews(propertyReviews);
        setApprovedReviews(propertyReviews.filter((review: Review) => review.approved));
        setFeaturedReviews(propertyReviews.filter((review: Review) => review.featured && review.approved));
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();

    // Set up polling to check for updates every 1 seconds
    const interval = setInterval(fetchReviews, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [property.name]);

  const getAverageRating = (reviewsData: Review[]) => {
    if (reviewsData.length === 0) return 0;
    const sum = reviewsData.reduce((acc, review) => acc + review.overallRating, 0);
    return (sum / reviewsData.length);
  };

  const getCategoryAverages = (reviewsData: Review[]) => {
    if (reviewsData.length === 0) return {};
    
    const categories: { [key: string]: number[] } = {};
    reviewsData.forEach(review => {
      Object.entries(review.categories).forEach(([category, rating]) => {
        if (!categories[category]) categories[category] = [];
        categories[category].push(rating);
      });
    });

    const averages: { [key: string]: number } = {};
    Object.entries(categories).forEach(([category, ratings]) => {
      averages[category] = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    });

    return averages;
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Property not found</h2>
          <p className="text-gray-600 mt-2">The requested property could not be found.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  const avgRating = getAverageRating(approvedReviews);
  const categoryAverages = getCategoryAverages(approvedReviews);

  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      {/* Header */}
      {/* <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div> */}
      <nav className="bg-[#284E4C] backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <House className="h-9 w-9 text-white" />
              <div className="ml-2">
                <h1 
                  className="text-2xl text-white"
                  style={{ fontFamily: "Times New Roman, serif" }}
                  >
                    the flex.
                </h1>
              </div>
            </div>
          </div>
        </div>
      </nav>  

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Images */}
        <div className="bg-white grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 rounded-xl overflow-hidden shadow-lg">
          <div className="md:col-span-2">
            <img 
              src={property.images[selectedImageIndex]} 
              alt={property.name}
              className="w-full h-80 md:h-96 object-cover hover:scale-104 transition-transform duration-300"
              // onClick={() => setSelectedImageIndex((selectedImageIndex + 1) % property.images.length)}
            />
          </div>
          <div className="grid grid-rows-2 gap-4">
            {property.images.slice(1, 3).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${property.name} ${index + 2}`}
                className="w-full h-36 md:h-46 object-cover rounded-lg hover:scale-109 transition-transform duration-300"
                // onClick={() => setSelectedImageIndex(index + 1)}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Info */}
            {/* <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">{property.name}</h1>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="text-lg">{property.location}</span>
                  </div>
                  <div className="flex items-center space-x-6 text-gray-600">
                    <span className="flex items-center">
                      <Users className="h-5 w-5 mr-1" />
                      {property.guests} guests
                    </span>
                    <span>{property.bedrooms} bedrooms</span>
                    <span>{property.bathrooms} bathrooms</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">£{property.price}</p>
                  <p className="text-gray-600">per night</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <p className="text-gray-700 text-lg leading-relaxed">{property.description}</p>
              </div> */}
            <div className="bg-white rounded-4xl shadow-sm p-8 border border-gray-100">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">{property.name}</h1>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="text-lg">{property.location}</span>
                    </div>
                    <div className="flex items-center space-x-8 text-gray-600 bg-gray-50 px-6 py-4 rounded-xl">
                      <span className="flex items-center font-medium">
                        <Users className="h-5 w-5 mr-2 text-gray-500" />
                        {property.guests} guests
                      </span>
                      <span className="flex items-center font-medium">
                        <BedDouble className="h-5 w-5 mr-2 text-gray-500" />
                        {property.bedrooms} bedrooms</span>
                      <span className="flex items-center font-medium">
                        <Bath className="h-5 w-5 mr-2 text-gray-500" />
                        {property.bathrooms} bathrooms</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">£{property.price}</p>
                    <p className="text-gray-600 font-medium">per night</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 mb-6">
                  <p className="text-gray-700 text-lg leading-relaxed font-light">{property.description}</p>
                </div>                

              {/* Highlights */}
              {/* <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Property Highlights</h3>
                <div className="grid grid-cols-2 gap-3">
                  {property.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div> */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-900">What makes this special</h3>
                <div className="grid grid-cols-2 gap-4">
                  {property.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center bg-green-50 p-4 rounded-xl border border-green-100">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-gray-800 font-medium">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>              

              {/* Amenities */}
              {/* <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <amenity.icon className="h-6 w-6 text-blue-600 mr-3" />
                      <span className="text-gray-700 font-medium">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div> */}
              <div className="border-t border-gray-100 pt-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-900">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                      <amenity.icon className="h-6 w-6 text-gray-700 mr-3" />
                      <span className="text-gray-800 font-medium">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>


            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              {/* <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Guest Reviews</h2>
                {approvedReviews.length > 0 && (
                  <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
                    <StarRating rating={Math.round(avgRating)} size="lg" showNumber={false} />
                    <span className="ml-3 text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</span>
                    <span className="ml-2 text-gray-600">({approvedReviews.length} reviews)</span>
                  </div>
                )}
              </div> */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Guest Reviews</h2>
                {approvedReviews.length > 0 && (
                  <div className="flex items-center bg-yellow-50 px-6 py-3 rounded-xl border border-yellow-100">
                    <StarRating rating={Math.round(avgRating)} size="lg" />
                    <div className="ml-4">
                      <span className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</span>
                      <p className="text-sm text-gray-600">({approvedReviews.length} reviews)</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Category Ratings */}
              {Object.keys(categoryAverages).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">Rating Breakdown</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(categoryAverages).map(([category, average]) => (
                      <div key={category} className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-600 capitalize mb-1">
                          {category.replace('_', ' ')}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">{average.toFixed(1)}</p>
                        <div className="mt-2">
                          <StarRating rating={Math.round(average)} size="sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Featured Reviews */}
              {featuredReviews.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-700">
                    <Award className="h-6 w-6 text-yellow-600 mr-2" />
                    Featured Reviews
                  </h3>
                  <div className="space-y-6">
                    {featuredReviews.map((review) => (
                      <div key={review.id} className="border-l-4 border-yellow-400 pl-6 py-4 bg-gradient-to-r from-yellow-50 to-white rounded-r-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {review.guestName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-lg">{review.guestName}</p>
                              <p className="text-sm text-gray-500">
                                {format(new Date(review.submittedAt), 'MMM dd, yyyy')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <StarRating rating={review.overallRating} size="md" />
                            <span className="ml-1 text-sm text-gray-600">{review.overallRating}</span>
                        </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-lg">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Approved Reviews */}
              <div>
                <h3 className="text-xl font-semibold mb-6 text-gray-700">Reviews</h3>
                {approvedReviews.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                    <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-xl">No approved reviews yet.</p>
                    <p className="text-sm">Reviews will appear here once approved by management.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {approvedReviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                              {review.guestName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-lg">{review.guestName}</p>
                              <div className="flex items-center space-x-2">
                                <p className="text-sm text-gray-500">
                                  {format(new Date(review.submittedAt), 'MMM dd, yyyy')}
                                </p>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                  {review.channel}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <StarRating rating={review.overallRating} size="md" />
                            <span className="ml-1 text-sm text-gray-600">{review.overallRating}</span>
                        </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-lg">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 border border-gray-100">
              <div className="text-center border-2 border-dashed border-gray-300 rounded-lg p-8">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Book This Property</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Integration with booking system would appear here
                </p>
                <button className="w-full bg-[#284E4C] hover:bg-[#688382] text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                  Check Availability
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Review Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-black">
                  <span className="text-gray-600">Total Reviews:</span>
                  <span className="font-semibold text-xl text-[#284E4C]">{reviews.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Approved:</span>
                  <span className="font-semibold text-xl text-green-600">{approvedReviews.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Featured:</span>
                  <span className="font-semibold text-xl text-yellow-600">{featuredReviews.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Rating:</span>
                  <span className="font-semibold text-xl text-gray-400">{avgRating.toFixed(1)}/10</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Approval Rate:</span>
                    <span className="font-semibold text-xl text-[#284E4C]">
                      {reviews.length > 0 ? Math.round((approvedReviews.length / reviews.length) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust & Safety */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                Trust & Safety
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  Verified property listing
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  Professional cleaning
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  24/7 guest support
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  Secure booking process
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#284E4C] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <h3 className="ml-3 text-xl font-bold">The Flex Reviews Dashboard</h3>
            </div>
            <p className="text-white text-sm">
              © 2025 The Flex. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PropertyPage;