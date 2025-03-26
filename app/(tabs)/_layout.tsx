import React, { useState, useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert, Image } from 'react-native';
import { router, usePathname } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MovieSearchHeader } from '@/components/MovieSearchHeader';
import { supabase } from '@/lib/supabse';
import {fetchUserData} from '@/lib/supabasefunctions'

// Custom Drawer Content
const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [userData, setUserData] = useState<{ username: string; picture: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data when component mounts
  useEffect(() => {
    const getUserData = async () => {
      setIsLoading(true);
      const data = await fetchUserData();
      setUserData(data);
      setIsLoading(false);
    };

    getUserData();
  }, []);

  const categories = [
    'Action',
    'Comedy',
    'Drama',
    'Science Fiction',
    'Horror',
    'Thriller'
  ];

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.auth.signOut();
              if (error) {
                Alert.alert('Logout Error', error.message);
                return;
              }
              router.push('/');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'An unexpected error occurred');
            }
          },
        },
      ]
    );
  };

  const pathname = usePathname();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      {/* Header Section */}
      <View style={styles.drawerHeader}>
        <View style={styles.avatarContainer}>
          {userData?.picture ? (
            <Image 
              source={{ uri: userData.picture }} 
              style={styles.avatarImage} 
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person-circle" size={60} color="#8A7D6D" />
          )}
        </View>
        <Text style={styles.welcomeText}>
          Welcome back, {userData?.username || 'User'}!
        </Text>
      </View>
      
      <View style={styles.divider} />

      {/* Movies */}
      <TouchableOpacity
        onPress={() => router.push('/Movies')}
        style={[
          styles.drawerItem,
          pathname === '/Movies' && styles.activeItem
        ]}
      >
        <Ionicons 
          name={pathname === '/Movies' ? "film" : "film-outline"} 
          size={24} 
          style={[styles.icon, pathname === '/Movies' && styles.activeIcon]} 
        />
        <Text style={[styles.drawerItemText, pathname === '/Movies' && styles.activeText]}>Movies</Text>
      </TouchableOpacity>

      {/* Saved Movies */}
      <TouchableOpacity
        onPress={() => router.push('/SavedMovies')}
        style={[
          styles.drawerItem,
          pathname === '/SavedMovies' && styles.activeItem
        ]}
      >
        <Ionicons 
          name={pathname === '/SavedMovies' ? "bookmark" : "bookmark-outline"} 
          size={24} 
          style={[styles.icon, pathname === '/SavedMovies' && styles.activeIcon]} 
        />
        <Text style={[styles.drawerItemText, pathname === '/SavedMovies' && styles.activeText]}>Saved Movies</Text>
      </TouchableOpacity>

      {/* Recommendations */}
      <TouchableOpacity
        onPress={() => router.push('/Recomendations')}
        style={[
          styles.drawerItem,
          pathname === '/Recomendations' && styles.activeItem
        ]}
      >
        <Ionicons 
          name={pathname === '/Recomendations' ? "star" : "star-outline"} 
          size={24} 
          style={[styles.icon, pathname === '/Recomendations' && styles.activeIcon]} 
        />
        <Text style={[styles.drawerItemText, pathname === '/Recomendations' && styles.activeText]}>Recommendations</Text>
      </TouchableOpacity>

      {/* Categories */}
      <TouchableOpacity
        onPress={() => setIsCategoryOpen(!isCategoryOpen)}
        style={styles.drawerItem}
      >
        <Ionicons 
          name={isCategoryOpen ? "folder-open" : "folder-outline"} 
          size={24} 
          style={styles.icon} 
        />
        <Text style={styles.drawerItemText}>
          Categories {isCategoryOpen ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
      
      {/* Subcategories */}
      {isCategoryOpen && (
        <View style={styles.subcategoryContainer}>
          {categories.map((category) => {
            const isActive = pathname === `/categories/${category}`;
            return (
              <TouchableOpacity
                key={category}
                onPress={() => router.push(`/categories/${category}`)}
                style={[styles.subcategoryItem, isActive && styles.activeSubcategoryItem]}
              >
                <View style={styles.subcategoryDot} />
                <Text style={[styles.subcategoryText, isActive && styles.activeSubcategoryText]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
          
        </View>
      )}

      {/* Profile Settings */}
      <TouchableOpacity
        onPress={() => router.push('/ProfileSettings')}
        style={[
          styles.drawerItem,
          pathname === '/ProfileSettings' && styles.activeItem
        ]}
      >
        <Ionicons 
          name={pathname === '/ProfileSettings' ? "settings" : "settings-outline"} 
          size={24} 
          style={[styles.icon, pathname === '/ProfileSettings' && styles.activeIcon]} 
        />
        <Text style={[styles.drawerItemText, pathname === '/ProfileSettings' && styles.activeText]}>Profile Settings</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        onPress={handleLogout}
        style={[styles.drawerItem, styles.logoutItem]}
      >
        <Ionicons name="log-out-outline" size={24} style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

// Layout Component
export default function Layout() {
  const pathname = usePathname();

  // Hide header and drawer on the index page
  const isIndexPage = pathname === '/';
  const isSignUpPage = pathname === '/SignUpPage';
  const shouldHideHeader = isIndexPage || isSignUpPage;
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: !shouldHideHeader,
        drawerStyle: {
          backgroundColor: '#F5F0EB', // Lighter background color
          width: '80%', 
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        headerStyle: {
          backgroundColor: '#F7E6CA',
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 1.84,
          elevation: 3,
        },
        headerTitleStyle: {
          color: '#614C3E', // Darker text for better contrast
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerTintColor: '#614C3E',
        swipeEdgeWidth: 100, // Make drawer easier to open with swipe
      }}
    >
      {/* Movies Screen */}
      <Drawer.Screen
        name="Movies"
        options={{
          headerTitle: '', // Hide default header title
          headerRight: () => <MovieSearchHeader />,
        }}
      />

      {/* Saved Movies Screen */}
      <Drawer.Screen
        name="SavedMovies"
        options={{
          title: 'Saved Movies',
        }}
      />

      {/* Recommendations Screen */}
      <Drawer.Screen
        name="Recomendations"
        options={{
          title: 'Recommendations',
        }}
      />
      <Drawer.Screen
        name="SearchResultScreen"
        options={{
          title: '',
          headerRight: () => <MovieSearchHeader />, // Add the search bar here
        }}
      />
      <Drawer.Screen
        name="ProfileSettings"
        options={{
          title: 'Profile',
        }}
      />
      <Drawer.Screen
        name="categories/[category]"
        options={{
          title: '',
          headerRight: () => <MovieSearchHeader />,
        }}
      />
    </Drawer>
  );
}

// Enhanced Styles
const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  drawerHeader: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6D5C9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden', // Ensure image stays within circular container
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#614C3E',
    marginTop: 5,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0D5CE',
    marginVertical: 10,
    marginHorizontal: 15,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  activeItem: {
    backgroundColor: '#E6D5C9',
  },
  drawerItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8A7D6D',
  },
  activeText: {
    color: '#614C3E',
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 15,
    color: '#8A7D6D',
  },
  activeIcon: {
    color: '#614C3E',
  },
  subcategoryContainer: {
    marginLeft: 20,
    paddingLeft: 24,
    borderLeftWidth: 1,
    borderLeftColor: '#E0D5CE',
    marginVertical: 5,
  },
  subcategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 2,
    borderRadius: 8,
  },
  activeSubcategoryItem: {
    backgroundColor: '#E6D5C9',
  },
  subcategoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8A7D6D',
    marginRight: 10,
  },
  subcategoryText: {
    fontSize: 14,
    color: '#8A7D6D',
  },
  activeSubcategoryText: {
    color: '#614C3E',
    fontWeight: 'bold',
  },
  logoutItem: {
    marginTop: 'auto', 
    marginHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#FFF0F0',
  },
  logoutIcon: {
    marginRight: 15,
    color: '#E57373',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E57373',
  },
});