import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, TouchableOpacity } from 'react-native';

const RegisterScreen = ({ navigation }: any) => {
  // State cho form đăng ký
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  // TODO: Thêm logic đăng ký thực tế
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>
      <>
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor={'#4E443A'}
        />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={'#4E443A'}
        />
        <TextInput
          placeholder='Số điện thoại'
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType='phone-pad'
          placeholderTextColor={'#4E443A'}
        />
        <TextInput
          placeholder='Mật khẩu'
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={'#4E443A'}
        />
        <TextInput
          placeholder='Xác nhận mật khẩu'
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor={'#4E443A'}
        />
      </>
      <Pressable
        style={({ pressed }) => pressed ? { ...styles.btn, backgroundColor: '#FA812F' } : styles.btn}
        onPress={() => { }}
      >
        <Text style={styles.btnText}>Đăng ký</Text>
      </Pressable>
      <View style={styles.loginRow}>
        <Text>Đã có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.switchText}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEEFD2',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#4E443A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: '#000000',
  },
  switchText: {
    color: '#007bff',
    textAlign: 'center',
  },
  btn: {
    backgroundColor: '#840000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  btnText: {
    color: '#fff',
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default RegisterScreen;
