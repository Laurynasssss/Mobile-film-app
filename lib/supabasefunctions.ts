import { supabase } from '@/lib/supabse'
import { getMovieGenre } from './tmdbfunctions';
import { User, Session } from '@supabase/supabase-js';

// Types for better type safety
export interface UserData {
  username: string;
  favmovie: string;
  picture: string | null;
  userId: string;
}

export interface UpdatedUserData {
  username?: string;
  favmovie?: string;
  picture?: string | null;
}

export async function isMovieInWatchedList(movieId: string) {
  console.log("🔍 Checking if movie is in watched list:", movieId);
  
  try {
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error("⚠️ Auth Error:", authError?.message || "No user logged in");
      return { 
        isInList: false, 
        success: false, 
        error: authError?.message || "No user logged in" 
      };
    }
    console.log("✅ User found:", user.id);
    
    // Fetch current user data
    const { data: existingData, error: fetchError } = await supabase
      .from("usersMovies")
      .select("watchedMovies")
      .eq("userId", user.id)
      .single();
    
    if (fetchError) {
      console.error("❌ Fetch Error:", fetchError);
      return { 
        isInList: false, 
        success: false, 
        error: fetchError.message 
      };
    }
    
    // Debug: Log the fetched data
    console.log("📊 Fetched user data:", existingData);
    
    // Check if movie is already in watched list - with enhanced debugging
    const currentMovies = existingData?.watchedMovies || [];
    console.log("🎬 Current movies array:", currentMovies);
    console.log("🔍 Checking if array includes:", movieId);
    console.log("🔍 Array type:", Array.isArray(currentMovies) ? "Array" : typeof currentMovies);
    
    // Explicit search instead of includes()
    let isDuplicate = false;
    for (let i = 0; i < currentMovies.length; i++) {
      console.log(`🔄 Comparing: '${currentMovies[i]}' (${typeof currentMovies[i]}) vs '${movieId}' (${typeof movieId})`);
      if (String(currentMovies[i]) === String(movieId)) {
        isDuplicate = true;
        console.log("⚠️ DUPLICATE FOUND at index", i);
        break;
      }
    }
    
    return { 
      isInList: isDuplicate, 
      success: true, 
      currentMovies 
    };
  } catch (err) {
    console.error("❌ Unexpected Error in isMovieInWatchedList:", err);
    return {
      isInList: false,
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred"
    };
  }
}

