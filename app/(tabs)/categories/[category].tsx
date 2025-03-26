import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { fetchByCategory, fetchPopularMovies } from "@/lib/tmdbfunctions";
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

// Define a type for the movie object to improve type safety
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average?: number; // Made optional to match your existing interface
}

const MovieList = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 9;
  const moviesPerRow = 3;
  const { category } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Received movie category:", category);
    const fetchMovies = async () => {
      try {
        if (typeof category === "string") {
          const data = await fetchByCategory(category);
          setMovies(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };
    fetchMovies();
  }, [category]);

  const handlePress = (movieId: number) => {
    router.push(`/movies/${movieId}`);
  };

  // Add a check to prevent errors when movies is empty
  const totalPages = movies.length > 0 ? Math.ceil(movies.length / moviesPerPage) : 0;
 
  const paginatedMovies = movies.length > 0
    ? movies.slice(
        (currentPage - 1) * moviesPerPage,
        currentPage * moviesPerPage
      )
    : [];

  const renderStars = (rating: number = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2); // Assuming rating is out of 10, converting to out of 5
    const halfStar = (rating / 2) % 1 !== 0;
    const starColor = "#8A7D6D"; // Matching the layout color
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={`full-${i}`} name="star" size={16} color={starColor} />);
    }
    if (halfStar) {
      stars.push(<Icon key="half" name="star-half-full" size={16} color={starColor} />);
    }
    while (stars.length < 5) {
      stars.push(<Icon key={`empty-${stars.length}`} name="star-o" size={16} color={starColor} />);
    }
    return stars;
  };

  // Add a loading state render
  if (loading) {
    return (
      <LinearGradient colors={['#F7E6CA', '#D9BBB1']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading movies...</Text>
        </View>
      </LinearGradient>
    );
  }

  // Add a no movies found state
  if (movies.length === 0) {
    return (
      <LinearGradient colors={['#F7E6CA', '#D9BBB1']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No movies found for this category.</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#F7E6CA', '#D9BBB1']} style={styles.container}>
      <FlatList
        data={paginatedMovies}
        keyExtractor={(item) => item.id.toString()}
        numColumns={moviesPerRow}
        contentContainerStyle={styles.flatListContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item.id)}
            style={styles.movieCard}
          >
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
              style={styles.movieImage}
            />
            <Text style={styles.movieTitle}>{item.title}</Text>
            <View style={styles.starsContainer}>
              {renderStars(item.vote_average || 0)}
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={styles.paginationContainer}>
        <Button
          title="Previous"
          onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          buttonStyle={styles.paginationButton}
          titleStyle={styles.paginationButtonText}
        />
        <Text style={styles.pageText}>
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          title="Next"
          onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          buttonStyle={styles.paginationButton}
          titleStyle={styles.paginationButtonText}
        />
      </View>
    </LinearGradient>
  );
};

export default MovieList;

// Styles
const styles = StyleSheet.create({
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