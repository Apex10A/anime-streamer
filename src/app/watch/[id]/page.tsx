'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { StreamingResponse, ServersResponse, AnimeInfoResponse, EpisodesResponse } from '@/types/anime';
import { getStreamingInfo, getServers, getAnimeInfo, getAnimeEpisodes } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VideoPlayer from '@/components/VideoPlayer';

export default function WatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const episodeId = params.id as string;
  const server = searchParams.get('server') || 'hd-1';
  const type = searchParams.get('type') || 'sub';
  const animeId = searchParams.get('anime') || '';
  
  const [streamingData, setStreamingData] = useState<StreamingResponse | null>(null);
  const [serversData, setServersData] = useState<ServersResponse | null>(null);
  const [animeInfo, setAnimeInfo] = useState<AnimeInfoResponse | null>(null);
  const [episodes, setEpisodes] = useState<EpisodesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState(server);
  const [selectedType, setSelectedType] = useState(type);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch anime info and episodes
  useEffect(() => {
    const fetchAnimeData = async () => {
      if (!animeId) return;
      
      try {
        const [animeData, episodesData] = await Promise.all([
          getAnimeInfo(animeId),
          getAnimeEpisodes(animeId)
        ]);
        setAnimeInfo(animeData);
        setEpisodes(episodesData);
        
        // Find current episode index
        if (episodesData?.results?.episodes) {
          const index = episodesData.results.episodes.findIndex(ep => ep.id === episodeId);
          setCurrentEpisodeIndex(index >= 0 ? index : 0);
        }
      } catch (err) {
        console.error('Failed to fetch anime data:', err);
      }
    };

    fetchAnimeData();
  }, [animeId, episodeId]);

  // Fetch servers
  useEffect(() => {
    const fetchServers = async () => {
      if (!episodeId) return;
      
      try {
        const data = await getServers(episodeId);
        setServersData(data);
      } catch (err) {
        console.error('Failed to fetch servers:', err);
      }
    };

    fetchServers();
  }, [episodeId]);

  // Fetch streaming info
  useEffect(() => {
    const fetchStreamingInfo = async () => {
      if (!episodeId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getStreamingInfo({
          id: episodeId,
          server: selectedServer,
          type: selectedType
        });
        setStreamingData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch streaming info');
      } finally {
        setLoading(false);
      }
    };

    fetchStreamingInfo();
  }, [episodeId, selectedServer, selectedType]);

  // Update document title
  useEffect(() => {
    if (animeInfo && episodes) {
      const currentEpisode = episodes.results?.episodes?.[currentEpisodeIndex];
      const episodeNum = currentEpisode?.episode_no || '';
      document.title = `Watch ${animeInfo.results.title} Episode ${episodeNum} - Luffy`;
    }
    return () => {
      document.title = 'Luffy - Watch Anime Online';
    };
  }, [animeInfo, episodes, currentEpisodeIndex]);

  const handleServerChange = (newServer: string, newType: string) => {
    setSelectedServer(newServer);
    setSelectedType(newType);
    
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('server', newServer);
    url.searchParams.set('type', newType);
    window.history.pushState({}, '', url.toString());
  };

  const handleEpisodeChange = (newEpisodeId: string) => {
    const newUrl = `/watch/${newEpisodeId}?anime=${animeId}&server=${selectedServer}&type=${selectedType}`;
    router.push(newUrl);
  };

  const playNextEpisode = () => {
    if (episodes?.results?.episodes && currentEpisodeIndex < episodes.results.episodes.length - 1) {
      const nextEpisode = episodes.results.episodes[currentEpisodeIndex + 1];
      handleEpisodeChange(nextEpisode.id);
    }
  };

  const playPreviousEpisode = () => {
    if (episodes?.results?.episodes && currentEpisodeIndex > 0) {
      const prevEpisode = episodes.results.episodes[currentEpisodeIndex - 1];
      handleEpisodeChange(prevEpisode.id);
    }
  };

  const currentEpisode = episodes?.results?.episodes?.[currentEpisodeIndex];
  const hasNextEpisode = episodes?.results?.episodes && currentEpisodeIndex < episodes.results.episodes.length - 1;
  const hasPreviousEpisode = currentEpisodeIndex > 0;

  const streamingLink = streamingData?.results?.streamingLink?.[0];
  const availableServers = serversData?.results || streamingData?.results?.servers || [];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      {/* Background with anime poster */}
      <div className="relative w-full">
        {animeInfo?.results?.poster && (
          <>
            <img
              src={animeInfo.results.poster}
              alt={`${animeInfo.results.title} Poster`}
              className="absolute inset-0 w-full h-full object-cover filter grayscale opacity-20"
            />
            <div className="absolute inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm"></div>
          </>
        )}
        
        <div className="relative z-10 pt-20">
          {/* Breadcrumb */}
          {animeInfo && (
            <div className="container mx-auto px-4 py-4">
              <nav className="flex items-center space-x-2 text-sm">
                <a href="/" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Home
                </a>
                <span className="text-gray-400">•</span>
                <a 
                  href={`/anime/${animeId}`} 
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {animeInfo.results.title}
                </a>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">
                  Episode {currentEpisode?.episode_no || ''}
                </span>
              </nav>
            </div>
          )}

          {/* Main Content */}
          <div className="container mx-auto px-4 pb-16">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Video Player - Takes 3/4 width on xl screens */}
              <div className="xl:col-span-3">
                <div className="bg-black rounded-lg overflow-hidden mb-6">
                  {loading ? (
                    <div className="aspect-video flex items-center justify-center bg-gray-800">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    </div>
                  ) : error ? (
                    <div className="aspect-video flex flex-col items-center justify-center bg-gray-800 text-center p-8">
                      <svg className="w-16 h-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-white text-lg font-semibold mb-2">Error Loading Video</h3>
                      <p className="text-gray-400 mb-4">{error}</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : !streamingLink ? (
                    <div className="aspect-video flex flex-col items-center justify-center bg-gray-800 text-center p-8">
                      <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <h3 className="text-white text-lg font-semibold mb-2">Video Not Available</h3>
                      <p className="text-gray-400">
                        {availableServers.length > 0 
                          ? 'Try switching to a different server or type'
                          : 'No streaming servers available for this episode'
                        }
                      </p>
                    </div>
                  ) : (
                    <VideoPlayer
                      src={streamingLink.link.file}
                      type={streamingLink.link.type || 'video/mp4'}
                      poster={animeInfo?.results?.poster}
                      tracks={streamingLink.tracks || []}
                      intro={streamingLink.intro}
                      outro={streamingLink.outro}
                      autoPlay={true}
                      onEnded={playNextEpisode}
                      className="aspect-video"
                    />
                  )}
                </div>

                {/* Episode Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={playPreviousEpisode}
                    disabled={!hasPreviousEpisode}
                    className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous Episode
                  </button>

                  <div className="text-center">
                    <h2 className="text-white text-lg font-semibold">
                      Episode {currentEpisode?.episode_no || ''}
                    </h2>
                    {currentEpisode?.title && (
                      <p className="text-gray-400 text-sm">{currentEpisode.title}</p>
                    )}
                  </div>

                  <button
                    onClick={playNextEpisode}
                    disabled={!hasNextEpisode}
                    className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
                  >
                    Next Episode
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Server Selection */}
                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Servers & Quality</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Server Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Server</label>
                      <div className="flex flex-wrap gap-2">
                        {availableServers
                          .filter((server, index, self) => 
                            index === self.findIndex(s => (s.server_name || s.serverName) === (server.server_name || server.serverName))
                          )
                          .map((server, index) => {
                            const serverName = server.server_name || server.serverName || `Server ${index + 1}`;
                            const isSelected = selectedServer === serverName;
                            
                            return (
                              <button
                                key={`${server.server_id || server.data_id}-${index}`}
                                onClick={() => handleServerChange(serverName, selectedType)}
                                className={`px-3 py-2 rounded text-sm transition-colors ${
                                  isSelected
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                              >
                                {serverName}
                              </button>
                            );
                          })}
                      </div>
                    </div>

                    {/* Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Audio</label>
                      <div className="flex gap-2">
                        {['sub', 'dub'].map((typeOption) => {
                          const isAvailable = availableServers.some(server => server.type === typeOption);
                          const isSelected = selectedType === typeOption;
                          
                          return (
                            <button
                              key={typeOption}
                              onClick={() => handleServerChange(selectedServer, typeOption)}
                              disabled={!isAvailable}
                              className={`px-4 py-2 rounded text-sm transition-colors ${
                                isSelected
                                  ? 'bg-purple-600 text-white'
                                  : isAvailable
                                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              {typeOption === 'sub' ? 'Subtitled' : 'Dubbed'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Episode List Sidebar - Takes 1/4 width on xl screens */}
              <div className="xl:col-span-1">
                <div className="bg-gray-800 rounded-lg p-4 max-h-[600px] overflow-y-auto">
                  <h3 className="text-lg font-semibold text-white mb-4">Episodes</h3>
                  
                  {!episodes ? (
                    <div className="space-y-2">
                      {Array.from({ length: 12 }).map((_, index) => (
                        <div key={index} className="bg-gray-700 rounded p-3 animate-pulse">
                          <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {episodes.results?.episodes?.map((episode, index) => (
                        <button
                          key={episode.id}
                          onClick={() => handleEpisodeChange(episode.id)}
                          className={`w-full text-left p-3 rounded transition-colors ${
                            episode.id === episodeId
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Episode {episode.episode_no}</span>
                            {episode.id === episodeId && (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          {episode.title && (
                            <p className="text-sm text-gray-400 mt-1 truncate">{episode.title}</p>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}