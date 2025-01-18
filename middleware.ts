import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const userInfoStr = localStorage.getItem('userinfo');
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/main')) {
    // Allow only 'admin' and 'sub_admin' roles
    if (!userInfo || (userInfo.role !== 'admin' && userInfo.role !== 'sub_admin')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/main', '/main/:path*']
}