import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

// Фиксированный Mock ID пользователя (в реальном приложении это будет из аутентификации)
const MOCK_USER_ID = 'user-123';

export async function GET() {
  try {
    // Получить данные стран текущего пользователя из Redis
    // В Redis ключи имеют формат: countries:{userId}
    const userData = await redis.get(`countries:${MOCK_USER_ID}`) || {};
    
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error('Error fetching country data:', error);
    return NextResponse.json({ error: 'Failed to fetch country data' }, { status: 500 });
  }
} 