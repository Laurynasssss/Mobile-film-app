// components/__tests__/MovieList.test.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import MovieList from '@/app/(tabs)/Movies';
import { fetchPopularMovies } from '@/lib/tmdbfunctions';
import { useAuthGuard } from '@/components/auth';
import { router } from 'expo-router';

// Mock the external dependencies
jest.mock('@/lib/tmdbfunctions', () => ({
  fetchPopularMovies: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('@/components/auth', () => ({
  useAuthGuard: jest.fn(),
}));

jest.mock('@rneui/themed', () => ({
  Button: jest.fn(({ title, onPress, disabled }) => (
    <button onClick={onPress} disabled={disabled}>
      {title}
    </button>
  )),
}));

jest.mock('expo-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');

describe('MovieList Component', () => {
  const mockMovies = [
    {
      id: 1,
      title: 'Test Movie 1',
      poster_path: '/test1.jpg',
      vote_average: 8.5,
    },
    {
      id: 2,
      title: 'Test Movie 2',
      poster_path: '/test2.jpg',
      vote_average: 7.0,
    },
    {
      id: 3,
      title: 'Test Movie 3',
      poster_path: '/test3.jpg',
      vote_average: 6.5,
    },
    // Add more mock movies to test pagination
    ...Array.from({ length: 9 }, (_, i) => ({
      id: i + 4,
      title: `Test Movie ${i + 4}`,
      poster_path: `/test${i + 4}.jpg`,
      vote_average: 5.0 + (i % 3),
    })),
  ];

  beforeEach(() => {
    (useAuthGuard as jest.Mock).mockReturnValue(false);
    (fetchPopularMovies as jest.Mock).mockResolvedValue(mockMovies);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state when authentication is checking', () => {
    (useAuthGuard as jest.Mock).mockReturnValue(true);
    render(<MovieList />);
    expect(screen.getByText('Checking authentication...')).toBeTruthy();
  });

  it('fetches and displays movies after authentication check', async () => {
    render(<MovieList />);
    
    await act(async () => {
      await Promise.resolve(); // Wait for useEffect to complete
    });

    expect(fetchPopularMovies).toHaveBeenCalled();
    expect(screen.getByText('Test Movie 1')).toBeTruthy();
    expect(screen.getByText('Test Movie 2')).toBeTruthy();
    expect(screen.getByText('Test Movie 3')).toBeTruthy();
  });

  it('navigates to movie details when a movie is pressed', async () => {
    render(<MovieList />);
    
    await act(async () => {
      await Promise.resolve();
    });

    const firstMovie = screen.getByText('Test Movie 1');
    fireEvent.press(firstMovie);

    expect(router.push).toHaveBeenCalledWith('/movies/1');
  });

  it('renders star ratings correctly', async () => {
    render(<MovieList />);
    
    await act(async () => {
      await Promise.resolve();
    });

    // Check that star icons are rendered (simplified check)
    // In a real test, you might want to verify the exact number of stars
    expect(screen.getAllByTestId('icon-star').length).toBeGreaterThan(0);
  });

  it('handles pagination correctly', async () => {
    render(<MovieList />);
    
    await act(async () => {
      await Promise.resolve();
    });

    // Verify initial page
    expect(screen.getByText('Page 1 of 2')).toBeTruthy();
    
    // Click next button
    const nextButton = screen.getByText('Next');
    fireEvent.press(nextButton);
    
    expect(screen.getByText('Page 2 of 2')).toBeTruthy();
    
    // Click previous button
    const prevButton = screen.getByText('Previous');
    fireEvent.press(prevButton);
    
    expect(screen.getByText('Page 1 of 2')).toBeTruthy();
  });

  it('disables pagination buttons appropriately', async () => {
    render(<MovieList />);
    
    await act(async () => {
      await Promise.resolve();
    });

    const prevButton = screen.getByText('Previous');
    const nextButton = screen.getByText('Next');
    
    // On first page, previous should be disabled
    expect(prevButton.props.disabled).toBe(true);
    expect(nextButton.props.disabled).toBe(false);
    
    // Go to last page
    fireEvent.press(nextButton);
    
    // On last page, next should be disabled
    expect(prevButton.props.disabled).toBe(false);
    expect(nextButton.props.disabled).toBe(true);
  });

  it('displays correct number of movies per page', async () => {
    render(<MovieList />);
    
    await act(async () => {
      await Promise.resolve();
    });

    // Should show 9 movies per page (moviesPerPage = 9)
    const movieTitles = screen.getAllByText(/Test Movie/);
    expect(movieTitles.length).toBe(9);
  });
});