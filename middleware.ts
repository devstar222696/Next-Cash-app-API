import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userInfoStr = request.cookies.get('userinfo')?.value
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/main')) {
    // If user is not logged in or is a regular/vip user, redirect to home
    if (!userInfo || userInfo.role === 'user' || userInfo.role === 'vip_user') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/main', '/main/:path*']
} 