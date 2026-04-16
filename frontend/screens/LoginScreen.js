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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (text) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(text);
    };

    const handleLogin = async () => {
        if (!email.trim()) {
            Alert.alert('Hata', 'Lütfen email adresinizi girin.');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Hata', 'Lütfen geçerli bir email adresi girin.');
            return;
        }

        if (!password.trim()) {
            Alert.alert('Hata', 'Lütfen şifrenizi girin.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://10.0.2.2:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                console.log('Kullanıcı Bilgileri:', data.user);

                Alert.alert('Başarılı', data.message || 'Giriş başarılı.', [
                    {
                        text: 'Tamam',
                        onPress: () => navigation.replace('Home', { user: data.user }),
                    },
                ]);
            } else {
                Alert.alert('Hata', data.message || 'Giriş başarısız.');
            }
        } catch (error) {
            console.error('Login hatası:', error);
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
                <View style={styles.container}>
                    <Text style={styles.title}>APAYS Giriş</Text>
                    <Text style={styles.subtitle}>Hesabınıza giriş yapın</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <View style={styles.passwordWrapper}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Şifre"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeButton}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={22}
                                    color="#555"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading && <ActivityIndicator color="#fff" style={styles.loader} />}
                        <Text style={styles.buttonText}>
                            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() =>
                            Alert.alert('Bilgi', 'Şifre sıfırlama ekranı daha sonra eklenecek.')
                        }
                    >
                        <Text style={styles.forgotPassword}>Şifremi unuttum</Text>
                    </TouchableOpacity>

                    <View style={styles.registerRow}>
                        <Text style={styles.registerText}>Hesabın yok mu? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.registerLink}>Kayıt Ol</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f4f6f8',
    },
    keyboardContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#222',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginBottom: 35,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingRight: 12,
        marginBottom: 5,
    },
    passwordInput: {
        flex: 1,
        padding: 15,
        fontSize: 16,
    },
    eyeButton: {
        padding: 4,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#7fb3ff',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loader: {
        marginRight: 10,
    },
    forgotPassword: {
        textAlign: 'center',
        marginTop: 16,
        color: '#007BFF',
        fontSize: 15,
    },
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    registerText: {
        fontSize: 15,
        color: '#444',
    },
    registerLink: {
        fontSize: 15,
        color: '#007BFF',
        fontWeight: 'bold',
    },
});