'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CharactersListResponse } from '@/types/anime';
import { getCharactersList } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkeletonLoader from '@/components/SkeletonLoader';

export default function AnimeCharactersPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const animeId = params.id as string;
  const page = parseInt(searchParams.get('page') || '1');
  
  const [charactersData, setCharactersData] = useState<CharactersListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      if (!animeId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getCharactersList(animeId, page);
        setCharactersData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch characters');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [animeId, page]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="mb-8">
            <div className="h-8 bg-gray-700 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-32 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-20 bg-gray-700 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                  </div>
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
            <h2 className="text-xl font-semibold text-white mb-2">Error Loading Characters</h2>
            <p className="text-gray-400">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!charactersData?.results?.data || charactersData.results.data.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Characters</h1>
            <p className="text-gray-400">No characters found for this anime</p>
          </div>
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No Characters Found</h2>
            <p className="text-gray-400">Character information is not available for this anime</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { data, currentPage, totalPages } = charactersData.results;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Characters</h1>
          <p className="text-gray-400">
            Page {currentPage} of {totalPages} • {data.length} characters
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {data.map((item, index) => (
            <div key={`${item.character.id}-${index}`} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
              <div className="flex gap-4 mb-4">
                {/* Character Info */}
                <div className="flex-shrink-0">
                  <img
                    src={item.character.poster}
                    alt={item.character.name}
                    className="w-16 h-20 object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-character.jpg';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-1 truncate">
                    {item.character.name}
                  </h3>
                  <p className="text-purple-400 text-sm mb-2">{item.character.cast}</p>
                  <a
                    href={`/character/${item.character.id}`}
                    className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View Details
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Voice Actors */}
              {item.voiceActors && item.voiceActors.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Voice Actors</h4>
                  <div className="space-y-2">
                    {item.voiceActors.slice(0, 3).map((actor, actorIndex) => (
                      <div key={`${actor.id}-${actorIndex}`} className="flex items-center gap-2">
                        <img
                          src={actor.poster}
                          alt={actor.name}
                          className="w-8 h-8 object-cover rounded-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-actor.jpg';
                          }}
                        />
                        <a
                          href={`/actor/${actor.id}`}
                          className="text-sm text-gray-300 hover:text-white transition-colors truncate"
                        >
                          {actor.name}
                        </a>
                      </div>
                    ))}
                    {item.voiceActors.length > 3 && (
                      <p className="text-xs text-gray-400">
                        +{item.voiceActors.length - 3} more
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            {/* Previous Button */}
            {currentPage > 1 && (
              <a
                href={`/anime/${animeId}/characters?page=${currentPage - 1}`}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Previous
              </a>
            )}

            {/* Page Numbers */}
            <div className="flex space-x-1">
              {/* First page */}
              {currentPage > 3 && (
                <>
                  <a
                    href={`/anime/${animeId}/characters?page=1`}
                    className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    1
                  </a>
                  {currentPage > 4 && <span className="px-3 py-2 text-gray-400">...</span>}
                </>
              )}

              {/* Current page and neighbors */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum > totalPages) return null;
                
                return (
                  <a
                    key={pageNum}
                    href={`/anime/${animeId}/characters?page=${pageNum}`}
                    className={`px-3 py-2 rounded transition-colors ${
                      pageNum === currentPage
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </a>
                );
              })}

              {/* Last page */}
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && <span className="px-3 py-2 text-gray-400">...</span>}
                  <a
                    href={`/anime/${animeId}/characters?page=${totalPages}`}
                    className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    {totalPages}
                  </a>
                </>
              )}
            </div>

            {/* Next Button */}
            {currentPage < totalPages && (
              <a
                href={`/anime/${animeId}/characters?page=${currentPage + 1}`}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Next
              </a>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}