import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crackers Studio - Little Crack Audio Gallery",
  description: "특이한 동물들의 특별한 이야기. 리틀크랙 캐릭터들의 음성을 들어보세요!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <footer className="bg-[#8B7355] text-white py-12 mt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {/* Company */}
              <div>
                <h3 className="font-bold text-lg mb-4">Company</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-300">상호명</span><br />크래커스 스튜디오</p>
                  <p><span className="text-gray-300">대표자</span><br />김정민</p>
                  <p><span className="text-gray-300">전화번호</span><br />010-3262-4847</p>
                  <p><span className="text-gray-300">이메일</span><br />littlecrack2023@gmail.com</p>
                  <p><span className="text-gray-300">사업자번호</span><br />406-27-01669</p>
                </div>
              </div>

              {/* About Us */}
              <div>
                <h3 className="font-bold text-lg mb-4">About Us</h3>
                <div className="space-y-2 text-sm">
                  <a href="#business" className="block hover:text-yellow-300 transition-colors">Business</a>
                  <a href="#works" className="block hover:text-yellow-300 transition-colors">Works</a>
                  <a href="#history" className="block hover:text-yellow-300 transition-colors">History</a>
                </div>
              </div>

              {/* Brand */}
              <div>
                <h3 className="font-bold text-lg mb-4">Brand</h3>
                <div className="space-y-2 text-sm">
                  <a href="#little-crack" className="block hover:text-yellow-300 transition-colors">Little Crack</a>
                </div>
              </div>

              {/* Shop */}
              <div>
                <h3 className="font-bold text-lg mb-4">Shop</h3>
              </div>

              {/* Contact */}
              <div>
                <h3 className="font-bold text-lg mb-4">Contact</h3>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-12 pt-8 border-t border-white/20 text-center text-sm">
              <p>Copyright 2024. <span className="font-bold">Crackers Studio</span> All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
