
import { StyleSheet, Platform } from 'react-native';

export const COLORS = {
  backgroundStart: '#F7E6CA',
  backgroundEnd: '#E8D59E',
  buttonBackground: '#D9BBB1',
  inputBorder: '#8A7D6D',
};

export const loginstyles = StyleSheet.create({
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