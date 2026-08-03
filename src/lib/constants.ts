const CONSTANTS = {
    appName: 'QuickRating',
    sessionCookieName: 'qr_user_session',
    maxPasswordLength: 6,
    trialPages: {
        expirationDays: 14,
        maxReviews: 3,
        rateLimit: {
            maxAttempts: 3,
            windowHours: 24
        }
    },
    errors: {
        defaultMessage: 'Error. Something went wrong.',
        firebase: {
            EMAIL_USED: 'auth/email-already-in-use',
            INVALID_CREDENTIAL: 'auth/invalid-credential',
            WRONG_PASSWORD: 'auth/wrong-password',
            EMAIL_NOT_FOUND: 'auth/user-not-found'
        }
    }
}

export default CONSTANTS;