import type { Metadata } from "next";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import "@/app/globals.css";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Trạm Y tế Cái Bầu – Đặc khu Vân Đồn – Quảng Ninh",
  description: "Trạm Y tế Cái Bầu - Đặc khu Vân Đồn, Tỉnh Quảng Ninh. Cung cấp dịch vụ chăm sóc sức khỏe ban đầu cho cộng đồng.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                try {
                  // Prevent wallet extensions from interfering with the app
                  // by attempting to delete or proxy the ethereum object if it's causing issues.
                  // This is a common workaround for "Cannot redefine property: ethereum" errors.
                  if (window.ethereum) {
                    const originalEthereum = window.ethereum;
                    try {
                      delete window.ethereum;
                    } catch (e) {
                      console.warn("Could not delete window.ethereum, attempting to proxy.");
                    }
                  }
                } catch (e) {}
              }
            `,
          }}
        />
      </head>
      <body className={`${beVietnamPro.variable} ${playfairDisplay.variable} font-sans`}>
        <div className="app">
          <TopBar />
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
        <SpeedInsights />
      </body>
    </html>
  );
}
