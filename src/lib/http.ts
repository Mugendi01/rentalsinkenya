import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Converts an exception into a safe JSON error response. Validation messages are
 * returned to the client; anything else is logged server-side and replaced with a
 * generic message so database/internal details are never leaked.
 */
export function errorResponse(error: unknown, fallbackMessage: string, status = 500) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: error.errors[0]?.message || 'Invalid input' }, { status: 400 });
  }
  console.error(`[API ERROR] ${fallbackMessage}:`, error);
  return NextResponse.json({ error: fallbackMessage }, { status });
}
