import Image from 'next/image';
import Link from 'next/link';
import { Anime } from '@/types/anime';

interface BannerProps {
  item: Anime;
  index: number;
}

export default function Banner({ item, index }: BannerProps) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={item.image || '/placeholder-anime.svg'}
          alt={item.title}
          fill
          className="object-cover"
          priority={index === 0}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-anime.svg';
          }}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* Status Badge */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#FF2400' }}></div>
              <span className="font-semibold text-sm uppercase tracking-wider" style={{ color: '#FF2400' }}>
                Featured Anime
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              {item.title}
            </h1>

            {/* Description */}
            {item.description && (
              <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed line-clamp-3 max-w-xl">
                {item.description}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex items-center space-x-6 mb-8">
              {item.rating && (
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                  <span className="text-white font-semibold">{item.rating}</span>
                </div>
              )}
              
              {item.totalEpisodes && (
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
                  </svg>
                  <span className="text-gray-300">{item.totalEpisodes} Episodes</span>
                </div>
              )}

              {item.status && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.status.toLowerCase() === 'completed' 
                    ? 'bg-green-600/20 text-green-400 border border-green-500/30' 
                    : item.status.toLowerCase() === 'ongoing'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'bg-gray-600/20 text-gray-400 border border-gray-500/30'
                }`}>
                  {item.status}
                </div>
              )}
            </div>

            {/* Genres */}
            {item.genres && item.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {item.genres.slice(0, 4).map((genre, genreIndex) => (
                  <span
                    key={genreIndex}
                    className="px-3 py-1 bg-white/10 text-white text-sm rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/anime/${item.id}`}
                className="inline-flex items-center justify-center px-8 py-4 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ backgroundColor: '#800020' }}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 5v10l7-5-7-5z"/>
                </svg>
                Watch Now
              </Link>
              
              <Link
                href={`/anime/${item.id}`}
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}