import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  const cookieStore = cookies()
  const session = cookieStore.get('session-id')

  if (!session) {
    const sessionId = uuidv4()
    const response = NextResponse.json({ sessionId })
    response.cookies.set('session-id', sessionId, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
    return response
  }

  return NextResponse.json({ sessionId: session.value })
}
