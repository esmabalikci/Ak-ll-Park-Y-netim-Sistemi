import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { getApiBaseUrl } from '../config/api.js';

export default function ParksScreen({ navigation, route }) {
  const { city, district } = route.params || {};
  const [searchText, setSearchText] = useState('');
  const [parks, setParks] = useState([]);
  const [filteredParks, setFilteredParks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchParks = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${getApiBaseUrl()}/api/parks?city=${encodeURIComponent(city)}&district=${encodeURIComponent(district)}`
      );

      const data = await response.json().catch(() => ({}));

      if (data.success === true) {
        const list = Array.isArray(data.parks) ? data.parks : [];
        setParks(list);
        setFilteredParks(list);
      } else {
        setParks([]);
        setFilteredParks([]);
      }
    } catch (error) {
      console.error('Park fetch error:', error);
      setParks([]);
      setFilteredParks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParks();
  }, [city, district]);

  useEffect(() => {
    const text = searchText.toLowerCase();

    const filtered = parks.filter((park) => {
      return (
        park.name.toLowerCase().includes(text) ||
        park.location.toLowerCase().includes(text)
      );
    });

    setFilteredParks(filtered);
  }, [searchText, parks]);

  const renderParkCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ParkDetail', { park: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.cardBody}>
        <Text style={styles.parkName}>{item.name}</Text>
        <Text style={styles.location}>📍 {item.location}</Text>
        <Text style={styles.info}>Tür: {item.type}</Text>
        <Text style={styles.info}>
          Kapasite: {item.capacity ? item.capacity : 'Bilinmiyor'}
        </Text>
        <Text style={styles.info}>Doluluk: %{item.occupancyRate}</Text>

        <View style={[styles.statusBadge, styles.available]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => navigation.navigate('ParkDetail', { park: item })}
          >
            <Text style={styles.buttonText}>Detayı Gör</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.reserveButton}
            onPress={() => navigation.navigate('ParkDetail', { park: item })}
          >
            <Text style={styles.buttonText}>Rezervasyon</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0f5c69" />
        <Text style={{ marginTop: 12 }}>Parklar yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {city} / {district} Parkları
      </Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Park adı veya konuma göre ara..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredParks}
        keyExtractor={(item) => item.id}
        renderItem={renderParkCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Bu ilçe için park bulunamadı.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dff1f4',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f5c69',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 15,
    elevation: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 18,
    overflow: 'hidden',
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 180,
  },
  cardBody: {
    padding: 14,
  },
  parkName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#124d57',
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    color: '#456b72',
    marginBottom: 6,
  },
  info: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  available: {
    backgroundColor: '#c8f7c5',
  },
  statusText: {
    fontWeight: '600',
    color: '#124d57',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  detailButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  reserveButton: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#666',
  },
});