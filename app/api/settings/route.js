import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const settingsFile = path.join(process.cwd(), 'data', 'settings.json');

export async function GET() {
  try {
    const data = await fs.readFile(settingsFile, 'utf8');
    return NextResponse.json(JSON.parse(data), { status: 200 });
  } catch (e) {
    return NextResponse.json({ temp: 72, occupied: false }, { status: 200 }); // Default
  }
}

export async function POST(request) {
  const { token, temp, occupied } = await request.json();
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const settings = { temp, occupied };
    await fs.writeFile(settingsFile, JSON.stringify(settings, null, 2));
    return NextResponse.json(settings, { status: 200 });
  } catch (e) {
    console.error('Settings save error:', e);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
