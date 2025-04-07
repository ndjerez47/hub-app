import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const usersFile = path.join(process.cwd(), 'data', 'users.json');
const SECRET = 'llavesecreta';

export async function POST(request) {
  const { username, password } = await request.json();
  const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  const user = users.find(u => u.username === username);

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, SECRET, { expiresIn: '1h' });
    return NextResponse.json({ token }, { status: 200 });
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
