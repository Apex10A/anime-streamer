'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SearchResponse } from '@/types/anime';
import { searchAnime, transformSearchResultToAnime } from '@/lib/api';
import AnimeCard from '@/components/Animecard';
import SkeletonLoader from '@/components/SkeletonLoader';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [searchData, setSearchData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setSearchData(null);
        setLoading(false);
        setError(null);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const data = await searchAnime(query);
        setSearchData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search anime');
        setSearchData(null);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  const results = searchData?.results ? searchData.results.map(transformSearchResultToAnime) : [];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-gray-400">
              Showing results for: <span className="text-purple-400 font-medium">"{query}"</span>
            </p>
          )}
        </div>

{!query ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Start Your Search</h2>
            <p className="text-gray-400">Enter a search term to find your favorite anime</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <SkeletonLoader key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Search Error</h2>
            <p className="text-gray-400">{error}</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.239 0-4.236-.908-5.69-2.379C4.736 11.047 4 9.092 4 7c0-4.418 4.03-8 9-8s9 3.582 9 8c0 2.092-.736 4.047-2.31 5.621z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No Results Found</h2>
            <p className="text-gray-400">Try searching with different keywords</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}