export async function saveToWatched(movieId: string) {
  console.log("🚀 Attempting to save movie...", movieId);
 
  try {
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
   
    if (authError || !user) {
      console.error("⚠️ Auth Error:", authError?.message || "No user logged in");
      return { success: false as const, error: authError?.message || "No user logged in" };
    }
    console.log("✅ User found:", user.id);
    
    // Fetch current user data
    const { data: existingData, error: fetchError } = await supabase
      .from("usersMovies")
      .select("watchedMovies, genres")
      .eq("userId", user.id)
      .single();
   
    if (fetchError) {
      console.error("❌ Fetch Error:", fetchError);
      return { success: false as const, error: fetchError.message };
    }
    
    // Get current movies
    const currentMovies = existingData?.watchedMovies || [];
    console.log("🎬 Current movies array:", currentMovies);
   
    // Get genre information
    const genre = await getMovieGenre(movieId);
   
    // Process genre data
    const currentGenres = existingData?.genres || [];
    const genreToAdd = Array.isArray(genre)
      ? genre
      : typeof genre === 'number'
        ? [genre]
        : genre?.genreIds || [];
   
    // Update database
    const { data, error } = await supabase
      .from("usersMovies")
      .update({
        watchedMovies: [...currentMovies, movieId],
        genres: [...currentGenres, ...genreToAdd]
      })
      .eq("userId", user.id)
      .select();
   
    if (error) {
      console.error("❌ Supabase Update Error:", error);
      return { success: false as const, error: error.message || "Unknown database error" };
    }
   
    console.log("✅ Movie added to watched list successfully:", data);
    return { success: true as const, data };
  } catch (err) {
    console.error("❌ Unexpected Error:", err);
    return {
      success: false as const,
      error: err instanceof Error ? err.message : "Unknown error occurred"
    };  
  }
}
export async function getSavedMovies() {
  console.log("🚀 Fetching saved movies...");

  try {
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error("⚠️ Auth Error:", authError.message);
      return { success: false as const, error: authError.message };
    }

    if (!user) {
      console.error("⚠️ No user logged in");
      return { success: false as const, error: "No user logged in" };
    }

    console.log("✅ User found:", user.id);

    // Query Supabase for the user's saved movies
    const { data, error } = await supabase
      .from("usersMovies")
      .select("watchedMovies")
      .eq("userId", user.id);

    if (error) {
      console.error("❌ Supabase Fetch Error:", error.message);
      return { success: false as const, error: error.message };
    }

    // Extract movie IDs into an array
    const movieIds = data.flatMap((movie) => movie.watchedMovies);
    console.log("🎬 Retrieved Movie IDs:", movieIds);

    return { success: true as const, data: movieIds };
  } catch (err) {
    console.error("❌ Unexpected Error:", err);
    return { success: false as const, error: err instanceof Error ? err.message : "Unknown error occurred" };
  }
}
export async function handleLogout() {
  try {
    // Sign out the user from Supabase
    const { error } = await supabase.auth.signOut()

    // Handle potential logout errors
    if (error) {
      console.error('Logout error:', error.message)
      throw new Error('Failed to log out. Please try again.')
    }

    // Optional: Clear any client-side user data or tokens
    // For example, removing user data from local storage
    localStorage.removeItem('user')
    
    // Optional: Redirect to login page or home page
    window.location.href = '/login'

    return {
      success: true,
      message: 'Successfully logged out'
    }
  } catch (error) {
    // Catch any unexpected errors during logout process
    console.error('Unexpected logout error:', error)
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}
export const checkOrCreateUserRow = async () => {
  try {
    // Get logged-in user
    const { data: userData, error: authError } = await supabase.auth.getUser();
    
    if (authError || !userData?.user) {
      throw new Error("No authenticated user found");
    }
    
    const userId = userData.user.id;
    
    // First, try to find an existing row
    const { data: existingRow, error: findError } = await supabase
      .from('usersMovies')  // Replace with your actual table name
      .select('*')
      .eq('userId', userId)
      .single();
    
    // If no existing row, create a new one
    if (findError) {
      if (findError.code === 'PGRST116') {
        // No existing row, so create a new one
        const { data: newRow, error: insertError } = await supabase
          .from('usersMovies')
          .insert({ 
            userId: userId, 
            // Add any other default columns you want to initialize
            // For example:
            // created_at: new Date(),
            // other_column: default_value
          })
          .select()
          .single();
        
        if (insertError) {
          console.error("Error creating new user row:", insertError);
          return false;
        }
        
        console.log("New user row created:", newRow);
        return newRow;
      }
      
      // For any other unexpected error
      throw findError;
    }
    
    
    // If row already exists
    console.log("Existing user row found:", existingRow);
    return existingRow;
  } catch (error) {
    console.error("Error in checkOrCreateUserRow:", error);
    return false;
  }
};

export async function getUserId(): Promise<string | null> {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data.user.id; // Ensure it's a string
}

export async function getTopGenres() {
  const userId= await getUserId();

  const { data, error } = await supabase
    .from('usersMovies')
    .select('genres')
    .eq('userId', userId);

  if (error) {
    console.error('Error fetching user movies:', error);
    return [];
  }

  const genreCounts: { [key: string]: number } = {};
  
  data.forEach(row => {
    if (row.genres && Array.isArray(row.genres)) {
      row.genres.forEach(genreId => {
        genreCounts[genreId] = (genreCounts[genreId] || 0) + 1;
      });
    }
  });

  // Sort genres by count in descending order and take top 3
  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(entry => entry[0]);

  return topGenres;
}


interface SignUpResponse {
  user: User;
  session: Session | null;
}

interface CreateUserResponse extends SignUpResponse {
  userData: any;
}

export async function signUpUser(email: string, password: string): Promise<SignUpResponse> {
  try {
    // Step 1: Sign up the user with email and password
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) {
      throw new Error(`Sign-up error: ${authError.message}`);
    }
    
    if (!data.user) {
      throw new Error('User not created.');
    }
    
    return { user: data.user, session: data.session, }; // Return user and session for further processing
  } catch (error) {
    console.error('Error during sign-up:', error);
    throw error; // Re-throw the error for handling in the calling function
  }
}


import * as FileSystem from 'expo-file-system';

// Make sure to import atob if needed (in React Native environment)
function atob(data: string): string {
  // React Native doesn't have atob natively
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let str = data.replace(/=+$/, '');
  let output = '';
  
  if (str.length % 4 === 1) {
    throw new Error('atob failed: The string to be decoded is not correctly encoded.');
  }
  
  for (
    let bc = 0, bs = 0, buffer, i = 0;
    (buffer = str.charAt(i++));
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    buffer = chars.indexOf(buffer);
  }
  
  return output;
}
export async function insertUserData(
  user: User, 
  profilePicUrl: string | null, 
  nickname: string, 
  favoriteMovie?: string
): Promise<any> {
  try {
    // Insert a new row into the `UsersInfo` table
    const { data: userData, error: dbError } = await supabase
      .from('usersInfo')
      .insert([
        {
          userId: user.id,
          favmovie: favoriteMovie || null,
          picture: profilePicUrl || null,
          username: nickname,
        },
      ])
      .select();
      
    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }
    
    console.log('User signed up and data inserted successfully:', userData);
    return userData; // Return the user data after insertion
  } catch (error) {
    console.error('Error during inserting user data:', error);
    throw error; // Re-throw the error for handling in the calling function
  }
}

