import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function ParkDetailScreen({ route }) {
  const { park } = route.params;

  const handleReservation = () => {
    Alert.alert(
      'Rezervasyon',
      `${park.name} için rezervasyon ekranına geçilecek.`
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: park.image }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{park.name}</Text>
          <View
            style={[
              styles.statusBadge,
              typeof park.occupancyRate === 'number' && park.occupancyRate > 90
                ? styles.statusDolu
                : styles.statusMusait,
            ]}
          >
            <Text style={styles.statusText}>{park.status}</Text>
          </View>
        </View>
        
        <Text style={styles.location}>📍 {park.location}</Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Uzaklık</Text>
            <Text style={styles.infoValue}>{park.distance ? `${park.distance} km` : 'Bilinmiyor'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Boyut</Text>
            <Text style={styles.infoValue}>
              {typeof park.size_sqm === 'number' ? `${park.size_sqm} m²` : 'Bilinmiyor'}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Kapasite</Text>
            <Text style={styles.infoValue}>
              {typeof park.capacity === 'number' ? `${park.capacity} Kişi` : 'Bilinmiyor'}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Doluluk</Text>
            <Text style={styles.infoValue}>
              {typeof park.occupancyRate === 'number' ? `%${park.occupancyRate}` : 'Bilinmiyor'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Etkinlikler</Text>
        <View style={styles.activitiesContainer}>
          {Array.isArray(park.activities) && park.activities.length > 0 ? park.activities.map((activity, index) => (
            <View key={index} style={styles.activityBadge}>
              <Text style={styles.activityText}>{activity}</Text>
            </View>
          )) : (
            <Text style={styles.description}>Etkinlik bilgisi bulunmuyor.</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Açıklama</Text>
        <Text style={styles.description}>{park.description}</Text>

        <Text style={styles.sectionTitle}>Müsaitlik Bilgisi</Text>
        <Text style={styles.description}>
          Bu alanda kullanıcılar belirli tarih ve saat aralıklarında rezervasyon
          yapabilir. Sonraki aşamada burada saat seçimi ve uygunluk kontrolü
          eklenecektir.
        </Text>

        <TouchableOpacity style={styles.reserveButton} onPress={handleReservation}>
          <Text style={styles.reserveButtonText}>Rezervasyon Yap</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#124d57',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusMusait: {
    backgroundColor: '#d1fae5',
  },
  statusDolu: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#124d57',
  },
  location: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 15,
    marginBottom: 25,
  },
  infoItem: {
    width: '48%',
    padding: 10,
    marginVertical: 5,
  },
  infoLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
    marginTop: 10,
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  activityBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  activityText: {
    color: '#0369a1',
    fontSize: 13,
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
    marginBottom: 20,
  },
  reserveButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});