import { supabase } from '@/lib/supabse';
import * as supabaseFunctions from '@/lib/supabasefunctions';
import { getMovieGenre } from '@/lib/tmdbfunctions';
import { User } from '@supabase/supabase-js';

// Create a properly typed mock of the Supabase client
jest.mock('@/lib/supabse', () => {
  // Mock for the query builder
  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    update: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    match: jest.fn().mockReturnThis(),
  };

  return {
    supabase: {
      auth: {
        getUser: jest.fn(),
        signOut: jest.fn(),
        signUp: jest.fn(),
      },
      from: jest.fn(() => mockQueryBuilder),
      storage: {
        from: jest.fn().mockReturnValue({
          upload: jest.fn().mockResolvedValue({ data: {}, error: null }),
          getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'http://img' } }),
        }),
      },
    },
  };
});

jest.mock('@/lib/tmdbfunctions', () => ({
  getMovieGenre: jest.fn(),
}));

jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
  EncodingType: {
    Base64: 'base64',
  },
}));

// Mock window.localStorage for handleLogout test
Object.defineProperty(window, 'localStorage', {
  value: {
    removeItem: jest.fn(),
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// Mock window.location for handleLogout test
Object.defineProperty(window, 'location', {
  value: {
    href: '',
  },
  writable: true,
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    blob: () => Promise.resolve(new Blob()),
  })
) as jest.Mock;

describe('Supabase Functions', () => {
  const mockUser: Partial<User> = {
    id: 'user-123',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2023-01-01',
  };

  const getUserMock = supabase.auth.getUser as jest.Mock;
  const fromMock = supabase.from as jest.Mock;
  const storageMock = supabase.storage.from as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementation for getUser
    getUserMock.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  // Existing test cases for isMovieInWatchedList
  test('isMovieInWatchedList: returns true if movie is in list', async () => {
    fromMock.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { watchedMovies: ['1', '2', '3'] },
        error: null,
      }),
    });

    const result = await supabaseFunctions.isMovieInWatchedList('2');
    expect(result).toEqual(expect.objectContaining({ isInList: true, success: true }));
  });

  test('isMovieInWatchedList: handles no user', async () => {
    getUserMock.mockResolvedValue({ data: { user: null }, error: null });

    const result = await supabaseFunctions.isMovieInWatchedList('2');
    expect(result.success).toBe(false);
  });

  test('isMovieInWatchedList: handles fetch error', async () => {
    fromMock.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      }),
    });

    const result = await supabaseFunctions.isMovieInWatchedList('2');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Database error');
  });

  // Enhanced tests for saveToWatched
  test('saveToWatched: saves a new movie and genre', async () => {
    fromMock.mockImplementation((table) => {
      if (table === 'usersMovies') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { watchedMovies: ['1'], genres: [12] },
            error: null,
          }),
          update: jest.fn().mockReturnThis(),
        };
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn(),
      };
    });

    (getMovieGenre as jest.Mock).mockResolvedValue([28]);

    const result = await supabaseFunctions.saveToWatched('3');
    expect(result.success).toBe(true);
  });

  test('saveToWatched: handles no user', async () => {
    getUserMock.mockResolvedValue({ data: { user: null }, error: { message: 'Auth error' } });

    const result = await supabaseFunctions.saveToWatched('3');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Auth error');
  });

  test('saveToWatched: handles database update error', async () => {
    fromMock.mockImplementation((table) => {
      if (table === 'usersMovies') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { watchedMovies: ['1'], genres: [12] },
            error: null,
          }),
          update: jest.fn().mockReturnThis(),
        };
      }
      return { select: jest.fn().mockReturnThis() };
    });

    (getMovieGenre as jest.Mock).mockResolvedValue([28]);

    const mockUpdate = jest.fn().mockResolvedValue({
      error: { message: 'Update failed' },
      data: null,
    });

    const mockEq = jest.fn().mockReturnValue({ select: mockUpdate });
    const mockUpdateFn = jest.fn().mockReturnValue({ eq: mockEq });

    fromMock.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { watchedMovies: ['1'], genres: [12] },
        error: null,
      }),
      update: mockUpdateFn,
    });

    const result = await supabaseFunctions.saveToWatched('3');
    expect(result.success).toBe(false);
  });

  // Tests for getSavedMovies
  test('getSavedMovies: fetches watchedMovies array', async () => {
    fromMock.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { watchedMovies: ['1', '2'] },
        error: null,
      }),
    });

    const result = await supabaseFunctions.getSavedMovies();
    expect(result.success).toBe(true);
    expect(result.data).toEqual(['1', '2']);
  });

  test('getSavedMovies: handles error fetching movies', async () => {
    fromMock.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Failed to fetch movies' },
      }),
    });

    const result = await supabaseFunctions.getSavedMovies();
    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to fetch movies');
  });

  // Tests for handleLogout
  test('handleLogout: signs user out and clears storage', async () => {
    (supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null });
    const removeItemSpy = jest.spyOn(window.localStorage, 'removeItem');
    
    const result = await supabaseFunctions.handleLogout();
    expect(removeItemSpy).toHaveBeenCalledWith('user');
    expect(window.location.href).toBe('/login');
    expect(result.success).toBe(true);
  });

  test('handleLogout: handles sign out error', async () => {
    (supabase.auth.signOut as jest.Mock).mockResolvedValue({ 
      error: { message: 'Sign out failed' } 
    });
    
    const result = await supabaseFunctions.handleLogout();
    expect(result.success).toBe(false);
    expect(result.message).toContain('Failed to log out');
  });

  // Tests for checkOrCreateUserRow
  test('checkOrCreateUserRow: creates user if not found', async () => {
    fromMock.mockImplementation((table) => {
      if (table === 'usersMovies') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockRejectedValue({ code: 'PGRST116' }),
          insert: jest.fn().mockReturnThis(),
        };
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn(),
      };
    });

    const mockSelect = jest.fn().mockResolvedValue({
      data: { userId: mockUser.id },
      error: null,
    });

    const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
    fromMock().insert = mockInsert;

    const result = await supabaseFunctions.checkOrCreateUserRow();
    expect(result).toEqual(expect.objectContaining({ userId: mockUser.id }));
    expect(mockInsert).toHaveBeenCalled();
  });

  test('checkOrCreateUserRow: returns existing user row', async () => {
    fromMock.mockImplementation((table) => {
      if (table === 'usersMovies') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { userId: mockUser.id },
            error: null,
          }),
        };
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn(),
      };
    });

    const result = await supabaseFunctions.checkOrCreateUserRow();
    expect(result).toEqual(expect.objectContaining({ userId: mockUser.id }));
  });

  test('checkOrCreateUserRow: handles no authenticated user', async () => {
    getUserMock.mockResolvedValue({ data: { user: null }, error: null });
    
    const result = await supabaseFunctions.checkOrCreateUserRow();
    expect(result).toBe(false);
  });

  // Tests for getUserId
  test('getUserId: returns user ID if logged in', async () => {
    const result = await supabaseFunctions.getUserId();
    expect(result).toBe(mockUser.id);
  });

  test('getUserId: returns null if not logged in', async () => {
    getUserMock.mockResolvedValue({ data: { user: null }, error: null });
    
    const result = await supabaseFunctions.getUserId();
    expect(result).toBeNull();
  });

  // Enhanced tests for getTopGenres
  test('getTopGenres: returns top 3 genres', async () => {
    jest.spyOn(supabaseFunctions, 'getUserId').mockResolvedValue(mockUser.id as string);
    
    fromMock.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { genres: [1, 2, 3, 1, 2] },
        error: null,
      }),
    });

    const result = await supabaseFunctions.getTopGenres();
    expect(result).toEqual(['1', '2', '3']);
  });

  test('getTopGenres: handles empty genres array', async () => {
    jest.spyOn(supabaseFunctions, 'getUserId').mockResolvedValue(mockUser.id as string);
    
    fromMock.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { genres: [] },
        error: null,
      }),
    });

    const result = await supabaseFunctions.getTopGenres();
    expect(result).toEqual([]);
  });

  test('getTopGenres: handles database error', async () => {
    jest.spyOn(supabaseFunctions, 'getUserId').mockResolvedValue(mockUser.id as string);
    
    fromMock.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      }),
    });

    const result = await supabaseFunctions.getTopGenres();
    expect(result).toEqual([]);
  });

  // Tests for user signup and account functions
  test('signUpUser: returns user and session on success', async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: { user: mockUser, session: null },
      error: null,
    });

    const result = await supabaseFunctions.signUpUser('test@mail.com', 'password');
    expect(result).toEqual({ user: mockUser, session: null });
  });

  test('signUpUser: handles sign up error', async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Email already in use' },
    });

    await expect(supabaseFunctions.signUpUser('test@mail.com', 'password'))
      .rejects.toThrow('Sign-up error: Email already in use');
  });

  test('insertUserData: inserts data into usersInfo', async () => {
    fromMock.mockReturnValueOnce({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue({
        data: [{ success: true }],
        error: null,
      }),
    });

    const result = await supabaseFunctions.insertUserData(mockUser as User, null, 'nickname', 'movie');
    expect(result).toBeDefined();
  });

  test('insertUserData: handles database error', async () => {
    fromMock.mockReturnValueOnce({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Insert failed' },
      }),
    });

    await expect(supabaseFunctions.insertUserData(mockUser as User, null, 'nickname', 'movie'))
      .rejects.toThrow('Database error: Insert failed');
  });

  // Tests for signUpAndCreateUser flow
  test('signUpAndCreateUser: full flow', async () => {
    jest.spyOn(supabaseFunctions, 'signUpUser').mockResolvedValue({ user: mockUser as User, session: null });
    jest.spyOn(supabaseFunctions, 'uploadonsignup').mockResolvedValue('http://img');
    jest.spyOn(supabaseFunctions, 'insertUserData').mockResolvedValue({ success: true });

    const result = await supabaseFunctions.signUpAndCreateUser('e', 'p', 'nick', 'movie', 'uri');
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('userData');
  });

  test('signUpAndCreateUser: without profile pic', async () => {
    jest.spyOn(supabaseFunctions, 'signUpUser').mockResolvedValue({ user: mockUser as User, session: null });
    jest.spyOn(supabaseFunctions, 'insertUserData').mockResolvedValue({ success: true });

    const result = await supabaseFunctions.signUpAndCreateUser('e', 'p', 'nick', 'movie', null);
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('userData');
  });

  // Tests for fetch and update user data
  test('fetchUserData: gets user data from usersInfo', async () => {
    fromMock.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { username: 'nick', favmovie: 'movie', picture: null },
        error: null,
      }),
    });

    const result = await supabaseFunctions.fetchUserData();
    expect(result).toEqual(expect.objectContaining({ username: 'nick' }));
  });

  test('fetchUserData: handles database error', async () => {
    fromMock.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      }),
    });

    const result = await supabaseFunctions.fetchUserData();
    expect(result).toBeNull();
  });

  test('fetchUserData: handles no user logged in', async () => {
    getUserMock.mockResolvedValue({ data: { user: null }, error: null });
    
    const result = await supabaseFunctions.fetchUserData();
    expect(result).toBeNull();
  });

  test('updateUserData: updates user info', async () => {
    fromMock.mockReturnValueOnce({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue({ error: null }),
    });

    const result = await supabaseFunctions.updateUserData(mockUser.id as string, { username: 'newname' });
    expect(result).toBe(true);
  });

  test('updateUserData: handles update error', async () => {
    fromMock.mockReturnValueOnce({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue({ error: { message: 'Update failed' } }),
    });

    const result = await supabaseFunctions.updateUserData(mockUser.id as string, { username: 'newname' });
    expect(result).toBe(false);
  });

  // Tests for upload profile picture functions
  test('uploadProfilePicture: uploads image and returns URL', async () => {
    const result = await supabaseFunctions.uploadProfilePicture('id', 'file://path.jpg');
    expect(result).toBe('http://img');
  });

  test('uploadProfilePicture: handles invalid URI', async () => {
    const result = await supabaseFunctions.uploadProfilePicture('id', 'invalid-uri');
    expect(result).toBeNull();
  });

  test('uploadProfilePicture: handles upload error', async () => {
    storageMock.mockReturnValueOnce({
      upload: jest.fn().mockResolvedValue({ data: null, error: { message: 'Upload failed' } }),
      getPublicUrl: jest.fn(),
    });

    const result = await supabaseFunctions.uploadProfilePicture('id', 'file://path.jpg');
    expect(result).toBeNull();
  });

  test('uploadonsignup: uploads base64 and returns URL', async () => {
    const fs = require('expo-file-system');
    fs.readAsStringAsync.mockResolvedValue('ZmFrZWJhc2U2NA=='); // base64 for 'fakebase64'

    const result = await supabaseFunctions.uploadonsignup('file://path.jpg', 'userId');
    expect(result).toBe('http://img');
  });

  test('uploadonsignup: handles upload error', async () => {
    const fs = require('expo-file-system');
    fs.readAsStringAsync.mockResolvedValue('ZmFrZWJhc2U2NA==');

    storageMock.mockReturnValueOnce({
      upload: jest.fn().mockResolvedValue({ data: null, error: { message: 'Upload failed' } }),
      getPublicUrl: jest.fn(),
    });

    await expect(supabaseFunctions.uploadonsignup('file://path.jpg', 'userId'))
      .rejects.toThrow('Image upload error: Upload failed');
  });
});