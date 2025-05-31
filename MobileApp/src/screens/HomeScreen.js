import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Alert
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [userAvatar, setUserAvatar] = useState(null);


    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://10.0.2.2:3000/api/products');
            setProducts(res.data);
        } catch (err) {
            console.error('Lỗi khi fetch sản phẩm:', err);
        } finally {
            setLoading(false);
        }
    };
    const fetchUser = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUserName(parsedUser.name || 'FashionHub');
                setUserAvatar(parsedUser.avatar || null);
            }

        } catch (err) {
            console.log('Lỗi lấy thông tin người dùng:', err);
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (!userData) {
                Alert.alert('Thông báo', 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
                return;
            }

            const user = JSON.parse(userData);
            const payload = {
                userId: user.id,
                productId: productId,
                quantity: 1,
            };

            await axios.post('http://10.0.2.2:3000/api/carts', payload);
            Alert.alert('Thành công', 'Sản phẩm đã được thêm vào giỏ hàng');
        } catch (error) {
            console.error('Lỗi thêm vào giỏ hàng:', error);
            Alert.alert('Lỗi', 'Không thể thêm vào giỏ hàng');
        }
    };



    useEffect(() => {
        fetchProducts();
        fetchUser();
    }, []);

    const renderItemProduct = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item })} style={styles.productItem}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <View style={styles.priceAndAdd}>
                <Text style={styles.price}>{item.price.toLocaleString()}₫</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddToCart(item.id)}
                >
                    <Icon name="add" size={20} color="white" />
                </TouchableOpacity>
            </View>

        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.appbar}>
                <View style={styles.userInfo}>
                    <Text style={styles.greetingText}>Xin chào, {userName}</Text>
                    {userAvatar ? (
                        <Image source={{ uri: userAvatar }} style={styles.avatar} />
                    ) : (
                        <Icon name="person-circle-outline" size={60} color="#C7A17A" />
                    )}
                </View>

            </View>

            <View style={styles.searchBar}>
                <TextInput
                    placeholder="Tìm kiếm sản phẩm..."
                    placeholderTextColor="#888"
                    style={styles.search}
                />
                <Icon name="search" size={30} style={styles.icon} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#FF69B4" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderItemProduct}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.productList}
                />
            )}
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    appbar: {
        height: 180,
        backgroundColor: '#FFE4E1',
        justifyContent: 'flex-end',
    },
    userInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        paddingBottom: 50,
        alignItems: 'center',
    },
    greetingText: {
        color: '#C71585',
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchBar: {
        marginHorizontal: 20,
        marginTop: -30,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    search: {
        flex: 1,
        fontSize: 16,
    },
    icon: {
        marginLeft: 10,
        color: '#888',
    },
    productList: {
        padding: 10,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#C7A17A',
    },
    productItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        margin: 10,
        width: '45%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
    },
    productImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    productName: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        color: '#4E342E',
        width: '100%',
        height: 40,
    },
    priceAndAdd: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF7043',
    },
    addButton: {
        backgroundColor: '#FF7043',
        borderRadius: 8,
        padding: 6,
    },
});
