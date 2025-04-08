import { redirect } from "next/navigation";

// This is the entry point; redirect to login if not authenticated
export default function Home() {
  // For now, we'll assume no auth; later, we'll check a token
  redirect("/dashboard");
}