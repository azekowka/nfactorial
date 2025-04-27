import { NextRequest, NextResponse } from 'next/server';
import { countryStatusStore, MOCK_USER_ID, CountryStatus } from '../store';

// Get a specific country's status
export async function GET(
  request: NextRequest,
  { params }: { params: { countryCode: string } }
) {
  try {
    const { countryCode } = params;
    
    // Validate country code - allow any non-empty string now
    if (!countryCode || countryCode.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid country code' },
        { status: 400 }
      );
    }
    
    const userData = countryStatusStore[MOCK_USER_ID] || {};
    const countryStatus = userData[countryCode];
    
    if (!countryStatus) {
      return NextResponse.json(
        { error: 'Country status not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ status: countryStatus }, { status: 200 });
  } catch (error) {
    console.error('Error fetching country status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch country status' },
      { status: 500 }
    );
  }
}

// Add a new country status
export async function POST(
  request: NextRequest,
  { params }: { params: { countryCode: string } }
) {
  try {
    const { countryCode } = params;
    
    // Validate country code - allow any non-empty string now
    if (!countryCode || countryCode.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid country code' },
        { status: 400 }
      );
    }
    
    const userData = countryStatusStore[MOCK_USER_ID] || {};
    
    // Check if country already exists
    if (userData[countryCode]) {
      return NextResponse.json(
        { error: 'Country already exists. Use PUT to update.' },
        { status: 409 }
      );
    }
    
    const data = await request.json();
    
    // Validate status
    if (!data.status || !['visited', 'want-to-visit'].includes(data.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "visited" or "want-to-visit".' },
        { status: 400 }
      );
    }
    
    // Add country status
    userData[countryCode] = data.status;
    countryStatusStore[MOCK_USER_ID] = userData;
    
    return NextResponse.json(
      { message: 'Country status added successfully', status: data.status },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding country status:', error);
    return NextResponse.json(
      { error: 'Failed to add country status' },
      { status: 500 }
    );
  }
}

// Update a country's status
export async function PUT(
  request: NextRequest,
  { params }: { params: { countryCode: string } }
) {
  try {
    const { countryCode } = params;
    
    // Validate country code - allow any non-empty string now
    if (!countryCode || countryCode.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid country code' },
        { status: 400 }
      );
    }
    
    const userData = countryStatusStore[MOCK_USER_ID] || {};
    
    // Check if method is DELETE (workaround for Next.js API routes)
    const url = new URL(request.url);
    if (url.searchParams.get('_method') === 'DELETE') {
      // Delete the country status
      if (userData[countryCode]) {
        delete userData[countryCode];
        countryStatusStore[MOCK_USER_ID] = userData;
        return NextResponse.json(
          { message: 'Country status removed successfully' },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: 'Country not found' },
          { status: 404 }
        );
      }
    }
    
    const data = await request.json();
    
    // Validate status
    if (!data.status || !['visited', 'want-to-visit'].includes(data.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "visited" or "want-to-visit".' },
        { status: 400 }
      );
    }
    
    // Update country status
    userData[countryCode] = data.status;
    countryStatusStore[MOCK_USER_ID] = userData;
    
    return NextResponse.json(
      { message: 'Country status updated successfully', status: data.status },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating country status:', error);
    return NextResponse.json(
      { error: 'Failed to update country status' },
      { status: 500 }
    );
  }
}

// Delete a country status
export async function DELETE(
  request: NextRequest,
  { params }: { params: { countryCode: string } }
) {
  try {
    const { countryCode } = params;
    
    // Validate country code - allow any non-empty string now
    if (!countryCode || countryCode.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid country code' },
        { status: 400 }
      );
    }
    
    const userData = countryStatusStore[MOCK_USER_ID] || {};
    
    // Check if country exists
    if (!userData[countryCode]) {
      return NextResponse.json(
        { error: 'Country not found' },
        { status: 404 }
      );
    }
    
    // Delete the country status
    delete userData[countryCode];
    countryStatusStore[MOCK_USER_ID] = userData;
    
    return NextResponse.json(
      { message: 'Country status removed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing country status:', error);
    return NextResponse.json(
      { error: 'Failed to remove country status' },
      { status: 500 }
    );
  }
} 