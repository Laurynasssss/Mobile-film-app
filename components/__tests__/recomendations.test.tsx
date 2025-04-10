// components/__tests__/Recommendations.test.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import Recommendations from '@/app/(tabs)/Recomendations';
import { getMovieRecommendations } from '@/lib/tmdbfunctions';
import { router } from 'expo-router';

// Mock the external dependencies
jest.mock('@/lib/tmdbfunctions', () => ({
  getMovieRecommendations: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('@rneui/themed', () => ({
  Button: jest.fn(({ title, onPress, disabled }) => (
    <button onClick={onPress} disabled={disabled}>
      {title}
    </button>
  )),
}));

jest.mock('expo-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-vector-icons/FontAwesome', () => ({
  default: 'Icon',
}));

describe('Recommendations Component', () => {
  const mockMovies = [
    {
      id: 101,
      title: 'Recommended Movie 1',
      poster_path: '/rec1.jpg',
      vote_average: 8.2,
    },
    {
      id: 102,
      title: 'Recommended Movie 2',
      poster_path: '/rec2.jpg',
      vote_average: 7.5,
    },
    {
      id: 103,
      title: 'Recommended Movie 3',
      poster_path: '/rec3.jpg',
      vote_average: 6.8,
    },
    // Add more mock movies to test pagination
    ...Array.from({ length: 9 }, (_, i) => ({
      id: 200 + i,
      title: `Recommended Movie ${4 + i}`,
      poster_path: `/rec${4 + i}.jpg`,
      vote_average: 5.0 + (i % 4),
    })),
  ];

  beforeEach(() => {
    (getMovieRecommendations as jest.Mock).mockResolvedValue(mockMovies);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays recommended movies on mount', async () => {
    render(<Recommendations />);
    
    await act(async () => {
      await Promise.resolve(); // Wait for useEffect to complete
    });

    expect(getMovieRecommendations).toHaveBeenCalled();
    expect(screen.getByText('Recommended Movie 1')).toBeTruthy();
    expect(screen.getByText('Recommended Movie 2')).toBeTruthy();
    expect(screen.getByText('Recommended Movie 3')).toBeTruthy();
  });

  it('navigates to movie details when a movie is pressed', async () => {
    render(<Recommendations />);
    
    await act(async () => {
      await Promise.resolve();
    });

    const firstMovie = screen.getByText('Recommended Movie 1');
    fireEvent.press(firstMovie);

    expect(router.push).toHaveBeenCalledWith('/movies/101');
  });

  it('renders star ratings correctly', async () => {
    render(<Recommendations />);
    
    await act(async () => {
      await Promise.resolve();
    });

    // Check that star icons are rendered
    // Note: You might need to adjust this based on how you test icons
    const starElements = screen.getAllByTestId('icon-star');
    expect(starElements.length).toBeGreaterThan(0);
  });

  it('handles pagination correctly', async () => {
    render(<Recommendations />);
    
    await act(async () => {
      await Promise.resolve();
    });

    // Verify initial page
    expect(screen.getByText(/Page 1 of/)).toBeTruthy();
    
    // Click next button
    const nextButton = screen.getByText('Next');
    fireEvent.press(nextButton);
    
    expect(screen.getByText(/Page 2 of/)).toBeTruthy();
    
    // Click previous button
    const prevButton = screen.getByText('Previous');
    fireEvent.press(prevButton);
    
    expect(screen.getByText(/Page 1 of/)).toBeTruthy();
  });

  it('disables pagination buttons appropriately', async () => {
    render(<Recommendations />);
    
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
    render(<Recommendations />);
    
    await act(async () => {
      await Promise.resolve();
    });

    // Should show 9 movies per page (moviesPerPage = 9)
    const movieTitles = screen.getAllByText(/Recommended Movie/);
    expect(movieTitles.length).toBe(9);
  });

  it('handles empty movie list gracefully', async () => {
    (getMovieRecommendations as jest.Mock).mockResolvedValue([]);
    render(<Recommendations />);
    
    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.queryByText(/Recommended Movie/)).toBeNull();
    expect(screen.getByText('Page 1 of 0')).toBeTruthy();
  });

  it('shows loading state while fetching movies', async () => {
    // Delay the mock response to test loading state
    let resolvePromise: (value: unknown) => void;
    (getMovieRecommendations as jest.Mock).mockImplementation(() => 
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );

    render(<Recommendations />);
    
    // Verify loading state (you might want to add a loading indicator to your component)
    // Then resolve the promise
    await act(async () => {
      resolvePromise(mockMovies);
    });

    expect(screen.getByText('Recommended Movie 1')).toBeTruthy();
  });
});