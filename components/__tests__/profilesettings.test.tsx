import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProfileSettings from '@/app/(tabs)/ProfileSettings';
import * as ImagePicker from 'expo-image-picker';
import * as supabaseFunctions from '@/lib/supabasefunctions';
import { supabase } from '@/lib/supabse';
import { Alert } from 'react-native';

jest.mock('@rneui/themed', () => ({
  Button: () => null, // just returns nothing
}));

// Mock supabase auth
jest.mock('@/lib/supabse', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
  },
}));

// Mock supabasefunctions
jest.mock('@/lib/supabasefunctions', () => ({
  fetchUserData: jest.fn(),
  updateUserData: jest.fn(),
  uploadProfilePicture: jest.fn(),
}));

// Mock ImagePicker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

describe('ProfileSettings', () => {
  const mockUserData = {
    username: 'JohnDoe',
    favmovie: 'Inception',
    picture: 'https://example.com/pic.jpg',
    userId: '12345',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { email: 'johndoe@example.com' } },
    });
    (supabaseFunctions.fetchUserData as jest.Mock).mockResolvedValue(mockUserData);
  });

  it('renders loading state initially', async () => {
    const { getByText } = render(<ProfileSettings />);
    getByText('Loading profile data...');
    await waitFor(() => expect(supabaseFunctions.fetchUserData).toHaveBeenCalled());
  });

  it('renders profile info after loading', async () => {
    const { getByPlaceholderText, getByDisplayValue } = render(<ProfileSettings />);
    await waitFor(() => getByPlaceholderText('Username'));

    expect(getByDisplayValue('JohnDoe')).toBeTruthy();
    expect(getByDisplayValue('Inception')).toBeTruthy();
    expect(getByDisplayValue('johndoe@example.com')).toBeTruthy();
  });

  it('handles image picking', async () => {
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'new-image-uri' }],
    });

    const { getByTestId } = render(<ProfileSettings />);
    await waitFor(() => getByTestId('profile-image'));

    fireEvent.press(getByTestId('profile-image'));
    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    });
  });

  it('saves profile changes without image change', async () => {
    (supabaseFunctions.updateUserData as jest.Mock).mockResolvedValue(true);

    const { getByPlaceholderText, getByText } = render(<ProfileSettings />);
    await waitFor(() => getByPlaceholderText('Username'));

    fireEvent.changeText(getByPlaceholderText('Username'), 'JaneDoe');
    fireEvent.press(getByText('Save Changes'));

    await waitFor(() => {
      expect(supabaseFunctions.updateUserData).toHaveBeenCalledWith('12345', expect.objectContaining({
        username: 'JaneDoe',
      }));
    });
  });

  it('saves profile with image upload when image is changed', async () => {
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'new-uri' }],
    });
    (supabaseFunctions.uploadProfilePicture as jest.Mock).mockResolvedValue('https://cdn.com/new-img.jpg');
    (supabaseFunctions.updateUserData as jest.Mock).mockResolvedValue(true);

    const { getByText, getByTestId } = render(<ProfileSettings />);
    await waitFor(() => getByTestId('profile-image'));

    fireEvent.press(getByTestId('profile-image'));
    await waitFor(() => expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled());

    fireEvent.press(getByText('Save Changes'));
    await waitFor(() => {
      expect(supabaseFunctions.uploadProfilePicture).toHaveBeenCalled();
      expect(supabaseFunctions.updateUserData).toHaveBeenCalledWith('12345', expect.objectContaining({
        picture: 'https://cdn.com/new-img.jpg',
      }));
    });
  });

  it('shows alert if userId is null', async () => {
    (supabaseFunctions.fetchUserData as jest.Mock).mockResolvedValue({
      ...mockUserData,
      userId: null,
    });

    jest.spyOn(Alert, 'alert');

    const { getByText } = render(<ProfileSettings />);
    await waitFor(() => getByText('Save Changes'));

    fireEvent.press(getByText('Save Changes'));
    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Unable to identify user. Please try logging in again.')
    );
  });

  it('shows alert on failed update', async () => {
    (supabaseFunctions.updateUserData as jest.Mock).mockResolvedValue(false);
    jest.spyOn(Alert, 'alert');

    const { getByText } = render(<ProfileSettings />);
    await waitFor(() => getByText('Save Changes'));

    fireEvent.press(getByText('Save Changes'));
    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to update profile. Please try again.')
    );
  });

  it('handles upload failure gracefully', async () => {
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'uri' }],
    });
    (supabaseFunctions.uploadProfilePicture as jest.Mock).mockResolvedValue(null);
    (supabaseFunctions.updateUserData as jest.Mock).mockResolvedValue(true);
    jest.spyOn(Alert, 'alert');

    const { getByText, getByTestId } = render(<ProfileSettings />);
    await waitFor(() => getByTestId('profile-image'));

    fireEvent.press(getByTestId('profile-image'));
    await waitFor(() => getByText('Save Changes'));
    fireEvent.press(getByText('Save Changes'));

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to upload profile image. Other changes will still be saved.')
    );
  });
});
