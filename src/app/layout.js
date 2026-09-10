import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/Components/LayoutWrapper/LayoutWrapper";
import { ThemeProvider } from "@/Components/ThemeProvider/ThemeProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  description:
    "Connecting readers with independent writers and original digital stories.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full font-inter bg-[#eae2d5] text-[#090e14] dark:bg-[#0b1020] dark:text-[#e6e6e6] transition-colors duration-300">
        <ThemeProvider>
          <ToastContainer position="top-right" autoClose={4000} />
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
