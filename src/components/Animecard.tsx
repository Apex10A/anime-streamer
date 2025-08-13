import Image from 'next/image';
import Link from 'next/link';
import { Anime } from '@/types/anime';

interface AnimeCardProps {
  anime: Anime;
  className?: string;
}

export default function AnimeCard({ anime, className = '' }: AnimeCardProps) {
  return (
    <Link href={`/anime/${anime.id}`} className={`group ${className}`}>
      <div className="relative overflow-hidden rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={anime.image || anime.poster || '/placeholder-anime.svg'}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-anime.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Episode count badge */}
          {anime.totalEpisodes && (
            <div className="absolute top-2 right-2 bg-purple-600/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
              {anime.totalEpisodes} EP
            </div>
          )}
          
          {/* Status badge */}
          {anime.status && (
            <div className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm ${
              anime.status.toLowerCase() === 'completed' 
                ? 'bg-green-600/90 text-white' 
                : anime.status.toLowerCase() === 'ongoing'
                ? 'bg-blue-600/90 text-white'
                : 'bg-gray-600/90 text-white'
            }`}>
              {anime.status}
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2 group-hover:text-purple-300 transition-colors">
            {anime.title}
          </h3>
          
          {anime.releaseDate && (
            <p className="text-gray-400 text-xs mb-2">
              {anime.releaseDate}
            </p>
          )}
          
          {anime.genres && anime.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {anime.genres.slice(0, 2).map((genre, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-800/50 text-gray-300 px-2 py-1 rounded-full"
                >
                  {genre}
                </span>
              ))}
              {anime.genres.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{anime.genres.length - 2}
                </span>
              )}
            </div>
          )}
          
          {anime.rating && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
              <span className="text-yellow-400 text-sm font-medium">{anime.rating}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}