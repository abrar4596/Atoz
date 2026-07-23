import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_NAME = 'atoz_admin_session'
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET

function normalizeBase64Url(value: string) {
  let normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  while (normalized.length % 4 !== 0) normalized += '='
  return normalized
}

async function verifyAdminToken(token: string) {
  console.log('[Middleware] === VERIFYING ADMIN TOKEN ===')
  console.log('[Middleware] Token to verify:', token)
  console.log('[Middleware] SESSION_SECRET exists:', !!SESSION_SECRET)
  
  // For DEVELOPMENT: always accept any non-empty token!
  console.log('[Middleware] Environment:', process.env.NODE_ENV)
  if (process.env.NODE_ENV === 'development') {
    console.log('[Middleware] DEVELOPMENT MODE: Accepting any token!')
    return true
  }
  
  // For production: verify token properly
  if (!SESSION_SECRET) {
    console.error('[Middleware] PRODUCTION ERROR: No SESSION_SECRET set!')
    return false
  }

  try {
    const [payload, signature] = token.split('.')
    if (!payload || !signature) {
      console.log('[Middleware] Invalid token format (missing payload or signature)')
      return false
    }

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(SESSION_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    )

    const expectedSig = await crypto.subtle.verify(
      'HMAC',
      key,
      Uint8Array.from(atob(normalizeBase64Url(signature)), (c) => c.charCodeAt(0)),
      new TextEncoder().encode(payload),
    )

    console.log('[Middleware] Token verification result (production):', expectedSig)
    return Boolean(expectedSig)
  } catch (error) {
    console.error('[Middleware] Token verification error (production):', error)
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log('[Middleware] === INCOMING REQUEST ===')
  console.log('[Middleware] Path:', pathname)
  console.log('[Middleware] All cookies:', request.cookies.getAll())

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/login' || pathname === '/register') {
    console.log('[Middleware] Allowing request (static/api/auth)')
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get(SESSION_NAME)?.value
    console.log('[Middleware] Admin session cookie found:', !!session, '- Value:', session)
    
    const isAuthorized = session ? await verifyAdminToken(session) : false
    console.log('[Middleware] Final authorization result:', isAuthorized)

    if (!isAuthorized) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      console.log('[Middleware] REDIRECTING TO LOGIN:', loginUrl.toString())
      return NextResponse.redirect(loginUrl)
    }
    
    console.log('[Middleware] ALLOWING ADMIN ACCESS!')
  }

  console.log('[Middleware] Allowing request')
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
