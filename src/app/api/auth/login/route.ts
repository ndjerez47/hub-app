import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { findUser } from "@/app/lib/users";

const secret = new TextEncoder().encode("your-secret-key"); // Replace with a secure key in production

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const user = await findUser(username);
  if (!user || !bcrypt.compareSync(password, user.password || "")) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await new SignJWT({ id: user.id, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(secret);

  return NextResponse.json({ token });
}