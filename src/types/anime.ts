export interface Anime {
  id: string;
  data_id?: number;
  title: string;
  japanese_title?: string;
  poster: string;
  image?: string; // Keep for backward compatibility
  releaseDate?: string;
  description?: string;
  subOrDub?: string;
  type?: string;
  status?: string;
  otherName?: string;
  totalEpisodes?: number;
  genres?: string[];
  rating?: number;
  number?: number;
  tvInfo?: {
    showType?: string;
    duration?: string;
    releaseDate?: string;
    quality?: string;
    episodeInfo?: any;
  };
}

export interface Episode {
  id: string;
  number: number;
  title?: string;
  url: string;
}

export interface AnimeInfo extends Anime {
  episodes?: Episode[];
}

export interface SearchResult {
  results: Anime[];
  hasNextPage: boolean;
  currentPage: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// API Response interfaces based on the documentation
export interface HomeApiResponse {
  success: boolean;
  results: {
    spotlights: Anime[];
    trending: Anime[];
    today: {
      schedule: {
        id: string;
        data_id: number;
        title: string;
        japanese_title: string;
        releaseDate: string;
        time: string;
        episode_no: number;
      }[];
    };
    topAiring: Anime[];
    mostPopular: Anime[];
    mostFavorite: Anime[];
    latestCompleted: Anime[];
    latestEpisode: Anime[];
    genres: string[];
  };
}