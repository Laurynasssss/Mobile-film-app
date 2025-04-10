//git
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, ScrollView, TouchableOpacity, Animated } from "react-native";
import { getMovieDetails } from "@/lib/tmdbfunctions";
import { saveToWatched, isMovieInWatchedList } from "@/lib/supabasefunctions";
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { detailstyles } from "@/styles/moviedetailsstyles";
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
      <View style={detailstyles.starContainer}>
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
            style={detailstyles.starIcon}
          />
        ))}
        <Text style={detailstyles.ratingText}>{normalizedRating.toFixed(1)}/5</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <LinearGradient colors={['#F7E6CA', '#D9BBB1']} style={detailstyles.loaderContainer}>
        <ActivityIndicator size="large" color="#D9BBB1" />
        <Text style={detailstyles.loadingText}>Loading movie details...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#F7E6CA', '#D9BBB1']} style={detailstyles.container}>
      <View style={detailstyles.backButtonContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#8A7D6D" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={detailstyles.scrollContainer}>
        <View style={detailstyles.heroSection}>
          <Image 
            source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.backdrop_path || movie?.poster_path}` }} 
            style={detailstyles.backdrop} 
            blurRadius={2} 
          />
          <View style={detailstyles.posterContainer}>
            <Image 
              source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` }} 
              style={detailstyles.poster} 
              resizeMode="cover" 
            />
          </View>
        </View>

        <View style={detailstyles.contentContainer}>
          <Text style={detailstyles.title}>{movie?.title}</Text>
          <View style={detailstyles.infoRow}>
            <Text style={detailstyles.metadata}>{movie?.release_date?.split("-")[0] || "N/A"}</Text>
            <Text style={detailstyles.separator}>•</Text>
            <Text style={detailstyles.metadata}>{formatRuntime(movie?.runtime)}</Text>
          </View>
          <View style={detailstyles.ratingContainer}>
            {renderStarRating(movie?.vote_average)}
          </View>
          <View style={detailstyles.genreContainer}>
            {movie?.genres && movie.genres.length > 0 ? (
              movie.genres.map((genre) => (
                <View key={genre.id} style={detailstyles.genreTag}>
                  <Text style={detailstyles.genreText}>{genre.name}</Text>
                </View>
              ))
            ) : (
              <View style={detailstyles.genreTag}>
                <Text style={detailstyles.genreText}>No genres available</Text>
              </View>
            )}
          </View>
          <Text style={detailstyles.overview}>{movie?.overview || "No description available."}</Text>

          <Animated.View style={{ opacity: fadeAnim }}>
            <TouchableOpacity 
              style={[detailstyles.button, isWatched && detailstyles.disabledButton]} 
              onPress={handlePress} 
              disabled={isWatched}
            >
              <Text style={[detailstyles.buttonText, isWatched && detailstyles.disabledButtonText]}>
                {buttonText}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};
export default MovieDetails;