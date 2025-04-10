import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { fetchByCategory, fetchPopularMovies } from "@/lib/tmdbfunctions";
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { categorystyles } from "@/styles/categorystyles";

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
      <LinearGradient colors={['#F7E6CA', '#D9BBB1']} style={categorystyles.container}>
        <View style={categorystyles.loadingContainer}>
          <Text style={categorystyles.loadingText}>Loading movies...</Text>
        </View>
      </LinearGradient>
    );
  }

  // Add a no movies found state
  if (movies.length === 0) {
    return (
      <LinearGradient colors={['#F7E6CA', '#D9BBB1']} style={categorystyles.container}>
        <View style={categorystyles.loadingContainer}>
          <Text style={categorystyles.loadingText}>No movies found for this category.</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#F7E6CA', '#D9BBB1']} style={categorystyles.container}>
      <FlatList
        data={paginatedMovies}
        keyExtractor={(item) => item.id.toString()}
        numColumns={moviesPerRow}
        contentContainerStyle={categorystyles.flatListContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item.id)}
            style={categorystyles.movieCard}
          >
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
              style={categorystyles.movieImage}
            />
            <Text style={categorystyles.movieTitle}>{item.title}</Text>
            <View style={categorystyles.starsContainer}>
              {renderStars(item.vote_average || 0)}
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={categorystyles.paginationContainer}>
        <Button
          title="Previous"
          onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          buttonStyle={categorystyles.paginationButton}
          titleStyle={categorystyles.paginationButtonText}
        />
        <Text style={categorystyles.pageText}>
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          title="Next"
          onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          buttonStyle={categorystyles.paginationButton}
          titleStyle={categorystyles.paginationButtonText}
        />
      </View>
    </LinearGradient>
  );
};

export default MovieList;
