import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { searchMovies } from "@/lib/tmdbfunctions";

interface SearchBarProps {
  onSearchResults: (results: any[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchResults }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (query.trim()) {
      try {
        setIsLoading(true);
        const results = await searchMovies(query);
        onSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearchResults([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchIconContainer}>
        <Ionicons 
          name="search" 
          size={18} 
          color="#614C3E" 
        />
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Search movies..."
        placeholderTextColor="#A99E92"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        selectionColor="#D9BBB0"
      />
      
      {isLoading ? (
        <ActivityIndicator size="small" color="#8A7D6D" style={styles.button} />
      ) : (
        query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.button}>
            <Ionicons name="close-circle" size={20} color="#8A7D6D" />
          </TouchableOpacity>
        )
      )}
      
      <TouchableOpacity onPress={handleSearch} style={styles.button}>
        <Ionicons name="arrow-forward-circle" size={24} color="#614C3E" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F0EB',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginHorizontal: 10,
    width: 250,
    height: 40,
    borderWidth: 1,
    borderColor: '#E6D5C9',
    shadowColor: "#614C3E",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3.84,
    elevation: 2,
  },
  searchIconContainer: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#614C3E',
    paddingVertical: 8,
  },
  button: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchBar;