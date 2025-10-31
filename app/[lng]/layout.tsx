import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "../globals.css";
import Navbar from "../components/Navbar/Navbar";

const rubikSans = Rubik({
  variable: "--font-rubik-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "33-maktab – Rasmiy veb-sayt",
  description: "33-maktab – yosh avlod uchun bilim va ma’naviyat maskani.",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  return (
    <html lang={params.lng}>
      <body className={`${rubikSans.variable} antialiased`}>
        <Navbar lng={params.lng} />
        {children}
      </body>
    </html>
  );
}
