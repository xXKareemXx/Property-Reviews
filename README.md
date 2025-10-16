# Property Reviews - Setup Instructions

## Overview
This is a comprehensive Reviews Dashboard built using Next.js, TypeScript, and Tailwind CSS. The application provides property managers with tools to view, manage, and showcase guest reviews across multiple platforms.
Walkthrough: https://drive.google.com/file/d/1cyogCnhDroJrVUUezxiGpN9gYKjzyMcw/view?usp=drive_link

## Tech Stack
- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **API Integration**: Next.js API Routes
- **Deployment**: Vercel (recommended)

## Project Structure
```
Property-Reviews/
├── pages/
│   ├── api/
│   │   └── reviews/
│   │       └── hostaway.ts      # Main Hostaway API integration
│   ├── property/
│   │   └── [id].tsx            # Dynamic property display page
│   ├── dashboard.tsx           # Manager dashboard
│   └── index.tsx               # Landing page
├── package.json
└── tsconfig.json
```

## Installation & Setup

### 1. Create the Project
```bash
# Go to the downloaded folder
cd Property-Reviews
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Development Server
```bash
npm run dev
```
Open [http://localhost:3000] to view the application.

## API Integration

### Hostaway API Integration (`/api/reviews/hostaway`)
- **Purpose**: Fetches and normalizes review data from Hostaway.
- **Data Normalization**: Converts Hostaway review format to standardized structure
- **Response Format**: Returns normalized reviews with approval and featured status

**Key Features:**
- Real-time data fetching
- Category rating aggregation
- Status normalization across channels
- Automatic rating calculation from categories

## Dashboard Features

### Manager Dashboard (`/dashboard`)
- **Review Management**: Approve/disapprove reviews
- **Filtering & Search**: Advanced filtering by property, rating, channel, date
- **Bulk Actions**: Feature reviews for public display
- **Analytics**: Performance metrics and statistics
- **Real-time Updates**: Dynamic filtering and sorting

### Property Display Page (`/property/[id]`)
- **Public View**: Customer-facing property page
- **Review Showcase**: Displays only approved reviews
- **Featured Reviews**: Highlights manager-selected reviews
- **Rating Breakdown**: Category-wise performance metrics
- **Responsive Design**: Mobile-optimized layout

### Landing Page (`/`)
- **Overview**: Project introduction and navigation
- **Feature Highlights**: Key dashboard capabilities
- **Access**: Quick links to dashboard and sample property

## Key Design Decisions

### 1. Data Normalization Strategy
- **Unified Schema**: All review sources normalized to common structure
- **Flexible Categories**: Supports varying rating categories across platforms
- **Status Management**: Consistent approval and featured status tracking
- **Metadata Preservation**: Channel-specific data maintained alongside normalized fields

### 2. UI/UX Approach
- **Clean Interface**: Minimal, professional design suitable for property management
- **Responsive Layout**: Mobile-first approach with desktop optimization
- **Intuitive Navigation**: Clear hierarchy and logical flow
- **Performance Focus**: Optimized components and efficient data loading

### 3. State Management
- **React Hooks**: useState and useEffect for component state
- **Local Storage**: Not used (as per artifact restrictions)
- **API-Driven**: Real-time data fetching with proper error handling
- **Optimistic Updates**: Immediate UI feedback for user actions

### 4. Error Handling
- **API Failures**: Graceful degradation with user-friendly messages
- **Loading States**: Comprehensive loading indicators
- **Empty States**: Helpful messaging when no data available
- **Validation**: Input validation and sanitization

## API Behavior & Testing

### Testing the Hostaway API
```bash
# Test the reviews endpoint
curl http://localhost:3000/api/reviews/hostaway

# Expected response structure
{
  "status": "success",
  "count": 5,
  "data": [
    {
      "id": 7453,
      "type": "host-to-guest",
      "overallRating": 10,
      "comment": "Shane and family are wonderful!...",
      "categories": { "cleanliness": 10, ... },
      "approved": true,
      "featured": false
    }
  ]
}
```

## Production Considerations

### 1. Real API Integration
- Replace mock data with actual Hostaway API calls
- Implement proper authentication and error handling
- Add rate limiting and caching strategies
- Monitor API usage and costs

### 2. Database Integration
- Add persistent storage for approval/featured status
- Implement review caching to reduce API calls
- Store user preferences and dashboard settings
- Add audit trails for management actions

### 3. Security Enhancements
- Implement authentication for manager dashboard
- Add role-based access control
- Secure API endpoints with proper validation
- Implement CSRF protection

### 4. Performance Optimization
- Add Redis caching for API responses
- Implement pagination for large review sets
- Optimize images and assets
- Add CDN for static content delivery

### 5. Monitoring & Analytics
- Add application performance monitoring
- Implement error tracking (Sentry, etc.)
- Add business analytics for review trends
- Monitor API health and response times
