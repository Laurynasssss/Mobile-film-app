import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
      style={styles.movieItem}
      onPress={() => router.push(`/movies/${item.id}`)}
    >
      <Image 
        source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
        style={styles.moviePoster}
        resizeMode="cover"
      />
      <View style={styles.movieDetails}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.movieOverview} numberOfLines={3}>
          {item.overview}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#F7E6CA', '#D9BBB1']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#8A7D6D" />
        </TouchableOpacity>
        <Text style={styles.searchTitle}>Results for "{query}"</Text>
      </View>

      <FlatList
        data={parsedResults}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyState}>No movies found</Text>
        }
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
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

export default SearchResultsScreen;
