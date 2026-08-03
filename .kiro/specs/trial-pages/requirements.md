# Requirements Document

## Introduction

The Trial Pages feature enables unauthenticated users to create temporary review pages without signing up for a full account. This reduces friction for potential customers who want to test QuickRating before committing to registration. Trial pages have limited functionality (3 reviews maximum, 14-day expiration, auto-publish only) and can be claimed later to convert into full accounts with data migration.

## Glossary

- **Trial Page System**: The subsystem that manages temporary review pages for unauthenticated users
- **Trial Page**: A temporary review page with limited functionality that expires after 14 days
- **Trial Review**: A review submitted to a Trial Page, limited to 3 per page
- **Claim Process**: The workflow that converts a Trial Page into a full User account with Firebase authentication
- **Claim Token**: A unique, secure identifier used to authenticate the claim process
- **Regular Page**: A review page associated with a full User account with Firebase authentication
- **IP Rate Limiter**: A mechanism that restricts trial page creation attempts from the same IP address

## Requirements

### Requirement 1

**User Story:** As a potential customer, I want to create a trial review page without signing up, so that I can test the product before committing to registration

#### Acceptance Criteria

1. WHEN an unauthenticated user accesses the trial setup page at /try/setup, THE Trial Page System SHALL display a form requesting username, optional email, and basic customization options
2. WHEN the user submits the trial setup form with valid data, THE Trial Page System SHALL create a TrialPage record in the database with the provided information
3. WHEN the TrialPage record is created, THE Trial Page System SHALL generate a secure temporary password of exactly 6 characters
4. WHEN the trial page creation succeeds, THE Trial Page System SHALL display a success page showing the username and temporary password
5. WHERE the user provided an email address, THE Trial Page System SHALL send a claim email containing a unique claim token link

### Requirement 2

**User Story:** As a system administrator, I want trial pages to be stored separately from regular user accounts, so that the existing authentication and user data remain isolated and secure

#### Acceptance Criteria

1. THE Trial Page System SHALL store trial page data in a TrialPage collection separate from the User collection
2. THE Trial Page System SHALL store trial reviews in a TrialReview collection separate from the Review collection
3. WHEN creating a TrialPage record, THE Trial Page System SHALL NOT create a Firebase authentication account
4. WHEN querying for username uniqueness, THE Trial Page System SHALL check both User and TrialPage collections
5. THE Trial Page System SHALL NOT modify existing User or Review collection schemas

### Requirement 3

**User Story:** As a trial page owner, I want my trial page to be publicly accessible at the same URL format as regular pages, so that I can share it with customers immediately

#### Acceptance Criteria

1. WHEN a user navigates to /[username], THE Trial Page System SHALL check both User and TrialPage collections for the username
2. WHERE the username matches a TrialPage record, THE Trial Page System SHALL render the public review page with trial page data
3. WHERE the username matches a User record, THE Trial Page System SHALL render the public review page with user account data
4. WHEN rendering a trial page, THE Trial Page System SHALL display all published TrialReview records associated with that page
5. THE Trial Page System SHALL apply the same visual customization options to trial pages as regular pages

### Requirement 4

**User Story:** As a product owner, I want trial pages to have strict limitations, so that users are incentivized to upgrade while preventing abuse

#### Acceptance Criteria

1. WHEN a trial page is created, THE Trial Page System SHALL set an expiration timestamp of 14 days from creation
2. WHEN a review is submitted to a trial page, THE Trial Page System SHALL reject the submission IF the page already has 3 reviews
3. WHEN a review is submitted to a trial page, THE Trial Page System SHALL automatically set the review status to published
4. WHEN a trial page owner attempts to access dashboard features, THE Trial Page System SHALL deny access
5. WHEN a trial page expires, THE Trial Page System SHALL mark the TrialPage record as expired without deleting it from the database
6. WHEN rendering an expired trial page, THE Trial Page System SHALL display an expiration banner on the page while still showing the reviews

### Requirement 5

**User Story:** As a trial page owner, I want to claim my trial page and convert it to a full account, so that I can retain my reviews and continue using the service without limitations

#### Acceptance Criteria

1. WHEN a user accesses /claim/[token] with a valid claim token, THE Trial Page System SHALL display a claim form with options to use the trial email or enter a new email, enter a password, or sign in with Google
2. WHEN the user submits the claim form with email and password, THE Trial Page System SHALL create a Firebase authentication account with the provided credentials
3. WHEN the user submits the claim form with Google sign-in, THE Trial Page System SHALL create a Firebase authentication account using Google OAuth
4. WHEN the Firebase account is created, THE Trial Page System SHALL create a User record with data migrated from the TrialPage record and the chosen email address
5. WHEN the User record is created, THE Trial Page System SHALL migrate all TrialReview records to Review records associated with the new User
6. WHEN data migration completes, THE Trial Page System SHALL mark the TrialPage as claimed and associate it with the new User ID
7. WHEN the claim token is invalid or expired, THE Trial Page System SHALL display an error message
8. WHEN the claim process completes successfully, THE Trial Page System SHALL authenticate the user and redirect to the dashboard

### Requirement 6

**User Story:** As a system administrator, I want to prevent abuse of trial page creation, so that malicious users cannot create unlimited trial pages

#### Acceptance Criteria

1. WHEN a trial page creation request is received, THE IP Rate Limiter SHALL check the request IP address against recent creation attempts
2. WHEN the IP address has created more than 3 trial pages within 24 hours, THE IP Rate Limiter SHALL reject the request with a rate limit error
3. THE IP Rate Limiter SHALL store IP address and timestamp data for rate limiting purposes
4. WHEN 24 hours have elapsed since the first creation attempt, THE IP Rate Limiter SHALL allow the IP address to create trial pages again
5. THE IP Rate Limiter SHALL apply rate limiting only to trial page creation, not to regular user registration

### Requirement 7

**User Story:** As a trial page owner, I want to receive a claim email if I provide my email address, so that I can easily find the link to convert my trial page to a full account

#### Acceptance Criteria

1. WHERE the user provided an email during trial setup, THE Trial Page System SHALL generate a unique claim token with at least 32 characters of entropy
2. WHEN the claim token is generated, THE Trial Page System SHALL store it in the TrialPage record with an expiration timestamp of 14 days
3. WHEN sending the claim email, THE Trial Page System SHALL include the claim URL in the format /claim/[token]
4. THE Trial Page System SHALL send the claim email within 60 seconds of trial page creation
5. WHERE the user did not provide an email, THE Trial Page System SHALL NOT generate or send a claim token
