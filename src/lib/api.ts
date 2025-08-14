import { 
  HomeApiResponse, 
  TopSearchResponse, 
  AnimeInfoResponse, 
  RandomAnimeResponse, 
  CategoryResponse,
  SearchResponse,
  SearchSuggestResponse,
  FilterResponse,
  EpisodesResponse,
  ScheduleResponse,
  NextEpisodeScheduleResponse,
  QtipResponse,
  Anime 
} from '@/types/anime';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://anime-api-backend-c879.onrender.com';

// Generic API fetch function
async function apiRequest<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Home page data
export async function getHomeData(): Promise<HomeApiResponse> {
  return apiRequest<HomeApiResponse>('/api/');
}

// Top search terms
export async function getTopSearch(): Promise<TopSearchResponse> {
  return apiRequest<TopSearchResponse>('/api/top-search');
}

// Get specific anime info
export async function getAnimeInfo(id: string): Promise<AnimeInfoResponse> {
  return apiRequest<AnimeInfoResponse>(`/api/info?id=${encodeURIComponent(id)}`);
}

// Get random anime
export async function getRandomAnime(): Promise<RandomAnimeResponse> {
  return apiRequest<RandomAnimeResponse>('/api/random');
}

// Get anime by category
export async function getCategoryAnime(category: string, page: number = 1): Promise<CategoryResponse> {
  return apiRequest<CategoryResponse>(`/api/${category}?page=${page}`);
}

// Get anime by producer/studio
export async function getProducerAnime(producer: string, page: number = 1): Promise<CategoryResponse> {
  return apiRequest<CategoryResponse>(`/api/producer/${encodeURIComponent(producer)}?page=${page}`);
}

// Utility function to transform API response data to Anime interface
export function transformApiAnimeToAnime(apiAnime: any): Anime {
  return {
    id: apiAnime.id,
    data_id: apiAnime.data_id,
    title: apiAnime.title,
    japanese_title: apiAnime.japanese_title,
    poster: apiAnime.poster,
    image: apiAnime.poster, // For backward compatibility
    description: apiAnime.description,
    showType: apiAnime.showType,
    adultContent: apiAnime.adultContent,
    tvInfo: apiAnime.tvInfo,
    // Map additional fields if they exist
    genres: apiAnime.genres,
    rating: apiAnime.rating,
    status: apiAnime.status,
    totalEpisodes: apiAnime.tvInfo?.eps || apiAnime.totalEpisodes,
  };
}

// Transform detailed anime info to Anime interface
export function transformDetailedAnimeToAnime(detailedAnime: AnimeInfoResponse['results']['data']): Anime {
  return {
    id: detailedAnime.id,
    data_id: detailedAnime.data_id,
    title: detailedAnime.title,
    japanese_title: detailedAnime.japanese_title,
    poster: detailedAnime.poster,
    image: detailedAnime.poster,
    showType: detailedAnime.showType,
    adultContent: detailedAnime.adultContent,
    description: detailedAnime.animeInfo.Overview,
    status: detailedAnime.animeInfo.Status,
    genres: Array.isArray(detailedAnime.animeInfo.Genres) 
      ? detailedAnime.animeInfo.Genres 
      : typeof detailedAnime.animeInfo.Genres === 'string' 
        ? [detailedAnime.animeInfo.Genres] 
        : [],
    rating: detailedAnime.animeInfo["MAL Score"] 
      ? parseFloat(detailedAnime.animeInfo["MAL Score"]) 
      : undefined,
    tvInfo: {
      duration: detailedAnime.animeInfo.Duration,
      showType: detailedAnime.showType,
    }
  };
}

// Search anime
export async function searchAnime(keyword: string): Promise<SearchResponse> {
  return apiRequest<SearchResponse>(`/api/search?keyword=${encodeURIComponent(keyword)}`);
}

// Get search suggestions
export async function getSearchSuggestions(keyword: string): Promise<SearchSuggestResponse> {
  return apiRequest<SearchSuggestResponse>(`/api/search/suggest?keyword=${encodeURIComponent(keyword)}`);
}

// Filter anime with advanced options
export async function filterAnime(params: {
  type?: string;
  status?: string;
  rated?: string;
  score?: string;
  season?: string;
  language?: string;
  genres?: string;
  sort?: string;
  page?: number;
  sy?: number; // start year
  sm?: number; // start month
  sd?: number; // start day
  ey?: number; // end year
  em?: number; // end month
  ed?: number; // end day
  keyword?: string;
}): Promise<FilterResponse> {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });
  
  return apiRequest<FilterResponse>(`/api/filter?${searchParams.toString()}`);
}

// Get anime episodes
export async function getAnimeEpisodes(animeId: string): Promise<EpisodesResponse> {
  return apiRequest<EpisodesResponse>(`/api/episodes/${encodeURIComponent(animeId)}`);
}

// Get schedule for a specific date
export async function getSchedule(date: string): Promise<ScheduleResponse> {
  return apiRequest<ScheduleResponse>(`/api/schedule?date=${encodeURIComponent(date)}`);
}

