# Implementation Plan

- [ ] 1. Create database models and schemas
  - [x] 1.1 Create TrialPage Mongoose schema and model
    - Define schema in `src/lib/models/server/trial-page.ts` with all fields from design (username, email, businessName, greeting, themeColor, imageUrl, tempPassword, contact, claimToken, claimTokenExpiry, claimed, claimedBy, claimedAt, expired, expiresAt, createdAt, updatedAt, hits)
    - Add indexes for username (unique), claimToken (unique), expiresAt
    - Export TypeScript type and formatTrialPage function
    - Mark file with "server-only" import
    - _Requirements: 1.2, 2.1, 2.4_

  - [x] 1.2 Create TrialReview Mongoose schema and model
    - Define schema in `src/lib/models/server/trial-review.ts` with fields (page ref to TrialPage, reviewer object with name/email/code, rating, comment, published, publishedAt, completedAt, createdAt, updatedAt)
    - Add indexes for page and completedAt
    - Export TypeScript type and formatTrialReview function
    - Mark file with "server-only" import
    - _Requirements: 1.2, 2.1, 4.3_

  - [x] 1.3 Create IPRateLimit Mongoose schema and model
    - Define schema in `src/lib/models/server/ip-rate-limit.ts` with fields (ipAddress, attempts, firstAttemptAt, lastAttemptAt, expiresAt)
    - Add index for ipAddress and TTL index for expiresAt (24 hours)
    - Export TypeScript type
    - Mark file with "server-only" import
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 1.4 Create client-side TypeScript types
    - Create `src/lib/models/client/trial-page.ts` with TrialPage and TrialPageWithReviews types
    - Create `src/lib/models/client/trial-review.ts` with TrialReview type
    - _Requirements: 1.1, 3.1_

- [ ] 2. Implement database access layer
  - [x] 2.1 Create trial page database functions
    - Create `src/lib/db/trial-page.ts` with functions: isUsernameAvailable (checks both User and TrialPage collections), createTrialPage, getTrialPage, getTrialPageWithReviews (with aggregation for reviews), getTrialPageByToken, markTrialPageClaimed, markTrialPageExpired, updateTrialPageHit
    - Mark file with "server-only" import
    - _Requirements: 1.1, 1.4, 2.4, 3.1, 3.2, 4.1, 4.5, 5.4, 5.6_

  - [x] 2.2 Create trial review database functions
    - Create `src/lib/db/trial-review.ts` with functions: createTrialReview, getTrialReview, getTrialReviews, confirmTrialReview, migrateTrialReviewsToReviews
    - Mark file with "server-only" import
    - _Requirements: 1.2, 4.2, 4.3, 5.5_

  - [x] 2.3 Create IP rate limiting database functions
    - Create `src/lib/db/ip-rate-limit.ts` with functions: canCreateTrialPage (checks if IP has < 3 attempts in 24 hours), recordTrialPageAttempt
    - Mark file with "server-only" import
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 3. Create utility services
  - [x] 3.1 Create trial page utility functions
    - Create `src/lib/services/trial.ts` with functions: generateTempPassword (6 chars alphanumeric), generateClaimToken (32+ chars using crypto.randomBytes), getClientIP (from Next.js headers), isTrialPageExpired (check expiresAt), validateUsername (3-30 chars, alphanumeric/hyphens/underscores)
    - _Requirements: 1.3, 1.4, 4.1, 5.1, 6.1, 7.2_

  - [x] 3.2 Create data migration service
    - Create `src/lib/services/migration.ts` with functions: migrateTrialPageToUser (creates User from TrialPage data), migrateTrialReviewsToReviews (migrates all reviews and updates references)
    - Mark file with "server-only" import
    - _Requirements: 5.3, 5.4, 5.5, 5.6_

  - [x] 3.3 Add trial claim email function
    - Add sendTrialClaimEmail function to `src/lib/models/server/email.ts` that sends claim link with 14-day expiration notice
    - _Requirements: 1.5, 7.1, 7.3, 7.4, 7.5_

- [ ] 4. Implement trial page creation flow
  - [x] 4.1 Create trial setup page
    - Create `src/app/try/setup/page.tsx` with form for username, optional email, businessName, greeting, themeColor, contact fields
    - Add client-side username validation and availability check
    - Use Material-UI components matching existing auth pages style
    - _Requirements: 1.1_

  - [x] 4.2 Create trial page creation server action
    - Create `src/app/actions/createTrialPage.ts` with onCreateTrialPage function
    - Validate inputs, check IP rate limit, verify username uniqueness across both collections
    - Generate temp password and claim token (if email provided)
    - Create TrialPage record with 14-day expiration
    - Send claim email if email provided
    - Record IP attempt
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.4, 6.1, 6.2, 7.1, 7.2, 7.3, 7.4_

  - [x] 4.3 Create trial success page
    - Create `src/app/try/success/page.tsx` that displays username, temp password, trial page URL, limitations notice
    - Show "check email" message if email was provided
    - Add copy-to-clipboard functionality for credentials
    - _Requirements: 1.4_

