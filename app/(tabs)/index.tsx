import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '@/lib/supabse';
import { checkOrCreateUserRow } from '@/lib/supabasefunctions';
import { Input, Button, Text } from '@rneui/themed';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  interpolate 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
  backgroundStart: '#F7E6CA',
  backgroundEnd: '#E8D59E',
  buttonBackground: '#D9BBB1',
  inputBorder: '#8A7D6D',
};

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const gradientAnimation = useSharedValue(0);

  useEffect(() => {
    gradientAnimation.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );
  }, []);

  const animatedGradientStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(gradientAnimation.value, [0, 1], [0.8, 1])
    };
  });

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert('Error', error.message);
    else {
      setLoading(false);
      checkOrCreateUserRow();
      router.push('/Movies');
    }
  }

  async function signUpWithEmail() {
router.push('/SignUpPage')
  }

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.push('/Movies');
      setLoading(false);
    }
    checkUser();
  }, [router]);

  return (
    <Animated.View style={[styles.animatedBackground, animatedGradientStyle]}>
      <LinearGradient
        colors={[COLORS.backgroundStart, COLORS.backgroundEnd]}
        style={styles.gradientBackground}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
        >
          <View style={styles.card}>
            <Text h2 style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Input
                  placeholder="Email Address"
                  leftIcon={{
                    type: 'font-awesome',
                    name: 'envelope',
                    color: COLORS.inputBorder,
                    size: 24, // Bigger icon size
                  }}
                  onChangeText={setEmail}
                  value={email}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholderTextColor={COLORS.inputBorder}
                  inputContainerStyle={styles.inputFieldContainer}
                  containerStyle={styles.inputFieldWrapper}
                  inputStyle={styles.input}
                  leftIconContainerStyle={styles.iconContainer} // Align icon properly
                />
              </View>
              <View style={styles.inputContainer}>
                <Input
                  placeholder="Password"
                  leftIcon={{
                    type: 'font-awesome',
                    name: 'lock',
                    color: COLORS.inputBorder,
                    size: 24, // Bigger icon size
                  }}
                  onChangeText={setPassword}
                  value={password}
                  secureTextEntry
                  autoCapitalize="none"
                  placeholderTextColor={COLORS.inputBorder}
                  inputContainerStyle={styles.inputFieldContainer}
                  containerStyle={styles.inputFieldWrapper}
                  inputStyle={styles.input}
                  leftIconContainerStyle={styles.iconContainer} // Align icon properly
                />
              </View>
            </View>

            <View style={styles.actions}>
              <Button
                title="Sign In"
                buttonStyle={[styles.button, { backgroundColor: COLORS.buttonBackground }]}
                titleStyle={styles.buttonTitle}
                loading={loading}
                onPress={signInWithEmail}
              />
              <Button
                title="Sign Up"
                buttonStyle={[styles.button, styles.secondaryButton]}
                titleStyle={styles.secondaryButtonTitle}
                loading={loading} 
                onPress={signUpWithEmail}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedBackground: {
    flex: 1,
  },
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
    color: '#8A7D6D',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#8A7D6D',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  inputFieldContainer: {
    borderBottomWidth: 0, // Remove the default underline
  },
  inputFieldWrapper: {
    paddingHorizontal: 0, // Remove extra padding
  },
  input: {
    borderWidth: 1, // Add outline
    borderColor: COLORS.inputBorder, // Outline color
    borderRadius: 10, // Rounded corners
    paddingHorizontal: 10, // Padding inside the input
    paddingVertical: 12, // Padding inside the input
    color: '#8A7D6D', // Text color
    width: '100%', // Ensure full width
  },
  iconContainer: {
    marginRight: 10, // Consistent spacing for icons
  },
  actions: {
    marginTop: 20,
    gap: 15,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 14,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.buttonBackground,
  },
  buttonTitle: {
    fontWeight: 'bold',
    color: '#fff',
  },
  secondaryButtonTitle: {
    fontWeight: 'bold',
    color: COLORS.buttonBackground,
  },
});