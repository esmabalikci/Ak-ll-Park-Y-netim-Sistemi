import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { districtsData } from '../data/districtsData';

const BG = '#F9F9F8';
const GREEN = '#1B4332';
const GREEN_MUTED = '#2D6A4F';
const TAB_ACTIVE = '#1B4332';

/** Yerel dosyalar: ağ/URL sorunlarında kartların gri kalmaması için bundle içinde. */
const FEATURED_CITY_IMAGES = {
  İstanbul: require('../assets/cities/istanbul.jpg'),
  Ankara: require('../assets/cities/ankara.jpg'),
  İzmir: require('../assets/cities/izmir.jpg'),
  Antalya: require('../assets/cities/antalya.jpg'),
  Bursa: require('../assets/cities/bursa.jpg'),
};

const FEATURED = [
  { name: 'İstanbul' },
  { name: 'Ankara' },
  { name: 'İzmir' },
  { name: 'Antalya' },
  { name: 'Bursa' },
];

const FEATURED_NAMES = new Set(FEATURED.map((f) => f.name));

/** districtsData’da olmayan öne çıkan iller için gösterim (tahmini). */
const FEATURED_PARK_FALLBACK = {
  İstanbul: 52,
  İzmir: 41,
  Bursa: 34,
};

function normalizeTr(s) {
  return s.trim().toLocaleLowerCase('tr-TR');
}

function parkAreaLabel(cityName) {
  const districts = districtsData[cityName];
  if (districts?.length) {
    const n = Math.max(8, Math.round(districts.length * 2.2));
    return `${n} Park Alanı`;
  }
  const fallback = FEATURED_PARK_FALLBACK[cityName];
  if (fallback != null) return `${fallback} Park Alanı`;
  return null;
}

