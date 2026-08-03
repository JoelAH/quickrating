import crypto from 'crypto';
import { headers } from 'next/headers';
import type { TrialPage } from '@/lib/models/server/trial-page';

/**
 * Generate a secure claim token with at least 32 characters of entropy
 * @returns A URL-safe random token string
 */
export function generateClaimToken(): string {
  // Generate 32 random bytes (256 bits of entropy)
  // Convert to base64url format (URL-safe)
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Extract client IP address from Next.js request headers
 * Checks common headers used by proxies and load balancers
 * @returns The client IP address or 'unknown' if not found
 */
export function getClientIP(): string {
  const headersList = headers();
  
  // Check common headers in order of preference
  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = headersList.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }
  
  const cfConnectingIP = headersList.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }
  
  // Fallback if no IP found
  return 'unknown';
}

/**
 * Check if a trial page has expired
 * @param trialPage The trial page to check
 * @returns true if the page has expired, false otherwise
 */
export function isTrialPageExpired(trialPage: TrialPage): boolean {
  if (trialPage.expired) {
    return true;
  }
  
  const now = new Date();
  return trialPage.expiresAt < now;
}

/**
 * Validate username format and length
 * Username must be 3-30 characters and contain only alphanumeric characters, hyphens, and underscores
 * @param username The username to validate
 * @returns Object with valid flag and optional error message
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username is required' };
  }
  
  const trimmed = username.trim();
  
  if (trimmed.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters long' };
  }
  
  if (trimmed.length > 30) {
    return { valid: false, error: 'Username must be no more than 30 characters long' };
  }
  
  // Only allow alphanumeric characters, hyphens, and underscores
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  if (!validPattern.test(trimmed)) {
    return { valid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' };
  }
  
  return { valid: true };
}
