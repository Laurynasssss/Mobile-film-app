import React, { useState, useEffect } from 'react';
import { View, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '@/lib/supabse';
import { checkOrCreateUserRow } from '@/lib/supabasefunctions';
import { Input, Button, Text } from '@rneui/themed';
import { router } from 'expo-router';
import { loginstyles, COLORS } from "@/styles/loginstyles"
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  interpolate 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

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
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        checkOrCreateUserRow();
        router.push('/Movies');
      }
    } catch (error) {
      Alert.alert('Incorrect username or password');
    } finally {
      setLoading(false);
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
    <Animated.View style={[loginstyles.animatedBackground, animatedGradientStyle]}>
      <LinearGradient
        colors={[COLORS.backgroundStart, COLORS.backgroundEnd]}
        style={loginstyles.gradientBackground}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={loginstyles.container}
        >
          <View style={loginstyles.card}>
            <Text h2 style={loginstyles.title}>Welcome Back</Text>
            <Text style={loginstyles.subtitle}>Sign in to continue</Text>

            <View style={loginstyles.form}>
              <View style={loginstyles.inputContainer}>
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
                  inputContainerStyle={loginstyles.inputFieldContainer}
                  containerStyle={loginstyles.inputFieldWrapper}
                  inputStyle={loginstyles.input}
                  leftIconContainerStyle={loginstyles.iconContainer} // Align icon properly
                />
              </View>
              <View style={loginstyles.inputContainer}>
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
                  inputContainerStyle={loginstyles.inputFieldContainer}
                  containerStyle={loginstyles.inputFieldWrapper}
                  inputStyle={loginstyles.input}
                  leftIconContainerStyle={loginstyles.iconContainer} // Align icon properly
                />
              </View>
            </View>

            <View style={loginstyles.actions}>
              <Button
                title="Sign In"
                buttonStyle={[loginstyles.button, { backgroundColor: COLORS.buttonBackground }]}
                titleStyle={loginstyles.buttonTitle}
                loading={loading}
                onPress={signInWithEmail}
              />
              <Button
                title="Sign Up"
                buttonStyle={[loginstyles.button, loginstyles.secondaryButton]}
                titleStyle={loginstyles.secondaryButtonTitle}
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
