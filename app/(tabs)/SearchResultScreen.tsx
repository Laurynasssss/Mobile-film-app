import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { searchstyles } from '@/styles/searchstyles';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
}

const SearchResultsScreen = () => {
  const { searchResults, query } = useLocalSearchParams<{
    searchResults: string;
    query: string;
  }>();
  const router = useRouter();

  const parsedResults: Movie[] = searchResults 
    ? JSON.parse(searchResults) 
    : [];

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity 
      style={searchstyles.movieItem}
      onPress={() => router.push(`/movies/${item.id}`)}
    >
      <Image 
        source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
        style={searchstyles.moviePoster}
        resizeMode="cover"
      />
      <View style={searchstyles.movieDetails}>
        <Text style={searchstyles.movieTitle}>{item.title}</Text>
        <Text style={searchstyles.movieOverview} numberOfLines={3}>
          {item.overview}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#F7E6CA', '#D9BBB1']} style={searchstyles.container}>
      <View style={searchstyles.header}>
        <TouchableOpacity onPress={() => router.back()} style={searchstyles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#8A7D6D" />
        </TouchableOpacity>
        <Text style={searchstyles.searchTitle}>Results for "{query}"</Text>
      </View>

      <FlatList
        data={parsedResults}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={searchstyles.emptyState}>No movies found</Text>
        }
      />
    </LinearGradient>
  );
};

export default SearchResultsScreen;
