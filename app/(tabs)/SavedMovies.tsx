import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { getFavoriteMovies } from "@/lib/tmdbfunctions";
import { router } from 'expo-router';
import { getSavedMovies } from "@/lib/supabasefunctions";
import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

const FavoriteMoviesList: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 9;
  const moviesPerRow = 3;

  useEffect(() => {
    const loadFavoriteMovies = async () => {
      const result = await getSavedMovies();
      if (result.success) {
        const data = await getFavoriteMovies(result.data);
        setMovies(data);
      }
    };
    loadFavoriteMovies();
  }, []);

  const handlePress = (movieId: number) => {
    router.push(`/movies/${movieId}`);
  };

  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const paginatedMovies = movies.slice(
    (currentPage - 1) * moviesPerPage,
    currentPage * moviesPerPage
  );

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const starColor = "#8A7D6D"; 
    
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
            <View style={styles.starsContainer}>{renderStars(item.vote_average / 2)}</View>
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

export default FavoriteMoviesList;

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
});
