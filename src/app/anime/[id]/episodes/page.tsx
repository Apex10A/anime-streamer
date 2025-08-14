'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EpisodesResponse } from '@/types/anime';
import { getAnimeEpisodes } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AnimeEpisodesPage() {
  const params = useParams();
  const animeId = params.id as string;
  
  const [episodesData, setEpisodesData] = useState<EpisodesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (!animeId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getAnimeEpisodes(animeId);
        setEpisodesData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch episodes');
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [animeId]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="mb-8">
            <div className="h-8 bg-gray-700 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-32 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                  <div className="w-20 h-8 bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
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
            <h2 className="text-xl font-semibold text-white mb-2">Error Loading Episodes</h2>
            <p className="text-gray-400">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!episodesData?.results?.episodes || episodesData.results.episodes.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Episodes</h1>
            <p className="text-gray-400">No episodes found for this anime</p>
          </div>
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM6 6v12h12V6H6zm3 3a1 1 0 112 0v6a1 1 0 11-2 0V9zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V9z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No Episodes Found</h2>
            <p className="text-gray-400">Episode information is not available for this anime</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { episodes, totalEpisodes } = episodesData.results;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Episodes</h1>
          <p className="text-gray-400">
            {totalEpisodes} episodes • {episodes.length} available
          </p>
        </div>

        <div className="space-y-4">
          {episodes.map((episode) => (
            <div key={episode.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
              <div className="flex items-center gap-4">
                {/* Episode Number */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{episode.episode_no}</span>
                  </div>
                </div>

                {/* Episode Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-1 truncate">
                    {episode.title}
                  </h3>
                  {episode.japanese_title && episode.japanese_title !== episode.title && (
                    <p className="text-gray-400 text-sm mb-2 truncate">{episode.japanese_title}</p>
                  )}
                  {episode.jname && episode.jname !== episode.title && episode.jname !== episode.japanese_title && (
                    <p className="text-gray-500 text-xs truncate">{episode.jname}</p>
                  )}
                </div>

                {/* Watch Button */}
                <div className="flex-shrink-0">
                  <a
                    href={`/watch/${episode.id}?anime=${animeId}`}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10v18a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h8l4 4z" />
                    </svg>
                    Watch
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More or Pagination could be added here if needed */}
        {episodes.length < totalEpisodes && (
          <div className="text-center mt-8">
            <p className="text-gray-400">
              Showing {episodes.length} of {totalEpisodes} episodes
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}