import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { supabase } from '@/lib/supabse';
import { fetchUserData, updateUserData, uploadProfilePicture } from '@/lib/supabasefunctions';

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
      <LinearGradient colors={['#F7E6CA', '#D9BBB1']} style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#8A7D6D" />
        <Text style={styles.loadingText}>Loading profile data...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#F7E6CA', '#D9BBB1']} style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Icon name="user-circle" size={80} color="#8A7D6D" />
        )}
        <View style={styles.editIconContainer}>
          <Icon name="camera" size={16} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Profile Information</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Username" 
        value={name} 
        onChangeText={setName} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Favorite Movie" 
        value={favoriteMovie} 
        onChangeText={setFavoriteMovie} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address"
        editable={false} // Email from auth cannot be changed here
      />
      
      <Text style={styles.hint}>Email cannot be changed here</Text>
      
      <Button 
        title={saving ? "Saving..." : "Save Changes"} 
        onPress={handleSave} 
        buttonStyle={styles.saveButton} 
        titleStyle={styles.saveButtonText}
        disabled={saving}
        loading={saving}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#614C3E',
    fontSize: 16,
  },
  imageContainer: {
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#E6D5C9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8A7D6D',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F7E6CA',
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#614C3E',
    marginBottom: 10,
    marginLeft: 20,
  },
  input: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#8A7D6D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    fontSize: 16,
  },
  hint: {
    color: '#8A7D6D',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 25,
    marginTop: -5,
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#D9BBB1',
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 12,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileSettings;