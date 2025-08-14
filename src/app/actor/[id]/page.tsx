'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { VoiceActorDetailsResponse } from '@/types/anime';
import { getVoiceActorDetails } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function VoiceActorDetailPage() {
  const params = useParams();
  const actorId = params.id as string;
  
  const [actorData, setActorData] = useState<VoiceActorDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActorDetails = async () => {
      if (!actorId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getVoiceActorDetails(actorId);
        setActorData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch voice actor details');
      } finally {
        setLoading(false);
      }
    };

    fetchActorDetails();
  }, [actorId]);

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
            <h2 className="text-xl font-semibold text-white mb-2">Error Loading Voice Actor</h2>
            <p className="text-gray-400">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!actorData?.results?.data || actorData.results.data.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-white mb-2">Voice Actor Not Found</h2>
            <p className="text-gray-400">The requested voice actor could not be found.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const actor = actorData.results.data[0];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Actor Info */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Profile Image */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <img
                src={actor.profile}
                alt={actor.name}
                className="w-full max-w-sm mx-auto lg:mx-0 rounded-lg shadow-2xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-actor.jpg';
                }}
              />
            </div>
          </div>

          {/* Actor Details */}
          <div className="lg:w-2/3">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{actor.name}</h1>
                {actor.japaneseName && actor.japaneseName !== actor.name && (
                  <h2 className="text-xl text-gray-300">{actor.japaneseName}</h2>
                )}
              </div>

              {/* About */}
              {actor.about?.description && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                  <div 
                    className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: actor.about.style || actor.about.description 
                    }}
                  />
                </div>
              )}

              {/* Stats */}
              {actor.roles && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Career Stats</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-purple-400">{actor.roles.length}</div>
                      <div className="text-gray-400 text-sm">Total Roles</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-400">
                        {new Set(actor.roles.map(role => role.anime.id)).size}
                      </div>
                      <div className="text-gray-400 text-sm">Unique Anime</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Roles */}
        {actor.roles && actor.roles.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">Notable Roles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {actor.roles.map((role, index) => (
                <div key={`${role.anime.id}-${index}`} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
                  <div className="flex">
                    <img
                      src={role.anime.poster}
                      alt={role.anime.title}
                      className="w-20 h-28 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-anime.jpg';
                      }}
                    />
                    <div className="p-4 flex-1 min-w-0">
                      <a
                        href={`/anime/${role.anime.id}`}
                        className="text-white font-medium hover:text-purple-400 transition-colors block truncate mb-1"
                      >
                        {role.anime.title}
                      </a>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                          {role.anime.type}
                        </span>
                        <span className="text-xs">{role.anime.year}</span>
                      </div>
                      <div className="border-t border-gray-700 pt-2 mt-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={role.character.profile}
                            alt={role.character.name}
                            className="w-8 h-8 object-cover rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-character.jpg';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                              {role.character.name}
                            </p>
                            <p className={`text-xs ${
                              role.character.role === 'Main' 
                                ? 'text-yellow-400' 
                                : 'text-gray-400'
                            }`}>
                              {role.character.role}
                            </p>
                          </div>
                        </div>
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