export default function CitiesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const searchRef = useRef(null);
  const [searchText, setSearchText] = useState('');

  const cities = useMemo(
    () => Object.keys(districtsData).sort((a, b) => a.localeCompare(b, 'tr')),
    []
  );

  const q = normalizeTr(searchText);

  const filteredFeatured = useMemo(() => {
    if (!q) return FEATURED;
    return FEATURED.filter((f) => normalizeTr(f.name).includes(q));
  }, [q]);

  const otherCities = useMemo(
    () => cities.filter((c) => !FEATURED_NAMES.has(c)),
    [cities]
  );

  const filteredOthers = useMemo(() => {
    if (!q) return otherCities;
    return otherCities.filter((c) => normalizeTr(c).includes(q));
  }, [otherCities, q]);

  const goDistricts = (city) => {
    if (!districtsData[city]) {
      Alert.alert(
        'Yakında',
        `${city} için ilçe listesi henüz uygulamada yok. Şimdilik veri girilmiş illerden seçim yapabilirsiniz.`
      );
      return;
    }
    navigation.navigate('Districts', { city });
  };

  const onCityCardPress = (city) => goDistricts(city);

  const bottomPad = Math.max(insets.bottom, 12) + 72;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate('Home')}
          hitSlop={12}
        >
          <Ionicons name="person-circle-outline" size={28} color={GREEN} />
        </TouchableOpacity>
        <Text style={styles.brand}>APAYS</Text>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => searchRef.current?.focus()}
          hitSlop={12}
        >
          <Ionicons name="search-outline" size={24} color={GREEN} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heroTitle}>Nereye gitmek istersiniz?</Text>
        <Text style={styles.heroSub}>
          Türkiye'nin eşsiz doğasını keşfetmek için bir il seçin.
        </Text>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={20} color="#8D99A5" style={styles.searchIcon} />
          <TextInput
            ref={searchRef}
            style={styles.searchInput}
            placeholder="İl ara (Örn. Antalya)"
            placeholderTextColor="#8D99A5"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {filteredFeatured.map((item, index) => (
          <TouchableOpacity
            key={item.name}
            style={styles.heroCardWrap}
            activeOpacity={0.92}
            onPress={() => onCityCardPress(item.name)}
          >
            <ImageBackground
              source={FEATURED_CITY_IMAGES[item.name]}
              style={styles.heroCard}
              imageStyle={styles.heroCardImage}
            >
              <View style={styles.heroGradient} />
              <View style={styles.heroTextBlock}>
                <Text style={styles.heroCity}>{item.name}</Text>
                <View style={styles.heroMetaRow}>
                  <Ionicons
                    name="leaf-outline"
                    size={16}
                    color="rgba(255,255,255,0.95)"
                    style={styles.heroMetaIcon}
                  />
                  <Text style={styles.heroMeta}>
                    {parkAreaLabel(item.name) ?? 'Doğa ve parklar'}
                  </Text>
                </View>
              </View>
              {index === 0 ? (
                <View style={styles.arrowFab}>
                  <Ionicons name="chevron-forward" size={22} color="#1B4332" />
                </View>
              ) : (
                <View style={styles.arrowFabMuted}>
                  <Ionicons name="chevron-forward" size={20} color="#fff" />
                </View>
              )}
            </ImageBackground>
          </TouchableOpacity>
        ))}

        {filteredOthers.length > 0 ? (
          <>
            <View style={styles.otherHeader}>
              <View style={[styles.otherIconCircle, styles.otherIconMargin]}>
                <Ionicons name="map-outline" size={20} color="#6B7280" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.otherTitle}>Diğer İller</Text>
                <Text style={styles.otherSub}>Türkiye'nin 81 ilini keşfedin</Text>
              </View>
            </View>

            {filteredOthers.map((city) => {
              const area = parkAreaLabel(city);
              return (
                <TouchableOpacity
                  key={city}
                  style={styles.otherRow}
                  activeOpacity={0.85}
                  onPress={() => onCityCardPress(city)}
                >
                  <View style={styles.otherDot} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.otherName}>{city}</Text>
                    {area ? <Text style={styles.otherHint}>{area}</Text> : null}
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={GREEN_MUTED} />
                </TouchableOpacity>
              );
            })}
          </>
        ) : null}

        {q && filteredFeatured.length === 0 && filteredOthers.length === 0 ? (
          <Text style={styles.empty}>Sonuç bulunamadı.</Text>
        ) : null}
      </ScrollView>

      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() =>
            Alert.alert(
              'Harita',
              'Haritayı il ve ilçe seçtikten sonra görebilirsiniz. Önce bir il seçin.'
            )
          }
        >
          <Ionicons name="map-outline" size={22} color={GREEN} />
          <Text style={styles.tabLabel}>Harita</Text>
        </TouchableOpacity>

        <View style={styles.tabItem}>
          <View style={styles.tabPill}>
            <Ionicons name="compass" size={22} color="#fff" />
            <Text style={[styles.tabLabelActive, styles.tabLabelActiveSpacing]}>Keşfet</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => Alert.alert('Favoriler', 'Favoriler ekranı yakında eklenecek.')}
        >
          <Ionicons name="heart-outline" size={22} color={GREEN} />
          <Text style={styles.tabLabel}>Favoriler</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => Alert.alert('Profil', 'Profil ekranı yakında eklenecek.')}
        >
          <Ionicons name="person-outline" size={22} color={GREEN} />
          <Text style={styles.tabLabel}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  brand: {
    fontSize: 18,
    fontWeight: '800',
    color: GREEN,
    letterSpacing: 1.2,
  },
  iconBtn: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: GREEN,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 15,
    color: '#5C6B73',
    lineHeight: 22,
    marginBottom: 20,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECEEEA',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 22,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 15,
    color: '#1a1a1a',
  },
  heroCardWrap: {
    marginBottom: 16,
    borderRadius: 18,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: { elevation: 4 },
    }),
  },
  heroCard: {
    height: 200,
    justifyContent: 'flex-end',
  },
  heroCardImage: {
    borderRadius: 18,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  heroTextBlock: {
    position: 'absolute',
    left: 18,
    bottom: 18,
    right: 56,
  },
  heroCity: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroMetaIcon: { marginRight: 6 },
  heroMeta: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
  },
  arrowFab: {
    position: 'absolute',
    right: 14,
    bottom: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowFabMuted: {
    position: 'absolute',
    right: 14,
    bottom: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 14,
  },
  otherIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8E9E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otherIconMargin: { marginRight: 12 },
  otherTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#374151',
  },
  otherSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  otherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ECEEEA',
  },
  otherDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GREEN_MUTED,
    marginRight: 12,
    opacity: 0.6,
  },
  otherName: {
    fontSize: 16,
    fontWeight: '600',
    color: GREEN,
  },
  otherHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  empty: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 24,
    fontSize: 15,
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 12 },
    }),
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
    paddingVertical: 4,
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TAB_ACTIVE,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    color: GREEN,
    fontWeight: '600',
  },
  tabLabelActive: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '700',
  },
  tabLabelActiveSpacing: { marginLeft: 6 },
});
