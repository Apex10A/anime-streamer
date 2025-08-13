import { Anime } from '@/types/anime';
import AnimeCard from './Animecard';
import SkeletonLoader from './SkeletonLoader';

interface AnimeSectionProps {
  title: string;
  animes: Anime[];
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export default function AnimeSection({ 
  title, 
  animes, 
  loading = false, 
  error = null, 
  className = '' 
}: AnimeSectionProps) {
  if (error) {
    return (
      <section className={`${className}`}>
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        <div className="text-center py-12">
          <div className="text-red-400 mb-2">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-400">Failed to load {title.toLowerCase()}</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <button className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium">
          View All →
        </button>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <SkeletonLoader key={index} />
          ))}
        </div>
      ) : animes.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {animes.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-gray-400">No {title.toLowerCase()} available</p>
        </div>
      )}
    </section>
  );
}