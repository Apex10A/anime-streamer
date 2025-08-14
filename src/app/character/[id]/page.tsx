'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CharacterDetailsResponse } from '@/types/anime';
import { getCharacterDetails } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CharacterDetailPage() {
  const params = useParams();
  const characterId = params.id as string;
  
  const [characterData, setCharacterData] = useState<CharacterDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      if (!characterId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getCharacterDetails(characterId);
        setCharacterData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch character details');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacterDetails();
  }, [characterId]);

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
            <h2 className="text-xl font-semibold text-white mb-2">Error Loading Character</h2>
            <p className="text-gray-400">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!characterData?.results?.data || characterData.results.data.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-white mb-2">Character Not Found</h2>
            <p className="text-gray-400">The requested character could not be found.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const character = characterData.results.data[0];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Character Info */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Profile Image */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <img
                src={character.profile}
                alt={character.name}
                className="w-full max-w-sm mx-auto lg:mx-0 rounded-lg shadow-2xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-character.jpg';
                }}
              />
            </div>
          </div>

          {/* Character Details */}
          <div className="lg:w-2/3">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{character.name}</h1>
                {character.japaneseName && character.japaneseName !== character.name && (
                  <h2 className="text-xl text-gray-300">{character.japaneseName}</h2>
                )}
              </div>

              {/* About */}
              {character.about?.description && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                  <div 
                    className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: character.about.style || character.about.description 
                    }}
                  />
                </div>
              )}

              {/* Voice Actors */}
              {character.voiceActors && character.voiceActors.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Voice Actors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {character.voiceActors.map((actor, index) => (
                      <div key={`${actor.id}-${index}`} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
                        <div className="flex items-center gap-4">
                          <img
                            src={actor.profile}
                            alt={actor.name}
                            className="w-16 h-16 object-cover rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-actor.jpg';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <a
                              href={`/actor/${actor.id}`}
                              className="text-white font-medium hover:text-purple-400 transition-colors block truncate"
                            >
                              {actor.name}
                            </a>
                            <p className="text-gray-400 text-sm">{actor.language}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Animeography */}
        {character.animeography && character.animeography.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">Animeography</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {character.animeography.map((anime, index) => (
                <div key={`${anime.id}-${index}`} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
                  <div className="flex">
                    <img
                      src={anime.poster}
                      alt={anime.title}
                      className="w-20 h-28 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-anime.jpg';
                      }}
                    />
                    <div className="p-4 flex-1 min-w-0">
                      <a
                        href={`/anime/${anime.id}`}
                        className="text-white font-medium hover:text-purple-400 transition-colors block truncate mb-1"
                      >
                        {anime.title}
                      </a>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                          {anime.type}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          anime.role === 'Main' 
                            ? 'bg-yellow-600 text-white' 
                            : 'bg-gray-600 text-gray-300'
                        }`}>
                          {anime.role}
                        </span>
                      </div>
                    </div>
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