import { StyleSheet } from 'react-native';

export const COLORS = {
  backgroundStart: '#F7E6CA',
  backgroundEnd: '#E8D59E',
  buttonBackground: '#D9BBB1',
  inputBorder: '#8A7D6D', // Border color
  textColor: '#8A7D6D', // Text color
  placeholderColor: '#8A7D6D', // Placeholder text color
};

export const signupstyles = StyleSheet.create({
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