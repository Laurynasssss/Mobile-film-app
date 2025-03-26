import React, { useState } from 'react';
import { View, Alert, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Input, Button, Text, Avatar } from '@rneui/themed';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { signUpAndCreateUser } from '@/lib/supabasefunctions';

const COLORS = {
  backgroundStart: '#F7E6CA',
  backgroundEnd: '#E8D59E',
  buttonBackground: '#D9BBB1',
  inputBorder: '#8A7D6D', // Border color
  textColor: '#8A7D6D', // Text color
  placeholderColor: '#8A7D6D', // Placeholder text color
};

export default function SignUp(): React.ReactElement {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [favoriteMovie, setFavoriteMovie] = useState<string>('');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
    <LinearGradient colors={[COLORS.backgroundStart, COLORS.backgroundEnd]} style={styles.gradientBackground}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Ionicons name="arrow-back" size={24} color="#8A7D6D" />
        </TouchableOpacity>
      </View>
        <View style={styles.card}>
          <Text h2 style={[styles.title, { color: COLORS.textColor }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: COLORS.textColor }]}>Sign up to get started</Text>
          <View style={styles.form}>
            <Input
              placeholder="Email Address"
              placeholderTextColor={COLORS.placeholderColor}
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              inputContainerStyle={styles.inputContainer}
            />
            <Input
              placeholder="Password"
              placeholderTextColor={COLORS.placeholderColor}
              onChangeText={setPassword}
              value={password}
              secureTextEntry
              autoCapitalize="none"
              inputContainerStyle={styles.inputContainer}
            />
            <Input
              placeholder="Nickname"
              placeholderTextColor={COLORS.placeholderColor}
              onChangeText={setNickname}
              value={nickname}
              autoCapitalize="words"
              inputContainerStyle={styles.inputContainer}
            />
            <Input
              placeholder="Favorite Movie (Optional)"
              placeholderTextColor={COLORS.placeholderColor}
              onChangeText={setFavoriteMovie}
              value={favoriteMovie}
              inputContainerStyle={styles.inputContainer}
            />
            <Button
              title="Pick Profile Picture"
              onPress={pickImage}
              buttonStyle={styles.button}
              titleStyle={styles.buttonTitle}
            />
            {profilePic && <Avatar source={{ uri: profilePic }} size="large" rounded containerStyle={styles.avatar} />}
            <Button
              title="Sign Up"
              loading={loading}
              onPress={handleSignUp}
              buttonStyle={styles.button}
              titleStyle={styles.buttonTitle}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#8A7D6D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
    paddingVertical: 14,
    backgroundColor: COLORS.buttonBackground,
  },
  buttonTitle: {
    fontWeight: 'bold',
    color: '#fff',
  },
  avatar: {
    alignSelf: 'center',
    marginTop: 10,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 10,
    backgroundColor: 'rgba(247, 230, 202, 0.8)',
    borderRadius: 20,
    padding: 5,
  },
});