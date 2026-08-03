import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/db';
import { isUsernameAvailable } from '@/lib/db/trial-page';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Validate username format
    const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,30}$/;
    if (!USERNAME_REGEX.test(username)) {
      return NextResponse.json(
        { available: false, error: 'Invalid username format' },
        { status: 200 }
      );
    }

    await dbConnect();
    const available = await isUsernameAvailable(username);

    return NextResponse.json({ available });
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json(
      { error: 'Failed to check username availability' },
      { status: 500 }
    );
  }
}
