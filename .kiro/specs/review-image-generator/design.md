# Design Document

## Overview

The Review Image Generator feature enables authenticated users to create downloadable social media images from their reviews. The system uses HTML5 Canvas API for client-side image generation, ensuring fast rendering without server-side processing. The feature integrates into the existing dashboard as an additional action on each review card.

## Architecture

### Component Architecture

```
Dashboard Page (existing)
  └── ReviewCard (enhanced)
      ├── Existing review display
      └── "Create Image" button (new)
          └── Opens ImageGeneratorModal
              ├── PlatformSelector
              ├── ImagePreview (Canvas-based)
              └── DownloadButton
```

### Data Flow

1. User clicks "Create Image" button on a review card in dashboard
2. Modal opens with platform selector (default: Instagram) and loading state
3. Client automatically fetches image from API route: `/api/review-image?reviewId=X&platform=instagram`
4. API Route:
   - Authenticates user via Firebase session
   - Fetches review data and user settings from database
   - Generates JSX template with review content
   - Uses ImageResponse from @vercel/og to convert JSX to PNG
   - Returns PNG as Response with image/png content-type
5. Client receives image and displays it in modal preview area
6. User can switch platforms (Facebook/Instagram/X):
   - Platform button clicked
   - Loading state shown
   - New API request made with updated platform parameter
   - Preview updates with new image
7. User clicks "Download" button:
   - Fetches image again from API (or reuses cached blob)
   - Creates download link with proper filename
   - Triggers browser download
8. User can close modal at any time

### Technology Choices

- **@vercel/og**: High-level API for generating Open Graph images (wraps Satori + resvg)
- **ImageResponse**: Built-in class for converting JSX to PNG
- **Server Action or API Route**: Generate image server-side for consistency and performance
- **MUI Dialog**: Modal container for image generator UI
- **React State**: Manage platform selection and preview
- **Streaming Response**: Return PNG as blob for download

## Components and Interfaces

### 1. ImageGeneratorModal Component

**Location**: `src/components/imageGeneratorModal.tsx`

**Props**:
```typescript
interface ImageGeneratorModalProps {
  open: boolean;
  onClose: () => void;
  reviewId: string;
}
```

**State**:
```typescript
{
  platform: 'facebook' | 'instagram' | 'x';
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
}
```

**Responsibilities**:
- Manage modal open/close state
- Manage platform selection (default: Instagram)
- Fetch image from API route when platform changes
- Display loading state during image generation
- Display generated image preview
- Handle download action
- Display error messages
- Provide platform selector buttons/tabs

### 2. ReviewImageTemplate Component

**Location**: `src/components/reviewImageTemplate.tsx`

**Props**:
```typescript
type Platform = 'facebook' | 'instagram' | 'x';

interface ReviewImageTemplateProps {
  review: Review;
  businessName: string;
  themeColor: string;
  logoUrl?: string;
  platform: Platform;
}
```

**Responsibilities**:
- Define JSX structure for image layout
- Apply platform-specific dimensions via inline styles
- Render review content (comment, rating, name, date)
- Apply brand styling (colors, logo)
- Use @vercel/og compatible styling (Flexbox, inline styles, limited CSS)
- Handle text truncation with CSS overflow properties
- Render star rating using Unicode stars or SVG

### 3. Review Image API Route

**Location**: `src/app/api/review-image/route.ts`

**Endpoint**: `GET /api/review-image?reviewId={id}&platform={platform}`

**Responsibilities**:
- Authenticate user via Firebase session
- Verify review ownership (review belongs to authenticated user)
- Fetch review data and user settings from database
- Render JSX template with review content
- Use ImageResponse from @vercel/og to generate PNG
- Return PNG with proper headers (image/png, cache control)
- Handle errors with appropriate status codes

### 4. Enhanced ReviewCard Component

**Location**: `src/components/reviewCard.tsx` (modify existing)

**Changes**:
- Add "Create Image" button/icon (e.g., camera icon or "Share" button)
- Add state for modal open/close
- Render ImageGeneratorModal component
- Pass review ID to modal (not full review data)

**UI Placement**:
- Add button next to or below the publish/unpublish toggle
- Only show in dashboard view (when `isDashboard` prop is true)
- Use MUI IconButton or Button component for consistency

## Data Models

### Platform Dimensions

```typescript
const PLATFORM_DIMENSIONS = {
  facebook: { width: 1200, height: 630 },
  instagram: { width: 1080, height: 1080 },
  x: { width: 1200, height: 675 }
} as const;
```

### Canvas Layout Configuration

```typescript
interface CanvasLayout {
  padding: number;
  logoSize: number;
  starSize: number;
  maxCommentLines: number;
  fonts: {
    businessName: string;
    comment: string;
    reviewerName: string;
    date: string;
  };
}
```

## Error Handling

### Client-Side Errors

1. **API Request Failed**
   - Detection: Fetch returns non-200 status or network error
   - Handling: Display toast notification "Failed to generate image. Please try again"
   - Retry: Allow user to click generate/download button again

2. **Image Load Failed**
   - Detection: Image element onerror event
   - Handling: Show error message in preview area
   - User feedback: "Failed to load image preview"

3. **Download Failed**
   - Detection: Catch errors in blob download trigger
   - Handling: Show toast notification "Download failed. Please try again"
   - Retry: Allow user to click download button again

4. **Network Timeout**
   - Detection: Fetch takes >10 seconds
   - Handling: Show loading state, then timeout message
   - User feedback: "Image generation is taking longer than expected"

### Server-Side Errors

1. **Review Not Found**
   - Detection: Database query returns null
   - Handling: Return error response
   - User feedback: "Review not found"

