'use client';

import { useEffect, useState } from 'react';
import { RandomAnimeResponse } from '@/types/anime';
import { getRandomAnime, transformDetailedAnimeToAnime, transformApiAnimeToAnime } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimeCard from '@/components/Animecard';
import SkeletonLoader from '@/components/SkeletonLoader';

export default function RandomAnimePage() {
  const [randomData, setRandomData] = useState<RandomAnimeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomAnime = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRandomAnime();
      setRandomData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch random anime');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomAnime();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="animate-pulse">
            <div className="flex flex-col lg:flex-row gap-8 mb-12">
              <div className="lg:w-1/3">
                <div className="bg-gray-700 rounded-lg aspect-[3/4] w-full max-w-sm mx-auto"></div>
              </div>
              <div className="lg:w-2/3 space-y-4">
                <div className="h-8 bg-gray-700 rounded w-3/4"></div>
                <div className="h-6 bg-gray-700 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center py-16">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Error Loading Random Anime</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={fetchRandomAnime}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!randomData?.results) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-white mb-2">No Random Anime Found</h2>
            <p className="text-gray-400 mb-4">Unable to fetch random anime at this time.</p>
            <button
              onClick={fetchRandomAnime}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { data, related_data, recommended_data, seasons } = randomData.results;
  const anime = transformDetailedAnimeToAnime(data);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header with Random Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Random Anime Discovery</h1>
          <button
            onClick={fetchRandomAnime}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Loading...' : 'Get Another Random'}
          </button>
        </div>

        {/* Main Anime Info */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Poster */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <img
                src={data.poster}
                alt={data.title}
                className="w-full max-w-sm mx-auto lg:mx-0 rounded-lg shadow-2xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-anime.jpg';
                }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="lg:w-2/3">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">{data.title}</h2>
                {data.japanese_title && data.japanese_title !== data.title && (
                  <h3 className="text-xl text-gray-300">{data.japanese_title}</h3>
                )}
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <span className="ml-2 text-white">{data.showType}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className="ml-2 text-white">{data.animeInfo.Status}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Aired:</span>
                    <span className="ml-2 text-white">{data.animeInfo.Aired}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Duration:</span>
                    <span className="ml-2 text-white">{data.animeInfo.Duration}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400">Premiered:</span>
                    <span className="ml-2 text-white">{data.animeInfo.Premiered}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Studios:</span>
                    <span className="ml-2 text-white">{data.animeInfo.Studios}</span>
                  </div>
                  {data.animeInfo["MAL Score"] && (
                    <div>
                      <span className="text-gray-400">MAL Score:</span>
                      <span className="ml-2 text-yellow-400 font-semibold">{data.animeInfo["MAL Score"]}</span>
                    </div>
                  )}
                  {data.adultContent && (
                    <div>
                      <span className="bg-red-600 text-white px-2 py-1 rounded text-sm">18+</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Genres */}
              {anime.genres && anime.genres.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Genres</h4>
                  <div className="flex flex-wrap gap-2">
                    {anime.genres.map((genre, index) => (
                      <span
                        key={index}
                        className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Synopsis */}
              {data.animeInfo.Overview && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Synopsis</h4>
                  <p className="text-gray-300 leading-relaxed">{data.animeInfo.Overview}</p>
                </div>
              )}

              {/* View Details Button */}
              <div>
                <a
                  href={`/anime/${data.id}`}
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  View Full Details
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Anime */}
        {related_data && related_data.length > 0 && related_data[0] && related_data[0].length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">Related Anime</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {related_data[0].slice(0, 12).map((relatedAnime) => {
                const transformedAnime = transformApiAnimeToAnime({
                  ...relatedAnime,
                  poster: relatedAnime.poster,
                  description: '',
                  showType: relatedAnime.tvInfo.showType,
                  adultContent: false,
                });
                return <AnimeCard key={relatedAnime.id} anime={transformedAnime} />;
              })}
            </div>
          </div>
        )}

        {/* Recommended Anime */}
        {recommended_data && recommended_data.length > 0 && recommended_data[0] && recommended_data[0].length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">Recommended Anime</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {recommended_data[0].slice(0, 12).map((recommendedAnime) => {
                const transformedAnime = transformApiAnimeToAnime({
                  ...recommendedAnime,
                  poster: recommendedAnime.poster,
                  description: '',
                  showType: recommendedAnime.tvInfo.showType,
                  adultContent: false,
                });
                return <AnimeCard key={recommendedAnime.id} anime={transformedAnime} />;
              })}
            </div>
          </div>
        )}

        {/* Seasons */}
        {seasons && seasons.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">Seasons</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {seasons.map((season) => (
                <div key={season.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={season.season_poster}
                      alt={season.title}
                      className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-anime.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                      <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="text-sm font-medium">{season.season}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h4 className="text-white text-sm font-medium truncate">{season.title}</h4>
                    {season.japanese_title && season.japanese_title !== season.title && (
                      <p className="text-gray-400 text-xs truncate">{season.japanese_title}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}