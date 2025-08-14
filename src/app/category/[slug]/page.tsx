'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CategoryResponse } from '@/types/anime';
import { getCategoryAnime, transformApiAnimeToAnime, CATEGORIES } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimeCard from '@/components/Animecard';
import SkeletonLoader from '@/components/SkeletonLoader';

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const page = parseInt(searchParams.get('page') || '1');
  
  const [categoryData, setCategoryData] = useState<CategoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get category display name
  const getCategoryDisplayName = (slug: string): string => {
    const categoryMap: Record<string, string> = {
      'top-airing': 'Top Airing',
      'most-popular': 'Most Popular',
      'most-favorite': 'Most Favorite',
      'completed': 'Completed',
      'recently-updated': 'Recently Updated',
      'recently-added': 'Recently Added',
      'top-upcoming': 'Top Upcoming',
      'subbed-anime': 'Subbed Anime',
      'dubbed-anime': 'Dubbed Anime',
      'movie': 'Movies',
      'special': 'Specials',
      'ova': 'OVA',
      'ona': 'ONA',
      'tv': 'TV Series',
      'az-list': 'A-Z List',
    };

    // Handle genre categories
    if (slug.startsWith('genre/')) {
      const genre = slug.replace('genre/', '').replace(/-/g, ' ');
      return genre.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    // Handle A-Z list categories
    if (slug.startsWith('az-list/')) {
      const letter = slug.replace('az-list/', '').toUpperCase();
      if (letter === '0-9') return 'Numbers (0-9)';
      if (letter === 'OTHER') return 'Other';
      return `Letter ${letter}`;
    }

    return categoryMap[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getCategoryAnime(slug, page);
        setCategoryData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch category data');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug, page]);

  const categoryName = getCategoryDisplayName(slug);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="mb-8">
            <div className="h-8 bg-gray-700 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-32 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 24 }).map((_, index) => (
              <SkeletonLoader key={index} />
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
            <h2 className="text-xl font-semibold text-white mb-2">Error Loading Category</h2>
            <p className="text-gray-400">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!categoryData?.results?.data || categoryData.results.data.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{categoryName}</h1>
          </div>
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.239 0-4.236-.908-5.69-2.379C4.736 11.047 4 9.092 4 7c0-4.418 4.03-8 9-8s9 3.582 9 8c0 2.092-.736 4.047-2.31 5.621z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No Anime Found</h2>
            <p className="text-gray-400">No anime found in this category</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { data, totalPages } = categoryData.results;
  const animeList = data.map(transformApiAnimeToAnime);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{categoryName}</h1>
          <p className="text-gray-400">
            Page {page} of {totalPages} • {data.length} anime
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
          {animeList.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            {/* Previous Button */}
            {page > 1 && (
              <a
                href={`/category/${slug}?page=${page - 1}`}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Previous
              </a>
            )}

            {/* Page Numbers */}
            <div className="flex space-x-1">
              {/* First page */}
              {page > 3 && (
                <>
                  <a
                    href={`/category/${slug}?page=1`}
                    className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    1
                  </a>
                  {page > 4 && <span className="px-3 py-2 text-gray-400">...</span>}
                </>
              )}

              {/* Current page and neighbors */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                if (pageNum > totalPages) return null;
                
                return (
                  <a
                    key={pageNum}
                    href={`/category/${slug}?page=${pageNum}`}
                    className={`px-3 py-2 rounded transition-colors ${
                      pageNum === page
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </a>
                );
              })}

              {/* Last page */}
              {page < totalPages - 2 && (
                <>
                  {page < totalPages - 3 && <span className="px-3 py-2 text-gray-400">...</span>}
                  <a
                    href={`/category/${slug}?page=${totalPages}`}
                    className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    {totalPages}
                  </a>
                </>
              )}
            </div>

            {/* Next Button */}
            {page < totalPages && (
              <a
                href={`/category/${slug}?page=${page + 1}`}
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