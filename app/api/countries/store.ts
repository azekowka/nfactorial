// Type for country status
export type CountryStatus = 'visited' | 'want-to-visit';

// In-memory store for simplicity - would be replaced with a database
// Format: { [userId: string]: { [countryCode: string]: 'visited' | 'want-to-visit' } }
export const countryStatusStore: Record<string, Record<string, CountryStatus>> = {};

// Mock user ID - in a real app, this would come from authentication
export const MOCK_USER_ID = 'user-123';

// Initialize with empty data if not present
if (!countryStatusStore[MOCK_USER_ID]) {
  countryStatusStore[MOCK_USER_ID] = {};
} 