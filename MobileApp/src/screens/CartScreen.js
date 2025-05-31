import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import Icon from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const CartScreen = ({ navigation }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const userData = await AsyncStorage.getItem('user');
            if (!userData) return;

            const user = JSON.parse(userData);
            const res = await axios.get(`http://10.0.2.2:3000/api/carts?userId=${user.id}&_expand=product`);
            console.log('Cart data:', res.data);
            setCartItems(res.data);
            calculateTotal(res.data);
        } catch (error) {
            console.error('Lỗi lấy giỏ hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = (items) => {
        const sum = items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
        setTotal(sum);
    };

    const updateQuantity = async (itemId, newQuantity) => {
        try {
            if (newQuantity < 1) return;
            await axios.patch(`http://10.0.2.2:3000/api/carts/${itemId}`, { quantity: newQuantity });
            fetchCart();
        } catch (error) {
            console.error('Lỗi cập nhật số lượng:', error);
        }
    };

    const deleteItem = async (itemId) => {
        Alert.alert('Xác nhận', 'Bạn có chắc muốn xoá sản phẩm này?', [
            { text: 'Huỷ' },
            {
                text: 'Xoá',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await axios.delete(`http://10.0.2.2:3000/api/carts/${itemId}`);
                        fetchCart();
                    } catch (error) {
                        console.error('Lỗi xoá sản phẩm:', error);
                    }
                },
            },
        ]);
    };

    const handleCheckout = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (!userData) return;
            const user = JSON.parse(userData);

            const invoiceData = {
                userId: user.id,
                items: cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.product.price,
                })),
                total,
                createdAt: new Date().toISOString(),
            };

            await axios.post('http://10.0.2.2:3000/api/invoices', invoiceData);

            await Promise.all(
                cartItems.map(item =>
                    axios.delete(`http://10.0.2.2:3000/api/carts/${item.id}`)
                )
            );

            Alert.alert('Thành công', 'Đơn hàng của bạn đã được thanh toán!');
            fetchCart();
        } catch (error) {
            console.error('Lỗi khi thanh toán:', error);
            Alert.alert('Lỗi', 'Không thể thanh toán đơn hàng.');
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCart();
        }, [])
    );

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Image source={{ uri: item.product.image }} style={styles.image} />
            <View style={styles.details}>
                <Text style={styles.name}>{item.product.name}</Text>
                <Text style={styles.price}>{item.product.price.toLocaleString()}₫</Text>
                <View style={styles.quantityRow}>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Icon name="remove-circle-outline" size={24} color="#FF69B4" />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Icon name="add-circle-outline" size={24} color="#FF69B4" />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity onPress={() => deleteItem(item.id)}>
                <Icon name="trash-outline" size={24} color="#888" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Giỏ Hàng</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#FF69B4" />
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: 80 }}
                    />
                    <View style={styles.totalContainer}>
                        <View>
                            <Text style={styles.totalText}>Tổng cộng:</Text>
                            <Text style={styles.totalAmount}>{total.toLocaleString()}₫</Text>
                        </View>
                        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                            <Text style={styles.checkoutText}>Thanh toán</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#FF69B4',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10,
    },
    details: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    quantity: {
        marginHorizontal: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalAmount: {
        fontSize: 18,
        color: '#FF69B4',
        fontWeight: 'bold',
    },
    checkoutButton: {
        backgroundColor: '#FF69B4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    checkoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
