import { NextApiRequest, NextApiResponse } from 'next';

// Types for the API response
interface HostawayReview {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: Array<{
    category: string;
    rating: number;
  }>,
  submittedAt: string;
  guestName: string;
  listingName: string;
  channel?: string;
}

interface NormalizedReview {
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

// In-memory storage for review states (in production, use a database)
const reviewStates: Record<number, { approved: boolean; featured: boolean }> = {};

// Mock data - in production this would come from Hostaway API
const mockReviews: HostawayReview[] = [
  {
    id: 7453,
    type: "host-to-guest",
    status: "published",
    rating: null,
    publicReview: "Shane and family are wonderful! Would definitely host again :)",
    reviewCategory: [
      { category: "cleanliness", rating: 10 },
      { category: "communication", rating: 10 },
      { category: "location", rating: 10 },
      { category: "respect_house_rules", rating: 10 }
    ],
    submittedAt: "2020-08-21 22:45:14",
    guestName: "Shane Finkelstein",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "airbnb"
  },
  {
    id: 7454,
    type: "guest-to-host",
    status: "published",
    rating: null,
    publicReview: "Amazing location and beautiful apartment. Host was very responsive and helpful throughout our stay. Would definitely recommend!",
    reviewCategory: [
      { category: "cleanliness", rating: 9 },
      { category: "communication", rating: 10 },
      { category: "location", rating: 10 },
      { category: "respect_house_rules", rating: 10 }
    ],
    submittedAt: "2024-01-15 14:30:22",
    guestName: "Emma Thompson",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "booking.com"
  },
  {
    id: 7455,
    type: "guest-to-host",
    status: "published",
    rating: null,
    publicReview: "Great stay overall. The apartment was clean and well-located. Minor issues with the wifi but otherwise perfect.",
    reviewCategory: [
      { category: "cleanliness", rating: 9 },
      { category: "communication", rating: 8 },
      { category: "location", rating: 9 },
      { category: "respect_house_rules", rating: 10 }
    ],
    submittedAt: "2024-01-10 09:15:33",
    guestName: "Michael Chen",
    listingName: "1B S2 B - 15 Camden Lock Studio",
    channel: "airbnb"
  },
  {
    id: 7456,
    type: "guest-to-host",
    status: "published",
    rating: null,
    publicReview: "The location was good but the apartment had some cleanliness issues. The host was responsive when we reported problems.",
    reviewCategory: [
      { category: "cleanliness", rating: 5 },
      { category: "communication", rating: 8 },
      { category: "location", rating: 4 },
      { category: "respect_house_rules", rating: 10 }
    ],
    submittedAt: "2024-01-05 16:45:11",
    guestName: "Sarah Johnson",
    listingName: "1B S2 B - 15 Camden Lock Studio",
    channel: "airbnb"
  },
  {
    id: 7457,
    type: "guest-to-host",
    status: "published",
    rating: null,
    publicReview: "Absolutely perfect stay! Everything was exactly as described. Host went above and beyond to make our trip memorable. Highly recommend!",
    reviewCategory: [
      { category: "cleanliness", rating: 10 },
      { category: "communication", rating: 10 },
      { category: "location", rating: 10 },
      { category: "respect_house_rules", rating: 10 }
    ],
    submittedAt: "2024-01-20 11:20:45",
    guestName: "David Rodriguez",
    listingName: "3B W1 C - 42 Covent Garden Luxury",
    channel: "vrbo"
  },
  {
    id: 7458,
    type: "guest-to-host",
    status: "published",
    rating: null,
    publicReview: "Unfortunately, our stay was disappointing. The apartment was not clean upon arrival and several amenities listed were missing. Communication with the host was slow.",
    reviewCategory: [
      { category: "cleanliness", rating: 1 },
      { category: "communication", rating: 2 },
      { category: "location", rating: 4 },
      { category: "respect_house_rules", rating: 7 }
    ],
    submittedAt: "2024-02-10 15:45:12",
    guestName: "Emily Carter",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "vrbo"
  },
  {
    id: 7459,
    type: "guest-to-host",
    status: "published",
    rating: null,
    publicReview: "The location was decent, but the noise from the street made it impossible to sleep. Heating didn’t work properly, and the host never resolved the issue despite multiple messages.",
    reviewCategory: [
      { category: "cleanliness", rating: 5 },
      { category: "communication", rating: 2 },
      { category: "location", rating: 7 },
      { category: "respect_house_rules", rating: 5 }
    ],
    submittedAt: "2024-03-05 09:12:33",
    guestName: "Michael Thompson",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "booking.com"
  }
];

// Function to normalize Hostaway reviews
function normalizeReviews(hostawayReviews: HostawayReview[]): NormalizedReview[] {
  return hostawayReviews.map(review => {
    // Calculate overall rating from categories if not provided
    const overallRating = review.rating || 
      Math.round(review.reviewCategory.reduce((sum, cat) => sum + cat.rating, 0) / review.reviewCategory.length);

    // Convert category array to object
    const categories: Record<string, number> = {};
    review.reviewCategory.forEach(cat => {
      categories[cat.category] = cat.rating;
    });

    // Get stored state or use defaults
    const storedState = reviewStates[review.id] || { approved: false, featured: false };

    return {
      id: review.id,
      type: review.type as 'host-to-guest' | 'guest-to-host',
      status: review.status,
      overallRating: overallRating || 0,
      comment: review.publicReview,
      categories,
      submittedAt: review.submittedAt,
      guestName: review.guestName,
      listingName: review.listingName,
      channel: review.channel || 'hostaway',
      approved: storedState.approved,
      featured: storedState.featured
    };
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle GET requests (existing functionality)
  if (req.method === 'GET') {
    try {
      // In production, you would call the actual Hostaway API:
      // const response = await fetch('https://api.hostaway.com/v1/reviews', {
      //   headers: {
      //     'Authorization': `Bearer ${process.env.HOSTAWAY_API_KEY}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // const data = await response.json();

      // For now, we use mock data
      const normalizedReviews = normalizeReviews(mockReviews);

      res.status(200).json({
        status: 'success',
        count: normalizedReviews.length,
        data: normalizedReviews
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch reviews'
      });
    }
  }
  // Handle PATCH requests (new functionality for updating review states)
  else if (req.method === 'PATCH') {
    try {
      const { id, approved, featured } = req.body;

      // Validate the request
      if (!id || typeof id !== 'number') {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid review ID'
        });
      }

      // Check if the review exists
      const reviewExists = mockReviews.find(review => review.id === id);
      if (!reviewExists) {
        return res.status(404).json({
          status: 'error',
          message: 'Review not found'
        });
      }

      // Get current state or create new one
      const currentState = reviewStates[id] || { approved: false, featured: false };

      // Update the state with provided values
      const updatedState = {
        approved: approved !== undefined ? approved : currentState.approved,
        featured: featured !== undefined ? featured : currentState.featured
      };

      // Store the updated state
      reviewStates[id] = updatedState;

      // In production, you would also update this in your database
      // await updateReviewInDatabase(id, updatedState);

      res.status(200).json({
        status: 'success',
        message: 'Review updated successfully',
        data: {
          id,
          approved: updatedState.approved,
          featured: updatedState.featured
        }
      });
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update review'
      });
    }
  }
  // Handle unsupported methods
  else {
    res.setHeader('Allow', ['GET', 'PATCH']);
    return res.status(405).json({ 
      status: 'error',
      message: 'Method not allowed' 
    });
  }
}