import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const LoginScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>LoginScreen</Text>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 32,
        fontWeight: 'bold'
    }
})