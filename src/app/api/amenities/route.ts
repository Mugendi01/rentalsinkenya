import { NextResponse } from 'next/server';
import { errorResponse } from '@/lib/http';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const amenities = await prisma.amenity.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ amenities });
  } catch (error: any) {
    return errorResponse(error, 'Request failed', 500);
  }
}
