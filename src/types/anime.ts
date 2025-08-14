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
  showType?: string;
  adultContent?: boolean;
  tvInfo?: {
    showType?: string;
    duration?: string;
    releaseDate?: string;
    quality?: string;
    episodeInfo?: any;
    sub?: number;
    dub?: number;
    eps?: number;
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

// Top Search API Response
export interface TopSearchResponse {
  success: boolean;
  results: {
    title: string;
    link: string;
  }[];
}

// Detailed Anime Info API Response
export interface AnimeInfoResponse {
  success: boolean;
  results: {
    data: {
      adultContent: boolean;
      id: string;
      data_id: number;
      title: string;
      japanese_title: string;
      poster: string;
      showType: string;
      animeInfo: {
        Overview: string;
        Japanese: string;
        Synonyms: string;
        Aired: string;
        Premiered: string;
        Duration: string;
        Status: string;
        "MAL Score": string;
        Genres: any;
        Studios: string;
        Producers: any;
      };
    };
    seasons: {
      id: string;
      data_number: number;
      data_id: number;
      season: string;
      title: string;
      japanese_title: string;
      season_poster: string;
    }[];
  };
}

// Random Anime API Response
export interface RandomAnimeResponse {
  success: boolean;
  results: {
    data: {
      adultContent: boolean;
      id: string;
      data_id: number;
      title: string;
      japanese_title: string;
      poster: string;
      showType: string;
      animeInfo: {
        Overview: string;
        Japanese: string;
        Synonyms: string;
        Aired: string;
        Premiered: string;
        Duration: string;
        Status: string;
        "MAL Score": string;
        Genres: any;
        Studios: string;
        Producers: any;
      };
    };
    related_data: {
      duration: string;
      data_id: number;
      id: string;
      title: string;
      japanese_title: string;
      poster: string;
      tvInfo: {
        dub: number;
        sub: number;
        showType: string;
        eps: number;
      };
    }[][];
    recommended_data: {
      duration: string;
      data_id: number;
      id: string;
      title: string;
      japanese_title: string;
      poster: string;
      tvInfo: {
        dub: number;
        sub: number;
        showType: string;
        eps: number;
      };
    }[][];
    seasons: {
      id: string;
      data_number: number;
      data_id: number;
      season: string;
      title: string;
      japanese_title: string;
      season_poster: string;
    }[];
  };
}

// Category/Producer API Response
export interface CategoryResponse {
  success: boolean;
  results: {
    totalPages: number;
    data: {
      id: string;
      data_id: number;
      poster: string;
      title: string;
      japanese_title: string;
      description: string;
      tvInfo: {
        showType: string;
        duration: string;
        sub: number;
        dub: number;
        eps?: number;
      };
      adultContent: boolean;
    }[];
  };
}

// Search API Response
export interface SearchResponse {
  success: boolean;
  results: {
    id: string;
    data_id: number;
    poster: string;
    title: string;
    japanese_title: string;
    tvInfo: any;
  }[];
}

// Search Suggestions API Response
export interface SearchSuggestResponse {
  success: boolean;
  results: {
    id: string;
    data_id: number;
    poster: string;
    title: string;
    japanese_title: string;
    releaseDate: string;
    showType: string;
    duration: string;
  }[];
}

// Filter API Response (same as CategoryResponse)
export interface FilterResponse extends CategoryResponse {}

// Episodes API Response
export interface EpisodesResponse {
  success: boolean;
  results: {
    totalEpisodes: number;
    episodes: {
      episode_no: number;
      id: string;
      data_id: number;
      jname: string;
      title: string;
      japanese_title: string;
    }[];
  };
}

// Schedule API Response
export interface ScheduleResponse {
  success: boolean;
  results: {
    id: string;
    data_id: number;
    title: string;
    japanese_title: string;
    releaseDate: string;
    time: string;
    episode_no: number;
  }[];
}

// Next Episode Schedule API Response
export interface NextEpisodeScheduleResponse {
  success: boolean;
  results: {
    nextEpisodeSchedule: string;
  };
}

// Qtip API Response
export interface QtipResponse {
  success: boolean;
  results: {
    title: string;
    rating: number;
    quality: string;
    subCount: number;
    dubCount: number;
    episodeCount: number;
    type: string;
    description: string;
    japaneseTitle: string;
    Synonyms: string;
    airedDate: string;
    status: string;
    genres: any;
    watchLink: string;
  };
}

// Characters List API Response
export interface CharactersListResponse {
  success: boolean;
  results: {
    currentPage: number;
    totalPages: number;
    data: {
      character: {
        id: string;
        poster: string;
        name: string;
        cast: string;
      };
      voiceActors: {
        id: string;
        poster: string;
        name: string;
      }[];
    }[];
  };
}

// Streaming API Response
export interface StreamingResponse {
  success: boolean;
  results: {
    streamingLink: {
      id: number;
      type: string;
      link: {
        file: string;
        type: string;
      };
      tracks: {
        file: string;
        label: string;
        kind: string;
        default: boolean;
      }[];
      intro: any;
      outro: any;
      server: string;
    }[];
    servers: {
      type: string;
      data_id: number;
      server_id: number;
      server_name: string;
    }[];
  };
}

// Servers API Response
export interface ServersResponse {
  success: boolean;
  results: {
    type: string;
    data_id: number;
    server_id: number;
    serverName: string;
  }[];
}

// Character Details API Response
export interface CharacterDetailsResponse {
  success: boolean;
  results: {
    data: {
      id: string;
      name: string;
      profile: string;
      japaneseName: string;
      about: {
        description: string;
        style: string;
      };
      voiceActors: {
        name: string;
        profile: string;
        language: string;
        id: string;
      }[];
      animeography: {
        title: string;
        id: string;
        role: string;
        type: string;
        poster: string;
      }[];
    }[];
  };
}

// Voice Actor Details API Response
export interface VoiceActorDetailsResponse {
  success: boolean;
  results: {
    data: {
      id: string;
      name: string;
      profile: string;
      japaneseName: string;
      about: {
        description: string;
        style: string;
      };
      roles: {
        anime: {
          title: string;
          poster: string;
          type: string;
          year: string;
          id: string;
        };
        character: {
          name: string;
          profile: string;
          role: string;
        };
      }[];
    }[];
  };
}