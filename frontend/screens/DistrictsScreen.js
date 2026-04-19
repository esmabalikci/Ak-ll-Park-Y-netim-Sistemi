import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { districtsData } from '../data/districtsData';

export default function DistrictsScreen({ route, navigation }) {
  const { city } = route.params;
  const [searchText, setSearchText] = useState('');

  const districts = districtsData[city] || [];

  const filteredDistricts = useMemo(() => {
    return districts.filter((district) =>
      district.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [districts, searchText]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{city} / İlçe Seçin</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="İlçe ara..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredDistricts}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemCard}
            onPress={() => navigation.navigate('MapParks', { city, district: item })}          >
            <Text style={styles.itemText}>{item}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#dff1f4', padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f5c69',
    textAlign: 'center',
    marginBottom: 16,
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
  itemCard: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: { fontSize: 16, fontWeight: '600', color: '#124d57' },
  arrow: { fontSize: 24, color: '#124d57', fontWeight: 'bold' },
});