import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { checkAuth } from '@/lib/services/middleware';
import dbConnect from '@/lib/db/db';
import { getReview } from '@/lib/db/review';
import { getUserWithPayment } from '@/lib/db/user';

export const dynamic = 'force-dynamic';

// Platform dimensions mapping (subtask 2.3)
const PLATFORM_DIMENSIONS = {
  facebook: { width: 1200, height: 630 },
  instagram: { width: 1080, height: 1080 },
  x: { width: 1200, height: 675 }
} as const;

type Platform = keyof typeof PLATFORM_DIMENSIONS;

export const maxDuration = 30;

export async function GET(req: NextRequest) {
  try {
    // Subtask 2.2: Authentication
    const decodedClaims = await checkAuth();
    if (!decodedClaims) {
      return new Response('Unauthorized', { status: 401 });
    }

    await dbConnect();

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const reviewId = searchParams.get('reviewId');
    const platform = searchParams.get('platform') as Platform;

    // Validate required parameters
    if (!reviewId) {
      return new Response('Missing reviewId parameter', { status: 400 });
    }

    // Subtask 2.3: Validate platform parameter
    if (!platform || !PLATFORM_DIMENSIONS[platform]) {
      return new Response('Invalid platform. Must be one of: facebook, instagram, x', { status: 400 });
    }

    // Get user data
    const user = await getUserWithPayment('uid', decodedClaims.uid);
    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    // Subtask 2.2: Fetch review and verify ownership
    const review = await getReview(reviewId, user._id);
    if (!review) {
      return new Response('Review not found', { status: 404 });
    }

    // Verify review belongs to authenticated user
    if (review.page.toString() !== user._id.toString()) {
      return new Response('Forbidden: You do not have access to this review', { status: 403 });
    }

    // Get platform dimensions
    const { width, height } = PLATFORM_DIMENSIONS[platform];

    // Determine theme color
    const themeColor = user.themeColor || '#6366f1';
    
    // Calculate responsive padding and font sizes based on platform
    const isSquare = platform === 'instagram';
    const outerPadding = isSquare ? '70px' : '60px';
    const innerPadding = isSquare ? '56px' : '48px';
    const businessNameSize = isSquare ? '48px' : '42px';
    const commentSize = isSquare ? '30px' : '26px';
    const starSize = isSquare ? '40px' : '36px';
    
    // Determine max comment length based on platform
    const maxCommentLength = isSquare ? 320 : platform === 'facebook' ? 240 : 260;
    const truncatedComment = review.comment.length > maxCommentLength 
      ? review.comment.substring(0, maxCommentLength) + '...' 
      : review.comment;

    // Subtask 2.4 & 2.5: Create JSX template and generate image
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: themeColor,
            padding: outerPadding,
            fontFamily: 'Inter',
          }}
        >
          {/* Main content container with enhanced shadows and borders */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'white',
              borderRadius: '28px',
              padding: innerPadding,
              width: '100%',
              height: '100%',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.35), 0 10px 25px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            {/* Business name with improved spacing */}
            <div
              style={{
                fontSize: businessNameSize,
                fontWeight: 700,
                color: themeColor,
                marginBottom: '36px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                letterSpacing: '-0.02em',
              }}
            >
              {user.imageUrl && (
                <img
                  src={user.imageUrl}
                  alt="Business"
                  style={{
                    width: isSquare ? '72px' : '64px',
                    height: isSquare ? '72px' : '64px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `3px solid ${themeColor}`,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }}
                />
              )}
              {user.businessName}
            </div>

            {/* Star rating with better spacing */}
            {review.rating && (
              <div
                style={{
                  display: 'flex',
                  marginBottom: '28px',
                  gap: '8px',
                }}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width={starSize}
                    height={starSize}
                    viewBox="0 0 24 24"
                    fill={i < review.rating! ? '#fbbf24' : '#e5e7eb'}
                    style={{
                      filter: i < review.rating! ? 'drop-shadow(0 2px 4px rgba(251, 191, 36, 0.3))' : 'none',
                    }}
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            )}

            {/* Review comment with improved typography */}
            <div
              style={{
                fontSize: commentSize,
                lineHeight: 1.65,
                color: '#1f2937',
                marginBottom: '36px',
                display: 'flex',
                flexGrow: 1,
                overflow: 'hidden',
                fontWeight: 400,
                letterSpacing: '-0.01em',
              }}
            >
              &ldquo;{truncatedComment}&rdquo;
            </div>

            {/* Reviewer info with subtle separator and improved spacing */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderTop: '2px solid #f3f4f6',
                paddingTop: '28px',
                gap: '10px',
              }}
            >
              <div
                style={{
                  fontSize: isSquare ? '26px' : '24px',
                  fontWeight: 700,
                  color: '#111827',
                  display: 'flex',
                  letterSpacing: '-0.01em',
                }}
              >
                {review.reviewer.name}
              </div>
              <div
                style={{
                  fontSize: isSquare ? '22px' : '20px',
                  color: '#6b7280',
                  display: 'flex',
                  fontWeight: 500,
                }}
              >
                {new Date(review.completedAt!).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width,
        height,
      }
    );
  } catch (error) {
    // Subtask 2.6: Error handling
    console.error('Error generating review image:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