export async function signUpAndCreateUser(
  email: string,
  password: string,
  nickname: string,
  favoriteMovie?: string,
  profilePicUri?: string | null
): Promise<CreateUserResponse> {
  try {
    // Step 1: Sign up the user
    const { user, session } = await signUpUser(email, password);
    console.log('Created user ID:', user.id);
    // Step 2: Upload the profile picture if provided
    const profilePicUrl = profilePicUri ? await uploadonsignup(profilePicUri, user.id) : null;
    
    // Step 3: Insert user data into UsersInfo table
    const userData = await insertUserData(user, profilePicUrl, nickname, favoriteMovie);
    
    // Return the created user data and session
    return { user, session, userData };
  } catch (error) {
    console.error('Email already in use');
    throw error;
  }
}

// Function to fetch user data
export const fetchUserData = async (): Promise<UserData | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('usersInfo')
      .select('*')  // Select all fields
      .eq('userId', user.id)
      .single();
      
    if (error) throw error;
    return {
      username: data?.username || '',
      favmovie: data?.favmovie || '',
      picture: data?.picture || null,
      userId: user.id
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// Function to update user data
export const updateUserData = async (userId: string, updatedData: UpdatedUserData): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('usersInfo')
      .update(updatedData)
      .eq('userId', userId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating user data:', error);
    return false;
  }
};

export const uploadProfilePicture = async (userId: string, uri: string): Promise<string | null> => {
  try {
    console.log('Uploading image from URI:', uri); // Debugging

    if (!uri.startsWith('file://')) {
      throw new Error('Invalid file URI: ' + uri);
    }

    const fileExt = uri.split('.').pop();
    const fileName = `profile-pics/${userId}/${Date.now()}.${fileExt}`;
    
    // Fetch the file as a Blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('ProfilePictures')
      .upload(fileName, blob, {
        contentType: `image/${fileExt}`,
        upsert: true,
      });

    if (error) throw error;

    // Get the public URL
    const { data: urlData } = supabase.storage.from('ProfilePictures').getPublicUrl(fileName);
    console.log('Uploaded Image URL:', urlData.publicUrl);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};
export async function uploadonsignup(profilePicUri: string, userId: string): Promise<string | null> {
  try {
    let profilePicUrl: string | null = null;
   
    if (profilePicUri) {
      console.log('Original profile pic URI:', profilePicUri);
      
      // Make sure the path includes the user ID to match RLS policies
      const fileName = `profile-pics/${userId}/${Date.now()}.jpg`;
      
      // Read the file as base64
      const base64Data = await FileSystem.readAsStringAsync(profilePicUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Convert base64 to Uint8Array for upload
      const byteArray = decode(base64Data);
      
      console.log('Preparing to upload file:', fileName);
      
      // Upload to Supabase with user authentication
      const { data, error } = await supabase.storage
        .from('ProfilePictures')
        .upload(fileName, byteArray, {
          contentType: 'image/jpeg',
          upsert: true
        });
        
      if (error) {
        console.error('Supabase upload error:', error);
        throw new Error(`Image upload error: ${error.message}`);
      }
      
      console.log('Upload successful:', data);
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('ProfilePictures')
        .getPublicUrl(fileName);
      
      if (publicUrlData && publicUrlData.publicUrl) {
        profilePicUrl = publicUrlData.publicUrl;
      } else {
        throw new Error('Failed to get public URL');
      }
    }
    
    return profilePicUrl;
  } catch (error) {
    console.error('Error in uploadProfilePicture:', error);
    throw error;
  }
}

// Helper function to decode base64
function decode(base64: string): Uint8Array {
  const binaryString = atob1(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Base64 decode function for React Native
function atob1(data: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let str = data.replace(/=+$/, '');
  let output = '';
  
  if (str.length % 4 === 1) {
    throw new Error('atob failed: The string to be decoded is not correctly encoded.');
  }
  
  for (
    let bc = 0, bs = 0, buffer, i = 0;
    (buffer = str.charAt(i++));
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    buffer = chars.indexOf(buffer);
  }
  
  return output;
}
