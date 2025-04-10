import { StyleSheet, Platform } from 'react-native';

export const categorystyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    flatListContent: {
      paddingBottom: 20,
    },
    movieCard: {
      flex: 1 / 3,
      alignItems: 'center',
      margin: 5,
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      padding: 10,
      shadowColor: '#8A7D6D',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    movieImage: {
      width: 100,
      height: 150,
      borderRadius: 10,
    },
    movieTitle: {
      marginTop: 10,
      fontSize: 14,
      color: '#8A7D6D',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    starsContainer: {
      flexDirection: 'row',
      marginTop: 5,
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      marginTop: 10,
      shadowColor: '#8A7D6D',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    paginationButton: {
      backgroundColor: '#D9BBB1',
      borderRadius: 10,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    paginationButtonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    pageText: {
      fontSize: 16,
      color: '#8A7D6D',
      fontWeight: 'bold',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 18,
      color: '#8A7D6D',
      fontWeight: 'bold',
    }
  });