import { all } from "axios";
import tmdb, { API_KEY } from "./tmdb";
import { BASE_URL }  from "./tmdb"
import axios from "axios";
import { getTopGenres } from "./supabasefunctions";

interface Genre {
  id: number;
  name: string;
}

export const fetchPopularMovies = async () => {
  let allMovies: any = [];
  for (let page = 1; page <= 5; page++) { // Fetch first 2 pages (40 movies)
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    const data = await response.json();
    allMovies = [...allMovies, ...data.results];
  }
  return allMovies; // Returns 40 movies
};

export const getMovieDetails = async (movieId: string) => {
  try {
    const response = await tmdb.get(`/movie/${movieId}?language=en-US`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};

export const getFavoriteMovies = async (movieIds: number[]) => {
  try {
    const requests = movieIds.map(id =>
      tmdb.get(`/movie/${id}?language=en-US`).then(response => response.data)
    );
    return await Promise.all(requests);
  } catch (error) {
    console.error("Error fetching multiple movies:", error);
    return [];
  }
};

interface Genre {
  id: number;
  name: string;
}

export const getGenreIdByName = async (genreName: string): Promise<number | null> => {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const genre = data.genres.find((g: Genre) => g.name.toLowerCase() === genreName.toLowerCase());
    return genre ? genre.id : null;
  } catch (error) {
    console.error('Error fetching genre list:', error);
    return null;
  }
};

export const fetchByCategory = async (genre: string): Promise<Movie[]> => {
  try {
    // First, get the genre ID
    const genreId = await getGenreIdByName(genre);
   
    if (!genreId) {
      console.error(`No genre ID found for: ${genre}`);
      return [];
    }
    let allMovies: Movie[] = [];
    for (let page = 1; page <= 5; page++) {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`
      );
     
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
     
      const data = await response.json();
     
      // Filter out movies without poster paths
      const moviesWithPosters = data.results.filter((movie: Movie) =>
        movie.poster_path && movie.id && movie.title
      );
     
      allMovies = [...allMovies, ...moviesWithPosters];
    }
    console.log(`Fetched ${allMovies.length} movies for genre: ${genre}`);
    return allMovies;
  } catch (error) {
    console.error('Error fetching movies by category:', error);
    return [];
  }
};

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
}

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: query,
        include_adult: false,
        language: 'en-US'
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export async function getMovieGenre(movieId: string): Promise<{
  success: boolean;
  genreIds: number[];
  error?: string;
}> {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: {
        api_key: API_KEY,
        language: 'en-US'
      }
    });
    
    const genreIds = response.data.genres.map((genre: { id: number }) => genre.id);
    
    return {
      success: true,
      genreIds: genreIds
    };
  } catch (error) {
    console.error('Error fetching movie genres:', error);
    return {
      success: false,
      genreIds: [],
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

export async function getMovieRecommendations() {
  const BASE_URL = 'https://api.themoviedb.org/3';
  const totalPages = 5;
  let allMovies: any = [];

  try {
    const topGenres = await getTopGenres();
    if (topGenres.length === 0) return [];

    const genreParams = topGenres.join('|');
    for (let page = 1; page <= totalPages; page++) {
      const response = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&with_genres=${genreParams}&page=${page}&language=en-US&include_adult=false&vote_count.gte=50`
      );
      const data = await response.json();
      allMovies = [...allMovies, ...data.results];
    }

    return allMovies;
  } catch (error) {
    console.error('Error fetching movie recommendations:', error);
    return [];
  }
}
