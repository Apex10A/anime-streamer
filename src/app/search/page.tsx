'use client';

import { useSearchParams } from 'next/navigation';
import { useFetch } from '@/hooks/usefetch';
import { Anime } from '@/types/anime';
import AnimeCard from '@/components/Animecard';
import SkeletonLoader from '@/components/SkeletonLoader';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  // In a real app, this would be an actual API call
  // const { data, loading, error } = useFetch<Anime[]>(`${process.env.NEXT_PUBLIC_API_URL}/search?q=${query}`);
  
  // Mock search results for demonstration
  const mockResults: Anime[] = [
    {
      id: '1',
      title: 'Attack on Titan',
      image: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
      genres: ['Action', 'Drama', 'Fantasy'],
      rating: 9.0,
      status: 'Completed',
      totalEpisodes: 75
    },
    {
      id: '2',
      title: 'Demon Slayer',
      image: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
      genres: ['Action', 'Supernatural', 'Historical'],
      rating: 8.7,
      status: 'Ongoing',
      totalEpisodes: 44
    }
  ];

  const filteredResults = mockResults.filter(anime => 
    anime.title.toLowerCase().includes(query.toLowerCase())
  );

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
        ) : filteredResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredResults.map((anime) => (
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