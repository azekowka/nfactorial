import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get the authenticated user ID
    const { userId } = await auth();
    
    // Return 401 if not authenticated
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Получить данные стран текущего пользователя из Redis
    // В Redis ключи имеют формат: countries:{userId}
    const userData = await redis.get(`countries:${userId}`) || {};
    
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error('Error fetching country data:', error);
    return NextResponse.json({ error: 'Failed to fetch country data' }, { status: 500 });
  }
} 