import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Student Registration Portal", description: "Student registration and promo code portal" };
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}