// Get next episode schedule for specific anime
export async function getNextEpisodeSchedule(animeId: string): Promise<NextEpisodeScheduleResponse> {
  return apiRequest<NextEpisodeScheduleResponse>(`/api/schedule/${encodeURIComponent(animeId)}`);
}

// Get qtip info
export async function getQtipInfo(id: number): Promise<QtipResponse> {
  return apiRequest<QtipResponse>(`/api/qtip/${id}`);
}

// Transform search result to Anime interface
export function transformSearchResultToAnime(searchResult: SearchResponse['results'][0]): Anime {
  return {
    id: searchResult.id,
    data_id: searchResult.data_id,
    title: searchResult.title,
    japanese_title: searchResult.japanese_title,
    poster: searchResult.poster,
    image: searchResult.poster,
    tvInfo: searchResult.tvInfo,
  };
}

// Transform search suggestion to Anime interface
export function transformSearchSuggestionToAnime(suggestion: SearchSuggestResponse['results'][0]): Anime {
  return {
    id: suggestion.id,
    data_id: suggestion.data_id,
    title: suggestion.title,
    japanese_title: suggestion.japanese_title,
    poster: suggestion.poster,
    image: suggestion.poster,
    releaseDate: suggestion.releaseDate,
    showType: suggestion.showType,
    tvInfo: {
      duration: suggestion.duration,
      showType: suggestion.showType,
    },
  };
}

// Available categories for easy reference
export const CATEGORIES = {
  // Status categories
  TOP_AIRING: 'top-airing',
  MOST_POPULAR: 'most-popular',
  MOST_FAVORITE: 'most-favorite',
  COMPLETED: 'completed',
  RECENTLY_UPDATED: 'recently-updated',
  RECENTLY_ADDED: 'recently-added',
  TOP_UPCOMING: 'top-upcoming',
  
  // Type categories
  SUBBED_ANIME: 'subbed-anime',
  DUBBED_ANIME: 'dubbed-anime',
  MOVIE: 'movie',
  SPECIAL: 'special',
  OVA: 'ova',
  ONA: 'ona',
  TV: 'tv',
  
  // Genres
  GENRES: {
    ACTION: 'genre/action',
    ADVENTURE: 'genre/adventure',
    CARS: 'genre/cars',
    COMEDY: 'genre/comedy',
    DEMENTIA: 'genre/dementia',
    DEMONS: 'genre/demons',
    DRAMA: 'genre/drama',
    ECCHI: 'genre/ecchi',
    FANTASY: 'genre/fantasy',
    GAME: 'genre/game',
    HAREM: 'genre/harem',
    HISTORICAL: 'genre/historical',
    HORROR: 'genre/horror',
    ISEKAI: 'genre/isekai',
    JOSEI: 'genre/josei',
    KIDS: 'genre/kids',
    MAGIC: 'genre/magic',
    MARTIAL_ARTS: 'genre/martial-arts',
    MECHA: 'genre/mecha',
    MILITARY: 'genre/military',
    MUSIC: 'genre/music',
    MYSTERY: 'genre/mystery',
    PARODY: 'genre/parody',
    POLICE: 'genre/police',
    PSYCHOLOGICAL: 'genre/psychological',
    ROMANCE: 'genre/romance',
    SAMURAI: 'genre/samurai',
    SCHOOL: 'genre/school',
    SCI_FI: 'genre/sci-fi',
    SEINEN: 'genre/seinen',
    SHOUJO: 'genre/shoujo',
    SHOUJO_AI: 'genre/shoujo-ai',
    SHOUNEN: 'genre/shounen',
    SHOUNEN_AI: 'genre/shounen-ai',
    SLICE_OF_LIFE: 'genre/slice-of-life',
    SPACE: 'genre/space',
    SPORTS: 'genre/sports',
    SUPER_POWER: 'genre/super-power',
    SUPERNATURAL: 'genre/supernatural',
    THRILLER: 'genre/thriller',
    VAMPIRE: 'genre/vampire',
  },
  
  // A-Z List
  AZ_LIST: {
    ALL: 'az-list',
    OTHER: 'az-list/other',
    NUMBERS: 'az-list/0-9',
    A: 'az-list/a',
    B: 'az-list/b',
    C: 'az-list/c',
    D: 'az-list/d',
    E: 'az-list/e',
    F: 'az-list/f',
    G: 'az-list/g',
    H: 'az-list/h',
    I: 'az-list/i',
    J: 'az-list/j',
    K: 'az-list/k',
    L: 'az-list/l',
    M: 'az-list/m',
    N: 'az-list/n',
    O: 'az-list/o',
    P: 'az-list/p',
    Q: 'az-list/q',
    R: 'az-list/r',
    S: 'az-list/s',
    T: 'az-list/t',
    U: 'az-list/u',
    V: 'az-list/v',
    W: 'az-list/w',
    X: 'az-list/x',
    Y: 'az-list/y',
    Z: 'az-list/z',
  }
} as const;