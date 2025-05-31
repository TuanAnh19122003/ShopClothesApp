import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import Icon from '@react-native-vector-icons/ionicons';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [avatar, setAvatar] = useState('');
    
    const handleLogin = () => {
        navigation.navigate('Login');
    }

    const handleRegister = async () => {
        if (!name || !email || !phone || !address) {
            Alert.alert('Missing Info', 'Please fill in all fields');
            return;
        }
        try {
            const response = await axios.post('http://10.0.2.2:3000/api/users', {
                name,
                email,
                password,
                phone,
                address
            })
            if (response.status === 201 || response.status === 200) {
                Alert.alert('Success', 'User registered successfully');
                navigation.navigate('Login');
            } else {
                Alert.alert('Error', 'Failed to register user');
            }
        } catch (error) {
            console.error('Error registering user:', error);
            Alert.alert('Error', 'Failed to register user');
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.logo}>
                <Icon name="shirt-outline" size={60} color="white" />
                <Text style={styles.logoText}>FashionHub</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.title}>Create Account</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={{ color: 'grey', fontSize: 16 }}>Already have an account? </Text>
                    <TouchableOpacity onPress={handleLogin}>
                        <Text style={{ fontSize: 16, color: '#FF69B4' }}>Login</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.formRegister} showsVerticalScrollIndicator={false}>
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor="#B0B0B0"
                        value={name}
                        onChangeText={(text) => setName(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#B0B0B0"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#B0B0B0"
                        secureTextEntry = {true}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        placeholderTextColor="#B0B0B0"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={(text) => setPhone(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Address"
                        placeholderTextColor="#B0B0B0"
                        value={address}
                        onChangeText={(text) => setAddress(text)}
                    />

                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                        <Text style={styles.registerButtonText}>Register</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    )
}

export default RegisterScreen

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
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
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
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FF69B4',
        marginBottom: 10,
    },
    formRegister: {
        marginTop: 30,
    },
    input: {
        height: 50,
        marginVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 15,
        backgroundColor: '#F5F5F5',
        fontSize: 16,
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    registerButton: {
        backgroundColor: '#FF69B4',
        paddingVertical: 15,
        borderRadius: 15,
        marginTop: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    registerButtonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
})
