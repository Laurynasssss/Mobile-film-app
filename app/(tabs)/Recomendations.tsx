import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { getMovieRecommendations } from "@/lib/tmdbfunctions";
import { router } from 'expo-router';
import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { recstyles } from "@/styles/reccomendationstyles";

const Recommendations = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 9;
  const moviesPerRow = 3;

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getMovieRecommendations();
      setMovies(data);
    };
    fetchMovies();
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
    <LinearGradient colors={['#F7E6CA', '#D9BBB1']} style={recstyles.container}>
      <FlatList
        data={paginatedMovies}
        keyExtractor={(item) => item.id.toString()}
        numColumns={moviesPerRow}
        contentContainerStyle={recstyles.flatListContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item.id)}
            style={recstyles.movieCard}
          >
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
              style={recstyles.movieImage}
            />
            <Text style={recstyles.movieTitle}>{item.title}</Text>
            <View style={recstyles.starsContainer}>{renderStars(item.vote_average / 2)}</View>
          </TouchableOpacity>
        )}
      />
      <View style={recstyles.paginationContainer}>
        <Button
          title="Previous"
          onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          buttonStyle={recstyles.paginationButton}
          titleStyle={recstyles.paginationButtonText}
        />
        <Text style={recstyles.pageText}>
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          title="Next"
          onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          buttonStyle={recstyles.paginationButton}
          titleStyle={recstyles.paginationButtonText}
        />
      </View>
    </LinearGradient>
  );
};

export default Recommendations;
