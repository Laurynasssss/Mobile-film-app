import React, { useState } from 'react';
import { View, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Input, Button, Text, Avatar } from '@rneui/themed';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { signUpAndCreateUser } from '@/lib/supabasefunctions';
import { signupstyles, COLORS } from '@/styles/signupstyles';

export default function SignUp(): React.ReactElement {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [favoriteMovie, setFavoriteMovie] = useState<string>('');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
//.
  async function handleSignUp(): Promise<void> {
    try {
      setLoading(true);
      
      // Call the imported function that does all the steps at once
      await signUpAndCreateUser(email, password, nickname, favoriteMovie, profilePic);
      
      Alert.alert('Success', 'Account created successfully!');
      router.push('/');
    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert('Error', error.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  }

  async function pickImage(): Promise<void> {
    try {
      // Request permissions first
      await requestPermissions();
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    
      if (!result.canceled && result.assets && result.assets[0]) {
        // Store just the URI
        setProfilePic(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  }

  async function requestPermissions(): Promise<void> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need camera roll permissions to make this work!');
      throw new Error('Camera roll permission not granted');
    }
  }

  return (
    <LinearGradient colors={[COLORS.backgroundStart, COLORS.backgroundEnd]} style={signupstyles.gradientBackground}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={signupstyles.container}>
      <View style={signupstyles.backButtonContainer}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Ionicons name="arrow-back" size={24} color="#8A7D6D" />
        </TouchableOpacity>
      </View>
        <View style={signupstyles.card}>
          <Text h2 style={[signupstyles.title, { color: COLORS.textColor }]}>Create Account</Text>
          <Text style={[signupstyles.subtitle, { color: COLORS.textColor }]}>Sign up to get started</Text>
          <View style={signupstyles.form}>
            <Input
              placeholder="Email Address"
              placeholderTextColor={COLORS.placeholderColor}
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              inputContainerStyle={signupstyles.inputContainer}
            />
            <Input
              placeholder="Password"
              placeholderTextColor={COLORS.placeholderColor}
              onChangeText={setPassword}
              value={password}
              secureTextEntry
              autoCapitalize="none"
              inputContainerStyle={signupstyles.inputContainer}
            />
            <Input
              placeholder="Nickname"
              placeholderTextColor={COLORS.placeholderColor}
              onChangeText={setNickname}
              value={nickname}
              autoCapitalize="words"
              inputContainerStyle={signupstyles.inputContainer}
            />
            <Input
              placeholder="Favorite Movie (Optional)"
              placeholderTextColor={COLORS.placeholderColor}
              onChangeText={setFavoriteMovie}
              value={favoriteMovie}
              inputContainerStyle={signupstyles.inputContainer}
            />
            <Button
              title="Pick Profile Picture"
              onPress={pickImage}
              buttonStyle={signupstyles.button}
              titleStyle={signupstyles.buttonTitle}
            />
            {profilePic && <Avatar source={{ uri: profilePic }} size="large" rounded containerStyle={signupstyles.avatar} />}
            <Button
              title="Sign Up"
              loading={loading}
              onPress={handleSignUp}
              buttonStyle={signupstyles.button}
              titleStyle={signupstyles.buttonTitle}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
