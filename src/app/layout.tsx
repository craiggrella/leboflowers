import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import LayoutChrome from "@/components/LayoutChrome";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thank You | Mt. Lebanon Flower Sale",
  description:
    "Thank you, Mt. Lebanon, for making this year's flower sale a blooming success supporting our local nonprofits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <CartProvider>
          <LayoutChrome>{children}</LayoutChrome>
        </CartProvider>
      </body>
    </html>
  );
}
