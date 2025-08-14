'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FilterResponse } from '@/types/anime';
import { filterAnime, transformApiAnimeToAnime } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimeCard from '@/components/Animecard';
import SkeletonLoader from '@/components/SkeletonLoader';

interface FilterParams {
  type: string;
  status: string;
  rated: string;
  score: string;
  season: string;
  language: string;
  genres: string;
  sort: string;
  page: number;
  sy: string; // start year
  sm: string; // start month
  sd: string; // start day
  ey: string; // end year
  em: string; // end month
  ed: string; // end day
  keyword: string;
}

export default function FilterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [filterData, setFilterData] = useState<FilterResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterParams>({
    type: searchParams.get('type') || '',
    status: searchParams.get('status') || '',
    rated: searchParams.get('rated') || '',
    score: searchParams.get('score') || '',
    season: searchParams.get('season') || '',
    language: searchParams.get('language') || '',
    genres: searchParams.get('genres') || '',
    sort: searchParams.get('sort') || 'default',
    page: parseInt(searchParams.get('page') || '1'),
    sy: searchParams.get('sy') || '',
    sm: searchParams.get('sm') || '',
    sd: searchParams.get('sd') || '',
    ey: searchParams.get('ey') || '',
    em: searchParams.get('em') || '',
    ed: searchParams.get('ed') || '',
    keyword: searchParams.get('keyword') || '',
  });

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: '1', label: 'Movie' },
    { value: '2', label: 'TV' },
    { value: '3', label: 'OVA' },
    { value: '4', label: 'ONA' },
    { value: '5', label: 'Special' },
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: '1', label: 'Finished' },
    { value: '2', label: 'Currently Airing' },
    { value: '3', label: 'Not Yet Aired' },
  ];

  const ratedOptions = [
    { value: '', label: 'All Ratings' },
    { value: '1', label: 'G - All Ages' },
    { value: '2', label: 'PG - Children' },
    { value: '3', label: 'PG-13 - Teens 13+' },
    { value: '4', label: 'R - 17+' },
    { value: '5', label: 'R+ - Mild Nudity' },
    { value: '6', label: 'Rx - Hentai' },
  ];

  const scoreOptions = [
    { value: '', label: 'All Scores' },
    { value: '9', label: '9+ Excellent' },
    { value: '8', label: '8+ Very Good' },
    { value: '7', label: '7+ Good' },
    { value: '6', label: '6+ Fine' },
    { value: '5', label: '5+ Average' },
  ];

  const seasonOptions = [
    { value: '', label: 'All Seasons' },
    { value: 'spring', label: 'Spring' },
    { value: 'summer', label: 'Summer' },
    { value: 'fall', label: 'Fall' },
    { value: 'winter', label: 'Winter' },
  ];

  const languageOptions = [
    { value: '', label: 'All Languages' },
    { value: 'sub', label: 'Subtitled' },
    { value: 'dub', label: 'Dubbed' },
  ];

  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'score', label: 'Score' },
    { value: 'title', label: 'Title' },
    { value: 'start_date', label: 'Start Date' },
    { value: 'end_date', label: 'End Date' },
  ];

  const genreOptions = [
    'Action', 'Adventure', 'Cars', 'Comedy', 'Dementia', 'Demons', 'Drama', 'Ecchi',
    'Fantasy', 'Game', 'Harem', 'Historical', 'Horror', 'Isekai', 'Josei', 'Kids',
    'Magic', 'Martial Arts', 'Mecha', 'Military', 'Music', 'Mystery', 'Parody',
    'Police', 'Psychological', 'Romance', 'Samurai', 'School', 'Sci-Fi', 'Seinen',
    'Shoujo', 'Shoujo Ai', 'Shounen', 'Shounen Ai', 'Slice of Life', 'Space',
    'Sports', 'Super Power', 'Supernatural', 'Thriller', 'Vampire'
  ];

  const applyFilters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build filter params, excluding empty values
      const params: any = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          if (key === 'page') {
            params[key] = parseInt(value as string);
          } else if (['sy', 'sm', 'sd', 'ey', 'em', 'ed'].includes(key)) {
            const numValue = parseInt(value as string);
            if (!isNaN(numValue)) {
              params[key] = numValue;
            }
          } else {
            params[key] = value;
          }
        }
      });

      const data = await filterAnime(params);
      setFilterData(data);
      
      // Update URL
      const urlParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          urlParams.set(key, value.toString());
        }
      });
      router.push(`/filter?${urlParams.toString()}`, { scroll: false });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter anime');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    const resetFilters: FilterParams = {
      type: '',
      status: '',
      rated: '',
      score: '',
      season: '',
      language: '',
      genres: '',
      sort: 'default',
      page: 1,
      sy: '',
      sm: '',
      sd: '',
      ey: '',
      em: '',
      ed: '',
      keyword: '',
    };
    setFilters(resetFilters);
    setFilterData(null);
    router.push('/filter');
  };

  const handleFilterChange = (key: keyof FilterParams, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset page when other filters change
    }));
  };

  const handleGenreToggle = (genre: string) => {
    const currentGenres = filters.genres ? filters.genres.split(',') : [];
    const genreIndex = currentGenres.indexOf(genre);
    
    if (genreIndex > -1) {
      currentGenres.splice(genreIndex, 1);
    } else {
      currentGenres.push(genre);
    }
    
    handleFilterChange('genres', currentGenres.join(','));
  };

  useEffect(() => {
    // Apply filters on component mount if there are URL params
    const hasParams = Array.from(searchParams.entries()).length > 0;
    if (hasParams) {
      applyFilters();
    }
  }, []);

  const results = filterData?.results?.data ? filterData.results.data.map(transformApiAnimeToAnime) : [];
  const totalPages = filterData?.results?.totalPages || 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Advanced Anime Filter</h1>
          <p className="text-gray-400">Find anime using advanced search criteria</p>
        </div>

        {/* Filter Form */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Keyword Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Keyword</label>
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                placeholder="Search by title..."
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
              <select
                value={filters.rated}
                onChange={(e) => handleFilterChange('rated', e.target.value)}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
              >
                {ratedOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Score */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Score</label>
              <select
                value={filters.score}
                onChange={(e) => handleFilterChange('score', e.target.value)}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
              >
                {scoreOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Genres */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Genres</label>
            <div className="flex flex-wrap gap-2">
              {genreOptions.map(genre => {
                const isSelected = filters.genres.split(',').includes(genre);
                return (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      isSelected
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={applyFilters}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {loading ? 'Searching...' : 'Apply Filters'}
            </button>
            <button
              onClick={resetFilters}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 24 }).map((_, index) => (
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
            <h2 className="text-xl font-semibold text-white mb-2">Filter Error</h2>
            <p className="text-gray-400">{error}</p>
          </div>
        ) : filterData && results.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-400">
                Page {filters.page} of {totalPages} • {results.length} anime found
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
              {results.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                {filters.page > 1 && (
                  <button
                    onClick={() => {
                      handleFilterChange('page', filters.page - 1);
                      applyFilters();
                    }}
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    Previous
                  </button>
                )}

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, filters.page - 2)) + i;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          handleFilterChange('page', pageNum);
                          applyFilters();
                        }}
                        className={`px-3 py-2 rounded transition-colors ${
                          pageNum === filters.page
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {filters.page < totalPages && (
                  <button
                    onClick={() => {
                      handleFilterChange('page', filters.page + 1);
                      applyFilters();
                    }}
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            )}
          </>
        ) : filterData && results.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.239 0-4.236-.908-5.69-2.379C4.736 11.047 4 9.092 4 7c0-4.418 4.03-8 9-8s9 3.582 9 8c0 2.092-.736 4.047-2.31 5.621z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No Results Found</h2>
            <p className="text-gray-400">Try adjusting your filter criteria</p>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Start Filtering</h2>
            <p className="text-gray-400">Use the filters above to find anime that match your preferences</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}