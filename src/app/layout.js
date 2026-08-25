import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/Components/LayoutWrapper/LayoutWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Fable – Digital Ebook Sharing Platform",
  description: "Connecting readers with independent writers and original digital stories.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full font-inter bg-[#eae2d5]">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
