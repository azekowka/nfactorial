import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { auth } from '@clerk/nextjs/server';

// Define types for better type safety
type CountryStatus = 'visited' | 'want-to-visit';

interface UserCountryData {
  [countryCode: string]: CountryStatus;
}

// Helper function for Redis operations
async function getUserCountryData(userId: string): Promise<UserCountryData> {
  const data = await redis.get(`countries:${userId}`);
  
  if (!data) {
    return {} as UserCountryData;
  }
  
  // If data is already an object, return it; otherwise try to parse it
  if (typeof data === 'object') {
    return data as UserCountryData;
  }
  
  try {
    return JSON.parse(data as string) as UserCountryData;
  } catch (error) {
    console.error("Error parsing user country data:", error);
    return {} as UserCountryData;
  }
}

// Helper function to save data to Redis
async function saveUserCountryData(userId: string, data: UserCountryData): Promise<void> {
  // Make sure we're storing a string
  const dataString = typeof data === 'string' ? data : JSON.stringify(data);
  await redis.set(`countries:${userId}`, dataString);
}

// GET: Get country status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ countryCode: string }> }
) {
  try {
    const { countryCode } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!countryCode?.trim()) {
      return NextResponse.json(
        { error: 'Invalid country code' },
        { status: 400 }
      );
    }

    const userData = await getUserCountryData(userId);
    const countryStatus = userData[countryCode];

    if (!countryStatus) {
      return NextResponse.json(
        { error: 'Country status not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: countryStatus });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Add new country status
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ countryCode: string }> }
) {
  try {
    const { countryCode } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!countryCode?.trim()) {
      return NextResponse.json(
        { error: 'Invalid country code' },
        { status: 400 }
      );
    }

    const data = await request.json();
    if (!data.status || !['visited', 'want-to-visit'].includes(data.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "visited" or "want-to-visit".' },
        { status: 400 }
      );
    }

    const userData = await getUserCountryData(userId);

    if (userData[countryCode]) {
      return NextResponse.json(
        { error: 'Country already exists. Use PUT to update.' },
        { status: 409 }
      );
    }

    userData[countryCode] = data.status;
    await saveUserCountryData(userId, userData);

    return NextResponse.json(
      { message: 'Country status added successfully', status: data.status },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update country status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ countryCode: string }> }
) {
  try {
    // Check if this is actually a DELETE request using method override
    const url = new URL(request.url);
    const methodOverride = url.searchParams.get('_method');
    
    if (methodOverride === 'DELETE') {
      // Forward to DELETE handler
      return DELETE(request, { params });
    }
    
    const { countryCode } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!countryCode?.trim()) {
      return NextResponse.json(
        { error: 'Invalid country code' },
        { status: 400 }
      );
    }

    const data = await request.json();
    if (!data.status || !['visited', 'want-to-visit'].includes(data.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "visited" or "want-to-visit".' },
        { status: 400 }
      );
    }

    const userData = await getUserCountryData(userId);

    if (!userData[countryCode]) {
      return NextResponse.json(
        { error: 'Country not found' },
        { status: 404 }
      );
    }

    userData[countryCode] = data.status;
    await saveUserCountryData(userId, userData);

    return NextResponse.json(
      { message: 'Country status updated successfully', status: data.status }
    );
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Remove country status
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ countryCode: string }> }
) {
  try {
    const { countryCode } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!countryCode?.trim()) {
      return NextResponse.json(
        { error: 'Invalid country code' },
        { status: 400 }
      );
    }

    const userData = await getUserCountryData(userId);

    // No need to check if the country exists, just remove it if it does
    if (userData[countryCode]) {
      delete userData[countryCode];
      await saveUserCountryData(userId, userData);
    }

    return NextResponse.json(
      { message: 'Country status removed successfully' }
    );
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}