- [ ] 5. Modify public page to support trial pages
  - [x] 5.1 Update username page to check both collections
    - Modify `src/app/[username]/page.tsx` to first check User collection, then TrialPage collection
    - If TrialPage found, check expiration status and render accordingly
    - Update metadata generation to work with both User and TrialPage
    - Update hit counter to work with both collections
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.5, 4.6_

  - [x] 5.2 Create trial expired banner component
    - Create `src/components/trialExpiredBanner.tsx` that displays warning banner with expiration date and claim button
    - Make banner dismissible
    - Style with yellow/orange theme
    - _Requirements: 4.6_

  - [x] 5.3 Update BizPage component for trial pages
    - Modify `src/components/bizpage.tsx` to accept both User and TrialPage types
    - Ensure all customization options render correctly for trial pages
    - _Requirements: 3.3, 3.5_

- [ ] 6. Implement trial review submission flow
  - [x] 6.1 Create trial review code sending action
    - Create `src/app/actions/sendTrialReviewCode.ts` with onSendTrialReviewCode function
    - Validate trial page exists and not expired
    - Check 3-review limit
    - Check reviewer hasn't already submitted
    - Create TrialReview with published: true and publishedAt: now
    - Send verification code email
    - _Requirements: 4.2, 4.3, 4.5_

  - [x] 6.2 Create trial review confirmation action
    - Create `src/app/actions/confirmTrialReviewCode.ts` with onConfirmTrialReviewCode function
    - Validate code matches TrialReview
    - Set completedAt timestamp
    - _Requirements: 4.3_

  - [x] 6.3 Update SubmitReview component for trial pages
    - Modify `src/components/submitReview.tsx` to detect if page is trial or regular
    - Use appropriate action (sendTrialReviewCode vs onInitiateCode) based on page type
    - Handle maxedReviews for trial pages (3 limit)
    - _Requirements: 4.2, 4.3_

- [ ] 7. Implement claim process
  - [x] 7.1 Create claim page
    - Create `src/app/claim/[token]/page.tsx` with form for email (pre-filled if available), password, and Google sign-in button
    - Validate claim token on page load
    - Display trial page info (username, businessName)
    - Show error if token invalid or expired
    - _Requirements: 5.1, 5.7_

  - [x] 7.2 Create claim server action
    - Create `src/app/actions/claimTrialPage.ts` with onClaimTrialPage function
    - Validate claim token and check expiration
    - Get TrialPage by token and verify not already claimed
    - Create Firebase authentication account (email/password or Google OAuth)
    - Call migration service to create User and migrate reviews
    - Mark TrialPage as claimed with claimedBy and claimedAt
    - Create session cookie
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

  - [x] 7.3 Implement Firebase authentication for claim
    - Add Google OAuth configuration if not already present
    - Handle both email/password and Google sign-in flows in claim action
    - Create Firebase user and get UID for User record
    - _Requirements: 5.2, 5.3_

  - [x] 7.4 Implement data migration in claim process
    - Use migration service to create User record from TrialPage data
    - Migrate all TrialReview records to Review collection
    - Update review references to point to new User ID
    - Ensure all customization settings transfer correctly
    - _Requirements: 5.4, 5.5_

- [ ] 8. Add username validation API endpoint
  - [x] 8.1 Create username availability check endpoint
    - Create `src/app/api/check-username/route.ts` that checks username availability across both User and TrialPage collections
    - Return JSON with { available: boolean, error?: string }
    - Add rate limiting to prevent abuse
    - _Requirements: 1.1, 2.4_

- [x] 9. Update existing username validation
  - [x] 9.1 Update custom link validation endpoint
    - Modify `src/app/api/customlink/route.ts` to check both User and TrialPage collections for username uniqueness
    - Ensure regular user signup doesn't conflict with trial usernames
    - _Requirements: 2.4_

- [x] 10. Add environment configuration
  - [x] 10.1 Document required environment variables
    - Update README or create .env.example with any new environment variables needed
    - Document trial page configuration (expiration days, review limit, rate limit)
    - _Requirements: 1.1, 4.1, 6.1_

- [ ]* 11. Create integration tests
  - [ ]* 11.1 Write tests for trial page creation flow
    - Test successful trial page creation with and without email
    - Test username uniqueness validation across collections
    - Test IP rate limiting (3 attempts per 24 hours)
    - Test temp password and claim token generation
    - _Requirements: 1.1, 1.2, 1.3, 2.4, 6.1, 6.2_

  - [ ]* 11.2 Write tests for public page rendering
    - Test rendering regular user page
    - Test rendering active trial page
    - Test rendering expired trial page with banner
    - Test 404 for non-existent username
    - _Requirements: 3.1, 3.2, 3.3, 4.5, 4.6_

  - [ ]* 11.3 Write tests for trial review submission
    - Test successful review submission to trial page
    - Test auto-publish behavior
    - Test 3-review limit enforcement
    - Test duplicate review prevention
    - Test submission to expired trial page
    - _Requirements: 4.2, 4.3, 4.5_

  - [ ]* 11.4 Write tests for claim process
    - Test claim with email/password
    - Test claim with Google OAuth
    - Test claim with different email than trial
    - Test data migration (TrialPage → User, TrialReview → Review)
    - Test TrialPage marked as claimed
    - Test invalid/expired token handling
    - Test already-claimed page handling
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_