2. **Unauthorized Access**
   - Detection: Review doesn't belong to authenticated user
   - Handling: Return error response
   - User feedback: "You don't have permission to access this review"

3. **Font Loading Failed**
   - Detection: Font file read error
   - Handling: Fall back to system fonts or default Satori fonts
   - User feedback: None (graceful degradation)

4. **ImageResponse Error**
   - Detection: Catch errors during PNG generation
   - Handling: Log error, return 500 status with error message
   - User feedback: "Failed to generate image. Please try again"

5. **Invalid Platform Parameter**
   - Detection: Platform not in ['facebook', 'instagram', 'x']
   - Handling: Return 400 status with error message
   - User feedback: "Invalid platform selected"

### Authorization Errors

1. **Unauthorized Access**
   - Detection: Review ownership check in dashboard (already handled by existing `getReviews`)
   - Handling: Feature only accessible from user's own dashboard
   - No additional checks needed (reviews already filtered by user ID)

## Testing Strategy

### Unit Testing Focus

1. **Server Action Logic**
   - Test: Review ownership validation
   - Test: Error handling for missing reviews
   - Test: Platform dimension mapping

2. **Template Rendering**
   - Test: JSX structure is valid for Satori
   - Test: Inline styles apply correctly
   - Test: Text truncation with CSS

3. **Download Filename Generation**
   - Test: Filename includes platform and review ID
   - Test: Special characters are sanitized

### Manual Testing Checklist

1. **Modal Behavior**
   - Modal opens when "Create Image" button is clicked
   - Modal closes when close button or backdrop is clicked
   - Modal displays loading state initially
   - Modal shows error state if API fails
   - Modal is responsive on mobile and desktop

2. **Image Preview**
   - Preview displays generated image correctly
   - Preview maintains aspect ratio
   - Preview fits within modal bounds
   - Preview updates when platform changes
   - Loading indicator shows during generation

3. **Visual Rendering**
   - Verify all review details appear correctly in preview
   - Check brand colors apply properly
   - Confirm logo displays when available (if implemented)
   - Test with various comment lengths
   - Test with different ratings (1-5 stars)
   - Test with reviews without ratings

4. **Platform Switching**
   - Switch between platforms in modal
   - Verify preview updates with correct dimensions
   - Check layout adapts to different aspect ratios
   - Confirm Facebook (1200x630), Instagram (1080x1080), X (1200x675)
   - Selected platform is visually indicated

5. **Download Functionality**
   - Download button is enabled after image loads
   - Download works in Chrome, Firefox, Safari
   - File saves with correct name and format
   - Image opens correctly in image viewers
   - Downloaded image matches preview exactly

6. **Edge Cases**
   - Very long reviewer names
   - Comments with special characters (quotes, emojis)
   - Very long comments (truncation)
   - Dark vs light theme colors (contrast)
   - Mobile vs desktop modal views
   - Slow network (loading states)

7. **Authentication & Authorization**
   - Cannot access other users' reviews via API
   - Unauthenticated requests are rejected
   - API returns proper error codes (401, 403, 404)

### Integration Testing

1. **Dashboard Integration**
   - "Create Image" button appears on all review cards
   - Modal opens/closes correctly
   - No interference with existing publish/unpublish functionality

2. **Data Flow**
   - Review data passes correctly to modal
   - Business settings (name, color, logo) load properly
   - State updates don't cause unnecessary re-renders

## Implementation Notes

### Server-Side Image Generation Approach

1. **@vercel/og ImageResponse**: 
   - Simplified API that handles Satori + resvg internally
   - Pass JSX directly to ImageResponse constructor
   - Configure width/height based on platform
   - Automatically handles font loading from Google Fonts

2. **Font Handling**: 
   - Use Google Fonts via fetch in ImageResponse options
   - Example: `fonts: [{ name: 'Inter', data: await fetch('...').then(r => r.arrayBuffer()) }]`
   - Support multiple weights (400, 700) for hierarchy
   - Fallback to default fonts if loading fails

3. **Response Headers**:
   - Content-Type: image/png
   - Cache-Control: public, max-age=3600 (1 hour cache)
   - Content-Disposition: inline (for preview) or attachment (for download)

4. **Performance**: 
   - Image generation: ~300-800ms typical
   - Edge caching via Vercel reduces repeat generation
   - No server-side caching needed initially

### Styling Considerations

1. **Contrast**: Ensure text is readable on brand color backgrounds
   - Use white text on dark backgrounds
   - Use dark text on light backgrounds
   - Calculate luminance from hex color

2. **Layout Responsiveness**: Canvas dimensions are fixed per platform, but modal is responsive

3. **Brand Integration**: Use existing `themeColor` and `imageUrl` from user settings

### File Naming Convention

```typescript
const generateFilename = (platform: Platform, reviewId: string): string => {
  const timestamp = Date.now();
  return `review-${platform}-${reviewId}-${timestamp}.png`;
};
```

### Dependencies

**New package to install**:
```json
{
  "@vercel/og": "^0.6.0"
}
```

**Fonts**: Loaded dynamically from Google Fonts API (no local files needed)

### Browser Compatibility

- **Target**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- **Server-Side Generation**: No browser compatibility issues
- **Download Attribute**: Supported in all target browsers
- **Base64 Image Display**: Universally supported

## Future Enhancements (Out of Scope)

1. Direct social media sharing via platform APIs
2. Custom templates/layouts selection
3. Multiple reviews in single image (collage)
4. Video generation from reviews
5. Animated GIF export
6. Custom fonts upload
7. Image editing tools (crop, filters)
