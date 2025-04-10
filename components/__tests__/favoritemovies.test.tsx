import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import FavoriteMoviesList from '@/app/(tabs)/SavedMovies';
import { getSavedMovies } from '@/lib/supabasefunctions';

// Mock the external dependencies
jest.mock('@/lib/supabasefunctions', () => ({
  getSavedMovies: jest.fn(),
  getFavoriteMovies: jest.fn(),
}));

// Simple mock for expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock the problematic components with simple replacements
jest.mock('@rneui/themed', () => ({
  Button: ({ title, onPress, disabled }: any) => (
    <button onClick={onPress} disabled={disabled}>{title}</button>
  ),
}));

jest.mock('expo-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');

describe('FavoriteMoviesList', () => {
  const mockMovies = [
    {
      id: 1,
      title: 'Movie 1',
      poster_path: '/poster1.jpg',
      vote_average: 8.5,
    },
    {
      id: 2,
      title: 'Movie 2',
      poster_path: '/poster2.jpg',
      vote_average: 7.0,
    },
  ];

  beforeEach(() => {
    (getSavedMovies as jest.Mock).mockResolvedValue({
      success: true,
      data: [1, 2],
    });
    (getSavedMovies as jest.Mock).mockResolvedValue(mockMovies);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('loads and displays movies', async () => {
    render(<FavoriteMoviesList />);
    
    await waitFor(() => {
      expect(screen.getByText('Movie 1')).toBeTruthy();
      expect(screen.getByText('Movie 2')).toBeTruthy();
    });
  });

  it('handles movie press correctly', async () => {
    render(<FavoriteMoviesList />);
    
    await waitFor(() => {
      const movie1 = screen.getByText('Movie 1');
      fireEvent.press(movie1);
      expect(require('expo-router').router.push).toHaveBeenCalledWith('/movies/1');
    });
  });

  it('shows empty state when no movies', async () => {
    (getSavedMovies as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: [],
    });
    (getSavedMovies as jest.Mock).mockResolvedValueOnce([]);
    
    render(<FavoriteMoviesList />);
    
    await waitFor(() => {
      expect(screen.queryByText('Movie 1')).toBeNull();
    });
  });
});