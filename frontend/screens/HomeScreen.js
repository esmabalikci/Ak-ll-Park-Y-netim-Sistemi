import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';

export default function HomeScreen({ route, navigation }) {
    const user = route.params?.user;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Hoş Geldin</Text>
                <Text style={styles.subtitle}>
                    {user?.full_name || user?.email || 'Kullanıcı'}
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.replace('Login')}
                >
                    <Text style={styles.buttonText}>Çıkış Yap</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f4f6f8',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#555',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#dc3545',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
    },
});