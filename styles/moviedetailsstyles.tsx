import { StyleSheet, Platform } from 'react-native';

export const detailstyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F7E6CA",
    },
    scrollContainer: {
      flex: 1,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F7E6CA",
      padding: 20,
    },
    loadingText: {
      marginTop: 10,
      color: "#8A7D6D",
      fontSize: 16,
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
    heroSection: {
      height: 300,
      position: "relative",
    },
    backdrop: {
      width: "100%",
      height: "100%",
      opacity: 0.5,
    },
    posterContainer: {
      position: "absolute",
      bottom: -100,
      left: 20,
    },
    poster: {
      width: 130,
      height: 195,
      borderRadius: 8,
    },
    contentContainer: {
      paddingTop: 110,
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#8A7D6D",
      textAlign: "center",
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 5,
    },
    metadata: {
      fontSize: 16,
      color: "#8A7D6D",
    },
    separator: {
      marginHorizontal: 8,
      color: "#8A7D6D",
    },
    ratingContainer: {
      alignItems: "center",
      marginVertical: 8,
    },
    starContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    starIcon: {
      marginHorizontal: 2,
    },
    ratingText: {
      marginLeft: 6,
      color: "#8A7D6D",
      fontSize: 14,
    },
    genreContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginVertical: 10,
    },
    genreTag: {
      backgroundColor: "#D9BBB1",
      borderRadius: 15,
      paddingHorizontal: 12,
      paddingVertical: 5,
      margin: 4,
    },
    genreText: {
      color: "#F7E6CA",
      fontSize: 14,
      fontWeight: "500",
    },
    overview: {
      fontSize: 16,
      color: "#8A7D6D",
      marginVertical: 18,
      lineHeight: 22,
    },
    button: {
      backgroundColor: "#8A7D6D",
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: "center",
      marginTop: 20,
    },
    disabledButton: {
      backgroundColor: "#E6D5C7",
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    disabledButtonText: {
      color: "#8A7D6D",
    }
  });
  