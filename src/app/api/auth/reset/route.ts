import { NextResponse } from "next/server";
import { resetUsersToDefault } from "@/app/lib/users";

export async function POST() {
  try {
    await resetUsersToDefault();
    return NextResponse.json({ message: "Users reset successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reset users" }, { status: 500 });
  }
}