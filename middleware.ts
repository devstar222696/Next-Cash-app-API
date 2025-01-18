import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userInfoStr = request.cookies.get('userinfo')?.value
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/main')) {
    // Allow only 'admin' and 'sub_admin' roles
    if (!userInfo || (userInfo.role !== 'admin' && userInfo.role !== 'sub_admin')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Protect user routes
  if (request.nextUrl.pathname.startsWith('/mypage')) {
    // Check if user is logged in
    if (!userInfo) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // Allow only 'user' and 'vip_user' roles
    if (userInfo.role !== 'user' && userInfo.role !== 'vip_user') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/main/:path*', '/mypage/:path*', '/main', '/mypage']
}