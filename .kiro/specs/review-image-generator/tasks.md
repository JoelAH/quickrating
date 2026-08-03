# Implementation Plan

- [x] 1. Install dependencies and setup
  - Install @vercel/og package via npm
  - Verify Next.js version compatibility (14.2.5 should work)
  - _Requirements: All_

- [x] 2. Create API route for image generation
  - [x] 2.1 Create API route file structure
    - Create `/src/app/api/review-image/route.ts`
    - Set up GET handler function
    - _Requirements: 1.3, 1.4, 2.2, 2.3_
  
  - [x] 2.2 Implement authentication and authorization
    - Import and use Firebase auth to verify user session
    - Fetch review from database using reviewId query parameter
    - Verify review belongs to authenticated user
    - Return 401 for unauthenticated, 403 for unauthorized, 404 for not found
    - _Requirements: 1.3, 1.4_
  
  - [x] 2.3 Implement platform dimension mapping
    - Define PLATFORM_DIMENSIONS constant with facebook, instagram, x dimensions
    - Validate platform query parameter
    - Return 400 for invalid platform
    - _Requirements: 3.2, 3.3, 3.4_
  
  - [x] 2.4 Create JSX template for review image
    - Define inline-styled JSX structure compatible with @vercel/og
    - Include business name, review comment, rating stars, reviewer name, date
    - Apply brand color from user settings
    - Use flexbox layout for positioning
    - Handle text truncation with CSS overflow
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.1, 6.2, 6.4, 6.5_
  
  - [x] 2.5 Implement ImageResponse generation
    - Import ImageResponse from @vercel/og
    - Pass JSX template to ImageResponse constructor
    - Configure width and height based on platform
    - Load Google Fonts (Inter or similar) in fonts option
    - Return Response with image/png content-type
    - Add cache-control headers
    - _Requirements: 2.3, 3.2, 3.3, 3.4_
  
  - [x] 2.6 Add error handling
    - Wrap image generation in try-catch
    - Return appropriate error responses with status codes
    - Log errors for debugging
    - _Requirements: 1.4, 5.6_

- [ ] 3. Create ImageGeneratorModal component
  - [x] 3.1 Create modal component file and basic structure
    - Create `/src/components/imageGeneratorModal.tsx`
    - Import MUI Dialog, DialogContent, DialogActions
    - Define component props interface (open, onClose, reviewId)
    - Set up component state (platform, imageUrl, loading, error)
    - _Requirements: 2.1, 2.4_
  
  - [x] 3.2 Implement platform selector UI
    - Create three buttons/tabs for Facebook, Instagram, X
    - Style selected platform button differently
    - Set default platform to Instagram
    - Update state when platform is clicked
    - _Requirements: 3.1, 3.6_
  
  - [x] 3.3 Implement image fetching logic
    - Create function to fetch image from API route
    - Build URL with reviewId and platform query parameters
    - Set loading state before fetch
    - Handle fetch response and convert to blob URL
    - Update imageUrl state with blob URL
    - Trigger fetch on mount and when platform changes
    - _Requirements: 2.2, 2.3, 3.5_
  
  - [x] 3.4 Implement preview display
    - Render loading spinner when loading is true
    - Display image element with imageUrl when loaded
    - Apply responsive styling to fit image in modal
    - Maintain aspect ratio with CSS
    - _Requirements: 2.3, 2.4, 2.5_
  
  - [x] 3.5 Implement download functionality
    - Create download button in DialogActions
    - Implement click handler to trigger download
    - Generate filename with platform and timestamp
    - Use anchor element with download attribute
    - Fetch image blob and create download link
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [x] 3.6 Add error handling and user feedback
    - Display error message when fetch fails
    - Show retry button on error
    - Use react-toastify for download error notifications
    - Handle network timeout scenarios
    - _Requirements: 1.4, 5.6_
  
  - [x] 3.7 Add modal close functionality
    - Implement close button in dialog
    - Handle backdrop click to close
    - Clean up blob URLs on unmount
    - _Requirements: 5.7_

- [ ] 4. Integrate modal into ReviewCard component
  - [x] 4.1 Add "Create Image" button to ReviewCard
    - Import ImageGeneratorModal component
    - Add state for modal open/close
    - Add button with camera icon or "Create Image" text
    - Position button near publish/unpublish toggle
    - Only show button when isDashboard is true
    - _Requirements: 1.1_
  
  - [x] 4.2 Wire up modal open/close handlers
    - Set modal open state to true on button click
    - Pass reviewId to modal component
    - Pass onClose handler to close modal
    - _Requirements: 1.2, 2.1_

- [ ] 5. Add styling and polish
  - [x] 5.1 Create SCSS module for modal
    - Create `/src/components/imageGeneratorModal.module.scss`
    - Style platform selector buttons
    - Style preview container
    - Add responsive styles for mobile
    - _Requirements: 2.4, 2.5_
  
  - [x] 5.2 Enhance image template design
    - Refine layout spacing and padding
    - Ensure text contrast on various brand colors
    - Add subtle shadows or borders for depth
    - Test with different comment lengths
    - _Requirements: 4.5, 6.4, 6.5_
  
  - [x] 5.3 Add loading and transition animations
    - Add fade-in animation for image preview
    - Add smooth transition when switching platforms
    - Style loading spinner
    - _Requirements: 2.2_
