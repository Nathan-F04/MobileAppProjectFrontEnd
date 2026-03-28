// App
// - Purpose: Application entry point. Sets up auth context and React Navigation.
//   Shows Login/Register screens when unauthenticated, main app screens when authenticated.

import { useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Notifications from 'expo-notifications';

import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import InventoryScreen from './screens/InventoryScreen';
import ProductBrowser from './screens/ProductBrowser';
import ProductBasket from './screens/ProductBasket';
import CarBasket from './screens/CarBasket';
import CarBrowser from './screens/CarBrowser';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: { borderTopColor: COLORS.border, backgroundColor: COLORS.card },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home:         focused ? 'home'      : 'home-outline',
            Listings: focused ? 'list'      : 'list-outline',
            Basket:      focused ? 'bar-chart' : 'bar-chart-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="My Listings" component={InventoryScreen} />
      <Tab.Screen name="Basket" component={CarBasket} />
    </Tab.Navigator>
  );
}

function Navigation() {
  const { token, loading } = useAuth();
  const navigationRef = useRef(null);

  useEffect(() => {
    // Navigate to the basket when the user taps a notification.
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response received:', response);
      console.log('[Notification tapped] navigating to basket');
      navigationRef.current?.navigate('CarBasket');
    });
    return () => subscription.remove();
  }, []);

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /></View>;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        {token ? (
          // Authenticated screens
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Inventory" component={InventoryScreen} options={{ title: 'Inventory' }} />
            <Stack.Screen name="ProductBrowser" component={ProductBrowser} options={{ title: 'Products' }} />
            <Stack.Screen name="ProductBasket" component={ProductBasket} options={{ title: 'Basket' }} />
            <Stack.Screen name="CarBrowser" component={CarBrowser} options={{ title: 'Cars' }} />
            <Stack.Screen name="CarBasket" component={CarBasket} options={{ title: 'Basket' }} />
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          </>
        ) : (
          // Auth screens
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Sign In' }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create Account' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
