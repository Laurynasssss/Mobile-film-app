import {
    fetchPopularMovies,
    getMovieDetails,
    getFavoriteMovies,
    getGenreIdByName,
    fetchByCategory,
    searchMovies,
    getMovieGenre,
    getMovieRecommendations,
  } from '@/lib/tmdbfunctions';
  import axios from 'axios';
  import fetch from 'jest-fetch-mock';
  import { getTopGenres } from '@/lib/supabasefunctions';
  
  import * as movieService from '@/lib/tmdbfunctions';

  test('debug import works', () => {
    console.log('🎯 movieService keys:', Object.keys(movieService));
  });

  jest.mock('axios');
  jest.mock('@/lib/supabasefunctions', () => ({
    getTopGenres: jest.fn(),
  }));
  
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const mockedGetTopGenres = getTopGenres as jest.Mock;
  
  beforeEach(() => {
    fetch.resetMocks();
  });
  
  describe('Movie Service', () => {
    it('fetchPopularMovies should return 100 movies', async () => {
      const mockMovies = Array.from({ length: 20 }, (_, i) => ({ id: i, title: `Movie ${i}` }));
      fetch.mockResponse(JSON.stringify({ results: mockMovies }));
      const result = await fetchPopularMovies();
      expect(result).toHaveLength(100); // 20 per page x 5 pages
    });
  
    it('getMovieDetails should return movie data', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { id: 1, title: 'Test Movie' } });
      const result = await getMovieDetails('1');
      expect(result).toEqual({ id: 1, title: 'Test Movie' });
    });
  
    it('getMovieDetails should return null on error', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Error'));
      const result = await getMovieDetails('1');
      expect(result).toBeNull();
    });
  
    it('getFavoriteMovies should return array of movies', async () => {
      mockedAxios.get.mockResolvedValue({ data: { id: 1, title: 'Fav Movie' } });
      const result = await getFavoriteMovies([1, 2]);
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Fav Movie');
    });
  
    it('getFavoriteMovies should return empty array on error', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Error'));
      const result = await getFavoriteMovies([1]);
      expect(result).toEqual([]);
    });
  
    it('getGenreIdByName should return genre ID', async () => {
      const genres = [{ id: 10, name: 'Action' }];
      fetch.mockResponseOnce(JSON.stringify({ genres }));
      const genreId = await getGenreIdByName('Action');
      expect(genreId).toBe(10);
    });
  
    it('getGenreIdByName should return null if genre not found', async () => {
      fetch.mockResponseOnce(JSON.stringify({ genres: [] }));
      const genreId = await getGenreIdByName('Drama');
      expect(genreId).toBeNull();
    });
  
    it('fetchByCategory should return filtered movies with poster', async () => {
      const mockResults = [
        { id: 1, title: 'Movie A', poster_path: '/img.jpg' },
        { id: 2, title: 'Movie B', poster_path: null }, // filtered out
      ];
      fetch.mockResponses(
        [JSON.stringify({ genres: [{ id: 5, name: 'Comedy' }] }), { status: 200 }],
        ...Array(5).fill([JSON.stringify({ results: mockResults }), { status: 200 }])
      );
      const result = await fetchByCategory('Comedy');
      expect(result).toHaveLength(5); // 5 pages × 1 valid movie per page
    });
  
    it('searchMovies should return search results', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { results: [{ id: 1, title: 'Search Result' }] } });
      const result = await searchMovies('Batman');
      expect(result).toEqual([{ id: 1, title: 'Search Result' }]);
    });
  
    it('searchMovies should return empty array on error', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Fail'));
      const result = await searchMovies('Fail');
      expect(result).toEqual([]);
    });
  
    it('getMovieGenre should return genre IDs', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { genres: [{ id: 1 }, { id: 2 }] },
      });
      const result = await getMovieGenre('1');
      expect(result).toEqual({ success: true, genreIds: [1, 2] });
    });
  
    it('getMovieGenre should return failure on error', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Fail'));
      const result = await getMovieGenre('1');
      expect(result.success).toBe(false);
      expect(result.genreIds).toEqual([]);
    });
  
    it('getMovieRecommendations should return recommended movies', async () => {
      mockedGetTopGenres.mockResolvedValueOnce([28, 12]); // action, adventure
      const mockMovies = Array.from({ length: 20 }, (_, i) => ({ id: i, title: `Movie ${i}` }));
      fetch.mockResponse(JSON.stringify({ results: mockMovies }));
      const result = await getMovieRecommendations();
      expect(result.length).toBe(100); // 20 per page * 5
    });
  
    it('getMovieRecommendations should return empty on no genres', async () => {
      mockedGetTopGenres.mockResolvedValueOnce([]);
      const result = await getMovieRecommendations();
      expect(result).toEqual([]);
    });
  });
  