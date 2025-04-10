import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { supabase } from '@/lib/supabse';
import { fetchUserData, updateUserData, uploadProfilePicture } from '@/lib/supabasefunctions';
import { profilestyles } from '@/styles/profileinfostyles';

const ProfileSettings = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [name, setName] = useState('');
  const [favoriteMovie, setFavoriteMovie] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      
      // Get current user for email
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
      }
      
      const userData = await fetchUserData();
      if (userData) {
        setName(userData.username);
        setFavoriteMovie(userData.favmovie);
        setProfileImage(userData.picture);
        setUserId(userData.userId);
      }
      
      setLoading(false);
    };

    getUserData();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setImageChanged(true);
    }
  };

  const handleSave = async () => {
    if (!userId) {
      Alert.alert('Error', 'Unable to identify user. Please try logging in again.');
      return;
    }

    setSaving(true);
    try {
      let pictureUrl = profileImage;
      
      // If image was changed, upload the new one
      if (imageChanged && profileImage) {
        pictureUrl = await uploadProfilePicture(userId, profileImage);
        if (!pictureUrl) {
          Alert.alert('Error', 'Failed to upload profile image. Other changes will still be saved.');
        }
      }

      // Update user data
      const success = await updateUserData(userId, {
        username: name,
        favmovie: favoriteMovie,
        ...(pictureUrl && { picture: pictureUrl })
      });

      if (success) {
        Alert.alert('Success', 'Profile updated successfully!');
        setImageChanged(false);
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={['#F7E6CA', '#D9BBB1']} style={[profilestyles.container, profilestyles.loadingContainer]}>
        <ActivityIndicator size="large" color="#8A7D6D" />
        <Text style={profilestyles.loadingText}>Loading profile data...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#F7E6CA', '#D9BBB1']} style={profilestyles.container}>
      <TouchableOpacity onPress={pickImage} style={profilestyles.imageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={profilestyles.profileImage} />
        ) : (
          <Icon name="user-circle" size={80} color="#8A7D6D" />
        )}
        <View style={profilestyles.editIconContainer}>
          <Icon name="camera" size={16} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      <Text style={profilestyles.sectionTitle}>Profile Information</Text>
      
      <TextInput 
        style={profilestyles.input} 
        placeholder="Username" 
        value={name} 
        onChangeText={setName} 
      />
      
      <TextInput 
        style={profilestyles.input} 
        placeholder="Favorite Movie" 
        value={favoriteMovie} 
        onChangeText={setFavoriteMovie} 
      />
      
      <TextInput 
        style={profilestyles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address"
        editable={false} // Email from auth cannot be changed here
      />
      
      <Text style={profilestyles.hint}>Email cannot be changed here</Text>
      
      <Button 
        title={saving ? "Saving..." : "Save Changes"} 
        onPress={handleSave} 
        buttonStyle={profilestyles.saveButton} 
        titleStyle={profilestyles.saveButtonText}
        disabled={saving}
        loading={saving}
      />
    </LinearGradient>
  );
};

export default ProfileSettings;