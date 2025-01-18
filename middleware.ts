import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  try {
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
  } catch (error) {
    // If there's any error, redirect to home page
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}

// Update matcher to include all protected routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}