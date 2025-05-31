import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from '@react-native-vector-icons/ionicons';
import { View, Text, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#FF69B4',
                tabBarInactiveTintColor: '#999',
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.label,
                tabBarIcon: ({ focused, color }) => {
                    let iconName;

                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Cart') iconName = focused ? 'cart' : 'cart-outline';
                    else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

                    return (
                        <View style={styles.iconContainer}>
                            <Icon name={iconName} size={focused ? 28 : 24} color={color} />
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Cart" component={CartScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default BottomTab;

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#ffffff',
        height: 75,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 15,
        paddingBottom: 10,
        paddingTop: 5,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 5,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
});
