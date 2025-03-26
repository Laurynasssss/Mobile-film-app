import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { searchMovies } from '@/lib/tmdbfunctions';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export const MovieSearchHeader: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
 
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    try {
      setIsSearching(true);
      const results = await searchMovies(query);
     
      // Navigate to search results screen and pass the results
      router.push({
        pathname: '/SearchResultScreen',
        params: {
          searchResults: JSON.stringify(results),
          query: query
        }
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };
 
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Ionicons
          name="search"
          size={18}
          color="#614C3E"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          placeholderTextColor="#A99E92"
          returnKeyType="search"
          autoCapitalize="none"
          selectionColor="#D9BBB0"
        />
        {query.length > 0 && (
          <TouchableOpacity 
            onPress={() => setQuery('')}
            style={styles.clearButton}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color="#8A7D6D"
            />
          </TouchableOpacity>
        )}
        {query.length > 0 && (
          <TouchableOpacity 
            onPress={handleSearch}
            style={styles.searchButton}
            disabled={isSearching}
          >
            {isSearching ? (
              <ActivityIndicator size="small" color="#614C3E" />
            ) : (
              <Ionicons
                name="arrow-forward-circle"
                size={24}
                color="#614C3E"
              />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: width * 0.7,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F0EB',
    borderRadius: 20,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E6D5C9',
    height: 40,
    shadowColor: "#614C3E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#614C3E',
    fontSize: 16,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
    marginRight: 4,
  },
  searchButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  }
});