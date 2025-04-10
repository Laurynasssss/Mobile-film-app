import { StyleSheet, Platform } from 'react-native';

export const searchstyles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "stretch",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 15,
      backgroundColor: "transparent",
      borderBottomWidth: 1,
      borderBottomColor: "#E6D5C7",
    },
    backButton: {
      marginRight: 10,
    },
    searchTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#8A7D6D",
    },
    movieItem: {
      flexDirection: "row",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#E6D5C7",
    },
    moviePoster: {
      width: 100,
      height: 150,
      borderRadius: 8,
    },
    movieDetails: {
      flex: 1,
      marginLeft: 10,
    },
    movieTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#8A7D6D",
    },
    movieOverview: {
      color: "#8A7D6D",
      marginTop: 5,
    },
    emptyState: {
      textAlign: "center",
      marginTop: 50,
      fontSize: 18,
      color: "#8A7D6D",
    },
  });
  