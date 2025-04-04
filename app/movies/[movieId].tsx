//git
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Animated } from "react-native";
import { getMovieDetails } from "@/lib/tmdbfunctions";
import { saveToWatched, isMovieInWatchedList } from "@/lib/supabasefunctions";
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
//a
interface Genre {
  id: number;
  name: string;
}

interface MovieData {
  id: string;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  release_date?: string;
  runtime?: number;
  vote_average?: number;
  genres?: Genre[];
  overview?: string;
}

const MovieDetails = () => {
  const { movieId } = useLocalSearchParams();
  const router = useRouter();

  const [movie, setMovie] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWatched, setIsWatched] = useState(false);
  const [buttonText, setButtonText] = useState("Add to Watched");
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    (async () => {
      if (typeof movieId === "string") {
        const data = await getMovieDetails(movieId);
        setMovie(data);
        setLoading(false);

        const result = await isMovieInWatchedList(movieId);
        if (result.success && result.isInList) {
          setIsWatched(true);
          setButtonText("✓ Added to Watched");
        }
      }
    })();
  }, [movieId]);

  const handlePress = async () => {
    if (typeof movieId === "string" && !isWatched) {
      const result = await saveToWatched(movieId);
      if (result.success) {
        setIsWatched(true);
        setButtonText("✓ Added to Watched");
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        alert(`⚠️ Error: ${result.error}`);
      }
    }
  };

  const formatRuntime = (minutes: number | undefined): string => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const renderStarRating = (rating: number | undefined) => {
    if (!rating && rating !== 0) return null;
    const normalizedRating = Math.round((rating / 2) * 2) / 2;
    const fullStars = Math.floor(normalizedRating);
    const hasHalfStar = normalizedRating % 1 !== 0;
    
    return (
      <View style={styles.starContainer}>
        {[...Array(5)].map((_, i) => (
          <Icon
            key={i}
            name={
              i < fullStars
                ? "star"
                : i === fullStars && hasHalfStar
                ? "star-half-o"
                : "star-o"
            }
            size={16}
            color="#FFD700"
            style={styles.starIcon}
          />
        ))}
        <Text style={styles.ratingText}>{normalizedRating.toFixed(1)}/5</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <LinearGradient colors={['#F7E6CA', '#D9BBB1']} style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#D9BBB1" />
        <Text style={styles.loadingText}>Loading movie details...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#F7E6CA', '#D9BBB1']} style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#8A7D6D" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.backdrop_path || movie?.poster_path}` }} 
            style={styles.backdrop} 
            blurRadius={2} 
          />
          <View style={styles.posterContainer}>
            <Image 
              source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` }} 
              style={styles.poster} 
              resizeMode="cover" 
            />
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{movie?.title}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.metadata}>{movie?.release_date?.split("-")[0] || "N/A"}</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.metadata}>{formatRuntime(movie?.runtime)}</Text>
          </View>
          <View style={styles.ratingContainer}>
            {renderStarRating(movie?.vote_average)}
          </View>
          <View style={styles.genreContainer}>
            {movie?.genres && movie.genres.length > 0 ? (
              movie.genres.map((genre) => (
                <View key={genre.id} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))
            ) : (
              <View style={styles.genreTag}>
                <Text style={styles.genreText}>No genres available</Text>
              </View>
            )}
          </View>
          <Text style={styles.overview}>{movie?.overview || "No description available."}</Text>

          <Animated.View style={{ opacity: fadeAnim }}>
            <TouchableOpacity 
              style={[styles.button, isWatched && styles.disabledButton]} 
              onPress={handlePress} 
              disabled={isWatched}
            >
              <Text style={[styles.buttonText, isWatched && styles.disabledButtonText]}>
                {buttonText}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
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

export default MovieDetails;