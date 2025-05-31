import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react';
import Icon from '@react-native-vector-icons/ionicons';

const SplashScreen = ({ navigation }) => {
    const handleLogin = () => {
        navigation.navigate('Login');
    }
    const handleRegister = () => {
        navigation.navigate('Register');
    }
    
    return (
        <ImageBackground
            style={styles.container}
            source={require('../assets/img/bg.png')}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <Image
                    style={styles.logo}
                    source={require('../assets/img/logo.png')}
                />
                <Text style={styles.title}>Chào mừng đến với shop clothing store</Text>
            </View>
            <View style={styles.navigation}>
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Icon name="person-add-outline" size={24} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Icon name="log-in-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    overlay: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        marginTop: 150,
        borderRadius: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        color: '#1C1C1E'
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 20,
        borderRadius: 100,
        overflow: 'hidden',
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        bottom: 30,
        width: '100%',
        paddingHorizontal: 30
    },
    button: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    }
})