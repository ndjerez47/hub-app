import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const usersFile = path.join(process.cwd(), 'data', 'users.json');
const SECRET = 'llavesecreta';

export async function GET() {
  const data = await fs.readFile(usersFile, 'utf8');
  return NextResponse.json(JSON.parse(data), { status: 200 });
}

export async function POST(request) {
  const { token, username, password, role } = await request.json();
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const users = JSON.parse(await fs.readFile(usersFile, 'utf8'));
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: users.length + 1, username, password: hashedPassword, role };
    users.push(newUser);
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
    return NextResponse.json(users, { status: 200 });
  } catch (e) {
    console.error('User add error:', e);
    return NextResponse.json({ error: 'Failed to add user' }, { status: 500 });
  }
}
