import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const BG = '#e6f7f5';
const GREEN = '#1B4332';
const GREEN_MID = '#2D6A4F';
const GREEN_LIGHT = '#d8f3dc';
const CARD_BG = '#FFFFFF';
const RED_LIGHT = '#FEE2E2';
const RED = '#DC2626';

const MENU_ITEMS = [
  {
    id: 'personal',
    title: 'Kişisel Bilgiler',
    icon: 'person',
    iconBg: '#E8F5E9',
    iconColor: GREEN_MID,
  },
  {
    id: 'notifications',
    title: 'Bildirim Ayarları',
    icon: 'notifications',
    iconBg: '#FFF8E1',
    iconColor: '#F59E0B',
  },
  {
    id: 'payment',
    title: 'Ödeme Yöntemleri',
    icon: 'card',
    iconBg: '#E3F2FD',
    iconColor: '#2196F3',
  },
  {
    id: 'help',
    title: 'Yardım Merkezi',
    icon: 'help-circle',
    iconBg: '#F3E5F5',
    iconColor: '#9C27B0',
  },
  {
    id: 'privacy',
    title: 'Gizlilik ve Güvenlik',
    icon: 'shield-checkmark',
    iconBg: '#E8F5E9',
    iconColor: GREEN_MID,
  },
];

export default function ProfileScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const user = route?.params?.user;

  const displayName = user?.full_name || 'Kullanıcı';
  const displayEmail = user?.email || 'kullanici@example.com';

  const handleMenuPress = (item) => {
    Alert.alert(item.title, `${item.title} ekranı yakında eklenecek.`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Üst Bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={GREEN} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Profile</Text>
        <TouchableOpacity
          onPress={() => Alert.alert('Ayarlar', 'Ayarlar ekranı yakında.')}
          hitSlop={12}
        >
          <Ionicons name="settings-outline" size={22} color={GREEN} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 16) + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profil Kartı ── */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Image
              source={{
                uri: 'https://ui-avatars.com/api/?name=' +
                  encodeURIComponent(displayName) +
                  '&background=d8f3dc&color=1B4332&size=128&bold=true&font-size=0.4',
              }}
              style={styles.avatar}
            />
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={12} color="#fff" />
            </View>
          </View>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profileEmail}>{displayEmail}</Text>
        </View>

        {/* ── İstatistikler ── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="document-text" size={20} color="#1565C0" />
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Rezervasyon</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: RED_LIGHT }]}>
              <Ionicons name="heart" size={20} color={RED} />
            </View>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Favori Parklar</Text>
          </View>
        </View>

        {/* ── Menü Listesi ── */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index < MENU_ITEMS.length - 1 && styles.menuItemBorder,
              ]}
              activeOpacity={0.7}
              onPress={() => handleMenuPress(item)}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon} size={20} color={item.iconColor} />
              </View>
              <Text style={styles.menuItemText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Çıkış Butonu ── */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={RED} />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },

  /* ── Üst Bar ── */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: GREEN,
  },

  scroll: {
    flex: 1,
  },

  /* ── Profil Kartı ── */
  profileCard: {
    marginHorizontal: 20,
    marginTop: 4,
    backgroundColor: GREEN_LIGHT,
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: { elevation: 3 },
    }),
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#fff',
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: GREEN,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: GREEN_MID,
    fontWeight: '500',
  },

  /* ── İstatistikler ── */
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 18,
    gap: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: GREEN,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },

  /* ── Menü ── */
  menuCard: {
    marginHorizontal: 20,
    marginTop: 18,
    backgroundColor: CARD_BG,
    borderRadius: 18,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },

  /* ── Çıkış ── */
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    backgroundColor: RED_LIGHT,
    borderRadius: 14,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: RED,
    marginLeft: 8,
  },
});
