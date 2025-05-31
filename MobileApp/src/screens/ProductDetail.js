import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ProductDetailScreen = ({ route, navigation }) => {
    const { product } = route.params;

    const handleAddToCart = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (!userData) {
                Alert.alert('Thông báo', 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
                return;
            }

            const user = JSON.parse(userData);
            const res = await axios.get(`http://10.0.2.2:3000/api/carts?userId=${user.id}&productId=${product.id}`);
            const existingItem = res.data[0];

            if (existingItem) {
                await axios.patch(`http://10.0.2.2:3000/api/carts/${existingItem.id}`, {
                    quantity: existingItem.quantity + 1,
                });
            } else {
                const payload = {
                    userId: user.id,
                    productId: product.id,
                    quantity: 1,
                };
                await axios.post('http://10.0.2.2:3000/api/carts', payload);
            }

            Alert.alert('Thành công', 'Sản phẩm đã được thêm vào giỏ hàng');
        } catch (error) {
            console.error('Lỗi thêm vào giỏ hàng:', error);
            Alert.alert('Lỗi', 'Không thể thêm vào giỏ hàng');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <Image source={{ uri: product.image }} style={styles.image} />

                <View style={styles.content}>
                    <Text style={styles.name}>{product.name}</Text>
                    <Text style={styles.price}>{product.price.toLocaleString()}₫</Text>
                    <Text style={styles.description}>{product.description}</Text>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="chevron-back" size={24} color="#FF69B4" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                    <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 500,
        resizeMode: 'cover',
    },
    content: {
        padding: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    price: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FF7043',
        marginVertical: 10,
    },
    description: {
        fontSize: 16,
        color: '#555',
        lineHeight: 22,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderTopWidth: 1,
        borderColor: '#eee',
        alignItems: 'center',
    },
    backButton: {
        padding: 8,
        backgroundColor: '#FFE4E1',
        borderRadius: 10,
    },
    addToCartButton: {
        flex: 1,
        marginLeft: 15,
        backgroundColor: '#FF69B4',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    addToCartText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
