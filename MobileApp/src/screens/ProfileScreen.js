import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '@react-native-vector-icons/ionicons';
import Dialog from 'react-native-dialog';

const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    const parsed = JSON.parse(userData);
                    setUser(parsed);
                    setAvatarUrl(parsed.avatar);
                    setName(parsed.name);
                    setPhone(parsed.phone);
                    setAddress(parsed.address);
                    setEmail(parsed.email)
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

    const handleSaveProfile = async () => {
        if (!avatarUrl.trim() || !name.trim() || !phone.trim() || !address.trim()) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ tất cả các trường.');
            return;
        }

        const updatedUser = {
            ...user,
            avatar: avatarUrl.trim(),
            name: name.trim(),
            phone: phone.trim(),
            address: address.trim(),
            email: email.trim(),
        };

        try {
            const response = await fetch(`http://10.0.2.2:3000/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) throw new Error('Không thể cập nhật thông tin người dùng');

            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setShowDialog(false);
            Alert.alert('Thành công', 'Thông tin người dùng đã được cập nhật');
        } catch (err) {
            console.error('Lỗi cập nhật:', err);
            Alert.alert('Lỗi', 'Không thể cập nhật, vui lòng thử lại');
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
                    <Text style={styles.editAvatarText}>Chỉnh sửa thông tin</Text>
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

            <Dialog.Container visible={showDialog}>
                <Dialog.Title>Chỉnh sửa thông tin</Dialog.Title>

                <View style={styles.inputRow}>
                    <Text style={styles.label}>Ảnh:</Text>
                    <Dialog.Input
                        value={avatarUrl}
                        onChangeText={setAvatarUrl}
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputRow}>
                    <Text style={styles.label}>Email:</Text>
                    <Dialog.Input
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputRow}>
                    <Text style={styles.label}>Tên:</Text>
                    <Dialog.Input
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputRow}>
                    <Text style={styles.label}>SĐT:</Text>
                    <Dialog.Input
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputRow}>
                    <Text style={styles.label}>Địa chỉ:</Text>
                    <Dialog.Input
                        value={address}
                        onChangeText={setAddress}
                        style={styles.input}
                    />
                </View>

                <Dialog.Button label="Hủy" onPress={() => setShowDialog(false)} />
                <Dialog.Button label="Lưu" onPress={handleSaveProfile} />
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
