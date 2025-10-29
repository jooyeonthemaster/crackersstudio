'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="https://cdn.imweb.me/thumbnail/20250527/da4074b6a4a33.png"
                alt="Crackers Studio"
                width={180}
                height={60}
                className="h-12 w-auto"
                priority
                unoptimized
              />
            </Link>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center gap-2">
            {/* About Us */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown('about')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href="https://crackersstudio.com/about"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                About Us
              </a>
              <AnimatePresence>
                {activeDropdown === 'about' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[160px]"
                  >
                    <a
                      href="https://crackersstudio.com/business"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      Business
                    </a>
                    <a
                      href="https://crackersstudio.com/works"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      Works
                    </a>
                    <a
                      href="https://crackersstudio.com/history"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      History
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Brand */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown('brand')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href="https://crackersstudio.com/brand"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Brand
              </a>
              <AnimatePresence>
                {activeDropdown === 'brand' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px]"
                  >
                    <div className="relative group/sub">
                      <a
                        href="https://crackersstudio.com/little-crack"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        Little Crack
                        <span className="float-right">›</span>
                      </a>
                      {/* 서브메뉴 */}
                      <div className="absolute left-full top-0 ml-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all">
                        <a
                          href="https://crackersstudio.com/characters"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          Universe & Characters
                        </a>
                        <a
                          href="https://crackersstudio.com/Toons"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          Toons
                        </a>
                        <a
                          href="https://crackersstudio.com/Illustrations"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          Illustrations
                        </a>
                        <a
                          href="https://www.youtube.com/@littlecrack_official"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          Youtube
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Shop */}
            <a
              href="https://smartstore.naver.com/littlecrack"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Shop
            </a>

            {/* Contact */}
            <a
              href="https://crackersstudio.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Contact
            </a>
          </nav>

        </div>
      </div>
    </header>
  );
}
