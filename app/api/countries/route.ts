import { NextResponse } from 'next/server';
import { countryStatusStore, MOCK_USER_ID } from './store';

export async function GET() {
  try {
    // Return the current user's country data
    return NextResponse.json(countryStatusStore[MOCK_USER_ID] || {}, { status: 200 });
  } catch (error) {
    console.error('Error fetching country data:', error);
    return NextResponse.json({ error: 'Failed to fetch country data' }, { status: 500 });
  }
} 