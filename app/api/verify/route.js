import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = 'llavesecreta';

export async function GET(request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'No token' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, SECRET);
    return NextResponse.json({ role: decoded.role, username: decoded.username }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
