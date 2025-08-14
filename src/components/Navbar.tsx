'use client';

import { useState } from 'react';
import Link from 'next/link';
import SearchBar from './SearchBar';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <Image src="/otawatch.png" alt="Logo" width={120} height={120} />
            {/* <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: '#FF2400' }}>
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold" style={{ color: '#FF2400' }}>
              Luffy
            </span> */}
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 transition-colors font-medium" style={{ '--hover-color': '#FF2400' } as React.CSSProperties} onMouseEnter={(e) => e.currentTarget.style.color = '#FF2400'} onMouseLeave={(e) => e.currentTarget.style.color = ''}>
              Home
            </Link>
            <Link href="/trending" className="text-gray-300 transition-colors font-medium" onMouseEnter={(e) => e.currentTarget.style.color = '#FF2400'} onMouseLeave={(e) => e.currentTarget.style.color = ''}>
              Trending
            </Link>
            <Link href="/popular" className="text-gray-300 transition-colors font-medium" onMouseEnter={(e) => e.currentTarget.style.color = '#FF2400'} onMouseLeave={(e) => e.currentTarget.style.color = ''}>
              Popular
            </Link>
            <Link href="/movies" className="text-gray-300 transition-colors font-medium" onMouseEnter={(e) => e.currentTarget.style.color = '#FF2400'} onMouseLeave={(e) => e.currentTarget.style.color = ''}>
              Movies
            </Link>
            <Link href="/genres" className="text-gray-300 transition-colors font-medium" onMouseEnter={(e) => e.currentTarget.style.color = '#FF2400'} onMouseLeave={(e) => e.currentTarget.style.color = ''}>
              Genres
            </Link>
          </div>

          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <SearchBar placeholder="Search anime..." />
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800/50">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <div className="lg:hidden">
                <SearchBar placeholder="Search anime..." />
              </div>
              
              {/* Mobile Navigation Links */}
              <Link 
                href="/" 
                className="text-gray-300 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FF2400'} 
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                Home
              </Link>
              <Link 
                href="/trending" 
                className="text-gray-300 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FF2400'} 
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                Trending
              </Link>
              <Link 
                href="/popular" 
                className="text-gray-300 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FF2400'} 
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                Popular
              </Link>
              <Link 
                href="/movies" 
                className="text-gray-300 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FF2400'} 
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                Movies
              </Link>
              <Link 
                href="/genres" 
                className="text-gray-300 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FF2400'} 
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                Genres
              </Link>
              <Link 
                href="/random" 
                className="text-gray-300 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FF2400'} 
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                Random
              </Link>
              <Link 
                href="/schedule" 
                className="text-gray-300 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FF2400'} 
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                Schedule
              </Link>
              <Link 
                href="/filter" 
                className="text-gray-300 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
                onMouseEnter={(e) => e.currentTarget.style.color = '#FF2400'} 
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                Advanced Search
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}