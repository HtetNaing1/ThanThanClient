import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Noto_Sans_Myanmar } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const notoMyanmar = Noto_Sans_Myanmar({
  variable: "--font-noto-myanmar",
  subsets: ["myanmar"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Than Than Jewellery — Fine Gems & Gold",
    template: "%s · Than Than Jewellery",
  },
  description:
    "Heirloom gold and gemstone jewellery, handcrafted in Myanmar. Discover timeless pieces from Than Than Jewellery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${jost.variable} ${notoMyanmar.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
