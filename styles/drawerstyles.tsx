// Create a file at: @/styles/drawerStyles.ts
import { StyleSheet, Platform } from 'react-native';

// Export the styles
export const drawerStyles = StyleSheet.create({
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
