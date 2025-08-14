'use client';

import { useParams } from 'next/navigation';
import { useFetch } from '@/hooks/usefetch';
import { AnimeInfoResponse } from '@/types/anime';
import { getAnimeInfo, transformDetailedAnimeToAnime } from '@/lib/api';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimeCard from '@/components/Animecard';
import SkeletonLoader from '@/components/SkeletonLoader';

export default function AnimeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [animeData, setAnimeData] = useState<AnimeInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimeInfo = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getAnimeInfo(id);
        setAnimeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch anime info');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeInfo();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="animate-pulse">
            <div className="flex flex-col lg:flex-row gap-8">
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
            <h2 className="text-xl font-semibold text-white mb-2">Error Loading Anime</h2>
            <p className="text-gray-400">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!animeData?.results) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-white mb-2">Anime Not Found</h2>
            <p className="text-gray-400">The requested anime could not be found.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { data, seasons } = animeData.results;
  const anime = transformDetailedAnimeToAnime(data);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
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
                <h1 className="text-4xl font-bold text-white mb-2">{data.title}</h1>
                {data.japanese_title && data.japanese_title !== data.title && (
                  <h2 className="text-xl text-gray-300">{data.japanese_title}</h2>
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
                  <h3 className="text-lg font-semibold text-white mb-2">Genres</h3>
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
                  <h3 className="text-lg font-semibold text-white mb-2">Synopsis</h3>
                  <p className="text-gray-300 leading-relaxed">{data.animeInfo.Overview}</p>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                {data.animeInfo.Japanese && (
                  <div>
                    <span className="text-gray-400">Japanese:</span>
                    <span className="ml-2 text-white">{data.animeInfo.Japanese}</span>
                  </div>
                )}
                {data.animeInfo.Synonyms && (
                  <div>
                    <span className="text-gray-400">Synonyms:</span>
                    <span className="ml-2 text-white">{data.animeInfo.Synonyms}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href={`/anime/${data.id}/episodes`}
                  className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10v18a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h8l4 4z" />
                  </svg>
                  Watch Episodes
                </a>
                <a
                  href={`/anime/${data.id}/characters`}
                  className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  View Characters
                </a>
              </div>
            </div>
          </div>
        </div>

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