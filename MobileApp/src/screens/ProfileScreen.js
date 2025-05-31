import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '@react-native-vector-icons/ionicons';
import Dialog from 'react-native-dialog';

const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [newAvatarUrl, setNewAvatarUrl] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (err) {
                console.log('Lỗi khi lấy user:', err);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('user');
        Alert.alert('Đăng xuất', 'Bạn đã đăng xuất thành công');
        navigation.replace('Login');
    };

    const handleSaveAvatar = async () => {
        if (!newAvatarUrl.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập link ảnh hợp lệ.');
            return;
        }

        const updatedUser = { ...user, avatar: newAvatarUrl.trim() };

        try {
            const response = await fetch(`http://10.0.2.2:3000/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) {
                throw new Error('Không thể cập nhật người dùng trên server');
            }

            // Cập nhật local
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setShowDialog(false);
            setNewAvatarUrl('');
            Alert.alert('Thành công', 'Ảnh đại diện đã được cập nhật');
        } catch (err) {
            console.error('Lỗi cập nhật avatar:', err);
            Alert.alert('Lỗi', 'Cập nhật ảnh thất bại, vui lòng thử lại');
        }
    };

    if (!user) {
        return (
            <View style={styles.centered}>
                <Text style={{ fontSize: 16 }}>Đang tải thông tin người dùng...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setShowDialog(true)}>
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                </TouchableOpacity>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>
                <TouchableOpacity onPress={() => setShowDialog(true)}>
                    <Text style={styles.editAvatarText}>Chỉnh sửa ảnh đại diện</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                    <Icon name="call-outline" size={24} color="#FF69B4" />
                    <Text style={styles.infoText}>{user.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Icon name="location-outline" size={24} color="#FF69B4" />
                    <Text style={styles.infoText}>{user.address}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Icon name="log-out-outline" size={22} color="white" />
                <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>

            {/* Hộp thoại nhập link ảnh */}
            <Dialog.Container visible={showDialog}>
                <Dialog.Title>Đổi ảnh đại diện</Dialog.Title>
                <Dialog.Description>Nhập link ảnh mới của bạn:</Dialog.Description>
                <Dialog.Input
                    value={newAvatarUrl}
                    onChangeText={setNewAvatarUrl}
                    placeholder="https://link-anh.jpg"
                />
                <Dialog.Button label="Hủy" onPress={() => setShowDialog(false)} />
                <Dialog.Button label="Lưu" onPress={handleSaveAvatar} />
            </Dialog.Container>
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: 80,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 3,
        borderColor: '#FF69B4',
        shadowColor: '#FF69B4',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    name: {
        fontSize: 26,
        fontWeight: '700',
        color: '#333',
        marginTop: 15,
    },
    email: {
        fontSize: 16,
        color: '#888',
        marginTop: 5,
    },
    editAvatarText: {
        fontSize: 14,
        color: '#FF69B4',
        marginTop: 8,
        textDecorationLine: 'underline',
    },
    infoContainer: {
        width: '100%',
        marginTop: 30,
        backgroundColor: '#fefefe',
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
    },
    infoText: {
        fontSize: 17,
        color: '#444',
        marginLeft: 15,
    },
    logoutButton: {
        marginTop: 40,
        backgroundColor: '#FF69B4',
        paddingVertical: 14,
        paddingHorizontal: 60,
        borderRadius: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FF69B4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    logoutText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 8,
    },
});
