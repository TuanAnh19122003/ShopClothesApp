import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from '@react-native-vector-icons/ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const toggleRememberMe = () => {
        setRememberMe(!rememberMe)
    }

    const handleRegister = () => {
        navigation.navigate('Register');
    }

    useEffect(() => {
        const loadRemembered = async () => {
            const remembered = await AsyncStorage.getItem('rememberMe');
            const savedEmail = await AsyncStorage.getItem('rememberedEmail');
            const savedPassword = await AsyncStorage.getItem('rememberedPassword');

            if (remembered === 'true' && savedEmail && savedPassword) {
                setEmail(savedEmail);
                setPassword(savedPassword);
                setRememberMe(true);
            }
        };
        loadRemembered();
    }, []);


    const handleLogin = async () => {
        try {
            const response = await axios.get(
                `http://10.0.2.2:3000/api/users/?email=${email}&password=${password}`
            );
            const users = response.data;
            if (users.length > 0) {
                const user = users[0];
                await AsyncStorage.setItem('user', JSON.stringify(user));

                if (rememberMe) {
                    await AsyncStorage.setItem('rememberMe', 'true');
                    await AsyncStorage.setItem('rememberedEmail', email);
                    await AsyncStorage.setItem('rememberedPassword', password);
                } else {
                    await AsyncStorage.removeItem('rememberMe');
                    await AsyncStorage.removeItem('rememberedEmail');
                    await AsyncStorage.removeItem('rememberedPassword');
                }

                Alert.alert('Đăng nhập thành công', `Xin chào ${user.name}`);
                navigation.navigate('Home');
            }

        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            Alert.alert('Lỗi', 'Không thể đăng nhập. Vui lòng thử lại sau.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logo}>
                <Icon name="shirt-outline" size={60} color="white" />
                <Text style={styles.logoText}>FashionHub</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.title}>Welcome Back!</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={{ color: 'grey', fontSize: 16 }}>Don't have an account? </Text>
                    <TouchableOpacity onPress={handleRegister}>
                        <Text style={{ fontSize: 16, color: '#FF69B4' }}>Register</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.formLogin}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#B0B0B0"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#B0B0B0"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <View style={styles.rememberSection}>
                        <TouchableOpacity style={styles.customCheckbox} onPress={toggleRememberMe}>
                            <Icon
                                name={rememberMe ? "checkbox-outline" : "square-outline"}
                                size={24}
                                color="#FF69B4"
                            />
                            <Text style={{ marginLeft: 8, fontSize: 16 }}>Remember Me</Text>
                        </TouchableOpacity>

                        <View style={{ alignItems: 'flex-end', paddingRight: 20 }}>
                            <TouchableOpacity>
                                <Text style={{ fontSize: 16, color: '#FF69B4' }}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.orStyle}>
                    <View style={styles.line}></View>
                    <Text style={styles.orText}>OR</Text>
                    <View style={styles.line}></View>
                </View>

                <View style={styles.loginWith}>
                    <TouchableOpacity style={styles.loginOption}>
                        <Icon name="logo-google" size={30} style={styles.icon} />
                        <Text> Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.loginOption}>
                        <Icon name="logo-facebook" size={30} style={styles.icon} />
                        <Text> Facebook</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FF69B4',
    },
    logo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
    },
    logoText: {
        marginTop: 10,
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white',
        fontStyle: 'italic',
    },
    form: {
        flex: 3,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        paddingTop: 40,
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF69B4',
    },
    formLogin: {
        paddingTop: 40,
    },
    input: {
        height: 50,
        margin: 12,
        paddingHorizontal: 15,
        borderRadius: 15,
        backgroundColor: '#F9F9F9',
        fontSize: 16,
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    rememberSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    rememberCheckbox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
    },
    customCheckbox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 2,
    },
    loginButton: {
        backgroundColor: '#FF69B4',
        paddingVertical: 15,
        borderRadius: 15,
        marginTop: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    loginButtonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    orStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30,
        marginVertical: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#999',
        marginHorizontal: 10,
    },
    orText: {
        fontSize: 16,
        color: '#666',
    },
    loginWith: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    loginOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
        backgroundColor: '#F1F1F1',
    },
    icon: {
        marginRight: 10,
        color: '#555',
    },
})
