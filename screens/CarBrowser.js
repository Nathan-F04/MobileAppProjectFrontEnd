import React, { useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Button, StyleSheet, Alert } from 'react-native';
import useCars from '../hooks/useCars';
import basketApi from '../api/basketApi';
import CarItem from '../components/CarItem';

// Simple constant userId for demo - in a real app, use auth and proper user ids
const DEMO_USER_ID = 'demo-user-1';

export default function CarBrowser({ navigation }) {
  const { cars, loading, fetchCars } = useCars();

  useEffect(() => {
    // Fetch cars on mount (do not clear the basket automatically)
    fetchCars().catch(err => Alert.alert('Error', String(err)));
  }, []);

  const handleAdd = async (carId) => {
    try {
      await basketApi.addToBasket({ userId: DEMO_USER_ID, carId, quantity: 1 });
      Alert.alert('Added', 'Car added to basket');
    } catch (err) {
      Alert.alert('Error adding', String(err));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Button title="Open Basket" onPress={() => navigation.navigate('CarBasket', { userId: DEMO_USER_ID })} />
      </View>

      {loading ? <ActivityIndicator size="large" /> : (
        <FlatList
          data={cars}
          keyExtractor={(i, idx) => i._id || i.id || String(idx)}
          renderItem={({ item }) => (
            <CarItem item={item} onAdd={handleAdd} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
});
