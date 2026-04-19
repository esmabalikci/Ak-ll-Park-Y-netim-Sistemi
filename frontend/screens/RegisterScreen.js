import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';

export default function RegisterScreen({ navigation }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const validateEmail = (text) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(text);
    };

    const handleRegister = async () => {
        if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !password.trim()) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Hata', 'Lütfen geçerli bir email adresi girin.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Hata', 'Şifreniz en az 6 karakter olmalıdır.');
            return;
        }

        setLoading(true);

        const fullName = `${firstName.trim()} ${lastName.trim()}`;

        try {
            const response = await fetch('http://10.0.2.2:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ full_name: fullName, email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                Alert.alert('Başarılı', data.message || 'Kayıt başarılı. Şimdi giriş yapabilirsiniz.', [
                    {
                        text: 'Tamam',
                        onPress: () => navigation.navigate('Login'),
                    },
                ]);
            } else {
                Alert.alert('Hata', data.message || 'Kayıt başarısız.');
            }
        } catch (error) {
            console.error('Register hatası:', error);
            Alert.alert('Hata', 'Sunucuya bağlanılamadı.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    <Text style={styles.title}>Kayıt Ol</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Ad"
                            placeholderTextColor="#888"
                            value={firstName}
                            onChangeText={setFirstName}
                            autoCorrect={false}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Soyad"
                            placeholderTextColor="#888"
                            value={lastName}
                            onChangeText={setLastName}
                            autoCorrect={false}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Kullanıcı Adı"
                            placeholderTextColor="#888"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="E-posta"
                            placeholderTextColor="#888"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Şifre"
                            placeholderTextColor="#888"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                            autoCapitalize="none"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading && <ActivityIndicator color="#fff" style={styles.loader} />}
                        <Text style={styles.buttonText}>
                            {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.loginLinkContainer} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginLinkText}>Zaten hesabın var mı? Giriş yap</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#e6f7f5', // Bütün ekranı kaplayan açık nane yeşili
    },
    keyboardContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingVertical: 40,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#135c5c',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 25,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#b2dfdb',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        fontSize: 15,
        color: '#333'
    },
    button: {
        backgroundColor: '#26a69a', // Teal renk tonu
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonDisabled: {
        backgroundColor: '#80cbc4',
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
    },
    loader: {
        marginRight: 10,
    },
    loginLinkContainer: {
        alignItems: 'center',
    },
    loginLinkText: {
        fontSize: 14,
        color: '#00897b',
    },
});
