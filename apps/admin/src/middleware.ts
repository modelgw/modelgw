import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { logger } from './lib/logger';

export async function middleware(request: NextRequest) {
  logger.trace({ url: request.nextUrl }, 'Rewriting request');
  return NextResponse.rewrite(process.env.GRAPHQL_URL!);
}

export const config = {
  matcher: '/graphql',
}
