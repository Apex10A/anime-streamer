'use client';

import { useRef, useEffect, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  type?: string;
  poster?: string;
  tracks?: {
    file: string;
    label: string;
    kind: string;
    default: boolean;
  }[];
  intro?: any;
  outro?: any;
  autoPlay?: boolean;
  onEnded?: () => void;
  className?: string;
}

export default function VideoPlayer({
  src,
  type = 'video/mp4',
  poster,
  tracks = [],
  intro,
  outro,
  autoPlay = true,
  onEnded,
  className = ''
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setIsLoading(false);
      setError('Failed to load video');
    };
    const handleEnded = () => {
      if (onEnded) onEnded();
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onEnded]);

  // Handle intro/outro skipping (placeholder for future implementation)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !intro) return;

    const handleTimeUpdate = () => {
      // Skip intro logic could be implemented here
      // if (video.currentTime >= intro.start && video.currentTime <= intro.end) {
      //   video.currentTime = intro.end;
      // }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [intro]);

  if (error) {
    return (
      <div className={`bg-gray-800 flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-white text-lg font-semibold mb-2">Video Error</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-black ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-white">Loading video...</p>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        controls
        className="w-full h-full"
        poster={poster}
        preload="metadata"
        autoPlay={autoPlay}
        playsInline
      >
        <source src={src} type={type} />
        
        {/* Subtitles */}
        {tracks.map((track, index) => (
          <track
            key={index}
            kind={track.kind}
            src={track.file}
            srcLang={track.label.toLowerCase().replace(/\s+/g, '-')}
            label={track.label}
            default={track.default}
          />
        ))}
        
        Your browser does not support the video tag.
      </video>

      {/* Skip Intro Button (placeholder for future implementation) */}
      {intro && (
        <button
          className="absolute bottom-20 right-4 bg-gray-800 bg-opacity-80 text-white px-4 py-2 rounded-lg hover:bg-opacity-100 transition-opacity"
          onClick={() => {
            if (videoRef.current && intro.end) {
              videoRef.current.currentTime = intro.end;
            }
          }}
        >
          Skip Intro
        </button>
      )}
    </div>
  );
}