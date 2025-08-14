'use client';

import { useEffect, useState } from 'react';
import { ScheduleResponse } from '@/types/anime';
import { getSchedule } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkeletonLoader from '@/components/SkeletonLoader';

export default function SchedulePage() {
  const [scheduleData, setScheduleData] = useState<ScheduleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    if (!timeString) return 'TBA';
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeString;
    }
  };

  const fetchSchedule = async (date: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSchedule(date);
      setScheduleData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = getTodayDate();
    setSelectedDate(today);
    fetchSchedule(today);
  }, []);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    fetchSchedule(date);
  };

  // Generate date options for the next 7 days
  const getDateOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const displayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      options.push({ value: dateString, label: displayName });
    }
    
    return options;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Anime Schedule</h1>
          
          {/* Date Selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            {getDateOptions().map((option) => (
              <button
                key={option.value}
                onClick={() => handleDateChange(option.value)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedDate === option.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Custom Date Input */}
          <div className="flex items-center gap-4 mb-4">
            <label htmlFor="custom-date" className="text-gray-400">
              Or select a custom date:
            </label>
            <input
              id="custom-date"
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {selectedDate && (
            <p className="text-gray-400">
              Schedule for {formatDateForDisplay(selectedDate)}
            </p>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                <div className="flex items-center gap-4">
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
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Error Loading Schedule</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => fetchSchedule(selectedDate)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : !scheduleData?.results || scheduleData.results.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No Episodes Scheduled</h2>
            <p className="text-gray-400">No anime episodes are scheduled for this date</p>
          </div>
        ) : (
          <div className="space-y-4">
            {scheduleData.results.map((episode) => (
              <div key={`${episode.id}-${episode.episode_no}`} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Episode Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {episode.title}
                        </h3>
                        {episode.japanese_title && episode.japanese_title !== episode.title && (
                          <p className="text-gray-400 text-sm mb-2">{episode.japanese_title}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-purple-400 font-semibold">
                          Episode {episode.episode_no}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {formatTime(episode.time)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {episode.releaseDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(episode.time)}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    <a
                      href={`/anime/${episode.id}`}
                      className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                    >
                      View Anime
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}