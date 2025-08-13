'use client';

import { useFetch } from '@/hooks/usefetch';
import { Anime, HomeApiResponse } from '@/types/anime';
import "./index.css"
import HeroSection from '@/components/HeroSection';
import AnimeSection from '@/components/AnimeSection';
import StatsSection from '@/components/StatsSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Helper function to normalize anime data for backward compatibility
const normalizeAnime = (anime: Anime): Anime => ({
  ...anime,
  image: anime.poster || anime.image || '', // Use poster as image for backward compatibility
  // Extract additional info from tvInfo if available
  status: anime.tvInfo?.showType || anime.status,
  releaseDate: anime.tvInfo?.releaseDate || anime.releaseDate,
});

export default function Home() {
  const { data: homeData, loading, error } = useFetch<HomeApiResponse>('/api/');

  const spotlights = homeData?.results?.spotlights?.map(normalizeAnime) || [];
  const trending = homeData?.results?.trending?.map(normalizeAnime) || [];
  const topAiring = homeData?.results?.topAiring?.map(normalizeAnime) || [];
  const mostPopular = homeData?.results?.mostPopular?.map(normalizeAnime) || [];
  const mostFavorite = homeData?.results?.mostFavorite?.map(normalizeAnime) || [];
  const latestCompleted = homeData?.results?.latestCompleted?.map(normalizeAnime) || [];

  // Create data objects for each section
  const trendingData = { data: trending, loading, error };
  const topAiringData = { data: topAiring, loading, error };
  const mostPopularData = { data: mostPopular, loading, error };
  const mostFavoriteData = { data: mostFavorite, loading, error };
  const latestCompletedData = { data: latestCompleted, loading, error };

  return (
    <div className="min-h-screen mx-4">
      <Navbar />
      <HeroSection featuredAnimes={spotlights} />
      
      {/* Stats Section */}
      {/* <StatsSection /> */}
      
      {/* Error State */}
      {error && !loading && (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Failed to Load Content</h2>
            <p className="text-gray-400 mb-4">Unable to fetch anime data from the server</p>
            <p className="text-sm text-gray-500">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      {/* Main Content - Only show if no critical error */}
      {(!error || loading) && (
        <main className="container mx-auto px-4 py-16 space-y-16">
          {/* Trending Anime */}
          <AnimeSection
            title="🔥 Trending Now"
            animes={trendingData.data || []}
            loading={trendingData.loading}
            error={trendingData.error}
          />
          
          {/* Top Airing */}
          <AnimeSection
            title="📺 Top Airing"
            animes={topAiringData.data || []}
            loading={topAiringData.loading}
            error={topAiringData.error}
          />
          
          {/* Most Popular */}
          <AnimeSection
            title="⭐ Most Popular"
            animes={mostPopularData.data || []}
            loading={mostPopularData.loading}
            error={mostPopularData.error}
          />
          
          {/* Most Favorite */}
          <AnimeSection
            title="❤️ Most Favorite"
            animes={mostFavoriteData.data || []}
            loading={mostFavoriteData.loading}
            error={mostFavoriteData.error}
          />
          
          {/* Latest Completed */}
          <AnimeSection
            title="✅ Latest Completed"
            animes={latestCompletedData.data || []}
            loading={latestCompletedData.loading}
            error={latestCompletedData.error}
          />
        </main>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
