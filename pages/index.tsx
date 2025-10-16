import React from 'react';
import { BarChart3, Eye, Star, MessageSquare, TrendingUp, Award, ArrowRight, CheckCircle , ArrowBigUpDash, House, SlidersHorizontal} from 'lucide-react';

const HomePage = () => {
  const handleDashboardClick = () => {
    window.open('/dashboard');
  };

  const handlePropertyClick = () => {
    window.open('/property/1');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      {/* Header */}
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
            {/* <button 
              onClick={handleDashboardClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Open Dashboard
            </button> */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="mb-8">
            {/* <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-6">
              <CheckCircle className="h-4 w-4 mr-2" />
              Hostaway API Integration Complete
            </div> */}
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Manage Your Property Reviews
              {/* <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Like a Pro</span> */}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Comprehensive dashboard to monitor, analyze, and showcase guest reviews across all your properties. 
              Make data-driven decisions to improve guest satisfaction and boost bookings.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={handleDashboardClick}
              className="bg-gradient-to-r from-[#284E4C] to-[#203E3D] hover:from-[#537170] hover:to-[#537170] cursor-pointer text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              View Dashboard
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
            <button
              onClick={handlePropertyClick}
              className="border-2 border-[#284E4C] text-[#284E4C] cursor-pointer hover:bg-[#244644] hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 inline-flex items-center justify-center shadow-md hover:shadow-lg"
            >
              <Eye className="h-5 w-5 mr-2" />
              View Sample Property
            </button>
          </div>

          {/* Quick Preview */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">150+</p>
                <p className="text-sm text-gray-600">Total Reviews</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">92%</p>
                <p className="text-sm text-gray-600">Approval Rate</p>
              </div>
              
              <div className="text-center">
                <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">25</p>
                <p className="text-sm text-gray-600">Featured Reviews</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Review Management */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-gradient-to-br from-blue-300 to-blue-600 p-4 rounded-xl w-fit mb-6 shadow-lg">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Review Management</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Efficiently manage all guest reviews in one place. Approve, feature, and organize reviews for optimal presentation.
            </p>
            <ul className="text-sm text-gray-600 space-y-3">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                Bulk approval and moderation
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                Feature best reviews
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                Multi-channel integration
              </li>
            </ul>
          </div>

          {/* Analytics & Insights */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-gradient-to-br from-yellow-300 to-yellow-600 p-4 rounded-xl w-fit mb-6 shadow-lg">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Analytics & Insights</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Get detailed insights into your property performance with comprehensive analytics and trending data.
            </p>
            <ul className="text-sm text-gray-600 space-y-3">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></div>
                Rating trends and patterns
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></div>
                Category performance metrics
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></div>
                Actionable improvement insights
              </li>
            </ul>
          </div>

          {/* Smart Filtering */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 md:col-span-2 lg:col-span-1">
            <div className="bg-gradient-to-br from-green-300 to-green-600 p-4 rounded-xl w-fit mb-6 shadow-lg">
              <SlidersHorizontal className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Filtering</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Advanced filtering and search capabilities to quickly find and manage specific reviews or identify issues.
            </p>
            <ul className="text-sm text-gray-600 space-y-3">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                Filter by rating, date, property
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                Search across all content
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                Sort and organize efficiently
              </li>
            </ul>
          </div>
        </div>

        {/* API Integration Info */}
        <div className="bg-[#284E4C] rounded-2xl shadow-2xl p-8 text-white mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Hostaway API Integration</h3>
            <p className="text-white max-w-3xl mx-auto mb-8 text-lg leading-relaxed">
              Seamlessly integrated with Hostaway&apos;s review system. The dashboard automatically syncs and normalizes 
              review data from multiple channels for comprehensive property management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="bg-white/20 p-3 rounded-lg w-fit mb-4">
                <ArrowBigUpDash className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-3 text-lg">Real-time Sync</h4>
              <p className="text-blue-100">Automatic data fetching and normalization from multiple booking platforms</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="bg-white/20 p-3 rounded-lg w-fit mb-4">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-3 text-lg">Multi-channel Support</h4>
              <p className="text-blue-100">Airbnb, Booking.com, VRBO and more platforms in one dashboard</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="bg-white/20 p-3 rounded-lg w-fit mb-4">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-3 text-lg">Secure & Reliable</h4>
              <p className="text-blue-100">Enterprise-grade API security with 99.9% uptime guarantee</p>
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

export default HomePage;