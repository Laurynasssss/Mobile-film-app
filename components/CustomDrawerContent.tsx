import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

function CustomDrawerContent({ }: DrawerContentComponentProps) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const categories = [
    'Action',
    'Comedy',
    'Drama',
    'Science Fiction',
    'Horror',
    'Thriller'
  ];

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Movies */}
      <TouchableOpacity
        onPress={() => router.push('/Movies')}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 15
        }}
      >
        <Ionicons name="film-outline" size={28} style={{ marginRight: 15 }} />
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Movies</Text>
      </TouchableOpacity>

      {/* Saved Movies */}
      <TouchableOpacity
        onPress={() => router.push('/SavedMovies')}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 15
        }}
      >
        <Ionicons name="bookmark-outline" size={28} style={{ marginRight: 15 }} />
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Saved Movies</Text>
      </TouchableOpacity>

      {/* Categories */}
      <TouchableOpacity
        onPress={() => setIsCategoryOpen(!isCategoryOpen)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 15
        }}
      >
        <Ionicons name="folder-outline" size={28} style={{ marginRight: 15 }} />
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
          Categories {isCategoryOpen ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {/* Subcategories */}
      {isCategoryOpen && (
        <View style={{ marginLeft: 20, marginTop: 10 }}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => router.push(`/categories/${category}`)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10
              }}
            >
              <Ionicons name="film-outline" size={24} style={{ marginRight: 10 }} />
              <Text style={{ fontSize: 20 }}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

export default CustomDrawerContent;