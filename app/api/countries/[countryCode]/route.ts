import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { auth } from '@clerk/nextjs/server';

// Типы статусов стран
export type CountryStatus = 'visited' | 'want-to-visit';

// Получить статус конкретной страны
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ countryCode: string }> }
) {
  try {
    // Await params before using their properties
    const { countryCode } = await params;
    
    // Get the authenticated user ID
    const { userId } = await auth();
    
    // Return 401 if not authenticated
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Проверка кода страны
    if (!countryCode || countryCode.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid country code' },
        { status: 400 }
      );
    }
    
    // Получить все данные пользователя
    const userData = await redis.get(`countries:${userId}`) || {};
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

// Добавить новый статус страны
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ countryCode: string }> }
) {
  try {
    // Await params before using their properties
    const { countryCode } = await params;
    
    // Get the authenticated user ID
    const { userId } = await auth();
    
    // Return 401 if not authenticated
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Проверка кода страны
    if (!countryCode || countryCode.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid country code' },
        { status: 400 }
      );
    }
    
    // Получить существующие данные пользователя
    const userData = await redis.get(`countries:${userId}`) || {};
    
    // Проверить, существует ли уже страна
    if (userData[countryCode]) {
      return NextResponse.json(
        { error: 'Country already exists. Use PUT to update.' },
        { status: 409 }
      );
    }
    
    const data = await request.json();
    
    // Проверка статуса
    if (!data.status || !['visited', 'want-to-visit'].includes(data.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "visited" or "want-to-visit".' },
        { status: 400 }
      );
    }
    
    // Добавить статус страны
    userData[countryCode] = data.status;
    
    // Сохранить обновленные данные в Redis
    await redis.set(`countries:${userId}`, userData);
    
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

// Обновить статус страны
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ countryCode: string }> }
) {
  try {
    // Await params before using their properties
    const { countryCode } = await params;
    
    // Get the authenticated user ID
    const { userId } = await auth();
    
    // Return 401 if not authenticated
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Проверка кода страны
    if (!countryCode || countryCode.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid country code' },
        { status: 400 }
      );
    }
    
    // Получить существующие данные пользователя
    const userData = await redis.get(`countries:${userId}`) || {};
    
    // Проверить, является ли это запросом на удаление (обходной путь для Next.js API routes)
    const url = new URL(request.url);
    if (url.searchParams.get('_method') === 'DELETE') {
      // Удалить статус страны
      if (userData[countryCode]) {
        delete userData[countryCode];
        
        // Сохранить обновленные данные в Redis
        await redis.set(`countries:${userId}`, userData);
        
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
    
    // Проверка статуса
    if (!data.status || !['visited', 'want-to-visit'].includes(data.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "visited" or "want-to-visit".' },
        { status: 400 }
      );
    }
    
    // Обновить статус страны
    userData[countryCode] = data.status;
    
    // Сохранить обновленные данные в Redis
    await redis.set(`countries:${userId}`, userData);
    
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

// Удалить статус страны
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ countryCode: string }> }
) {
  try {
    // Await params before using their properties
    const { countryCode } = await params;
    
    // Get the authenticated user ID
    const { userId } = await auth();
    
    // Return 401 if not authenticated
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Проверка кода страны
    if (!countryCode || countryCode.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid country code' },
        { status: 400 }
      );
    }
    
    // Получить существующие данные пользователя
    const userData = await redis.get(`countries:${userId}`) || {};
    
    // Проверить, существует ли страна
    if (!userData[countryCode]) {
      return NextResponse.json(
        { error: 'Country not found' },
        { status: 404 }
      );
    }
    
    // Удалить статус страны
    delete userData[countryCode];
    
    // Сохранить обновленные данные в Redis
    await redis.set(`countries:${userId}`, userData);
    
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