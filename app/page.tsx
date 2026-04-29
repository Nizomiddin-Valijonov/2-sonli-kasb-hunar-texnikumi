// app/page.tsx
import { redirect } from "next/navigation";

export const dynamic = "error";

export default function Home() {
  // Visitorni avtomatik /uz ga yo‘naltiradi
  redirect("/uz");
}
