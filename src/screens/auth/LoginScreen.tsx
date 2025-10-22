import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { Alert } from 'react-native';

/**
 * Màn hình đăng nhập: cho phép đăng nhập bằng tài khoản/mật khẩu hoặc OTP
 */
const LoginScreen = ({ navigation }: any) => {
  // State cho form đăng nhập
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false); // true: hiển thị form OTP
  const [otpSent, setOtpSent] = useState(false); // true: đã gửi OTP
  const { setLoggedIn } = useAuth();

  // Xử lý đăng nhập bằng tài khoản/mật khẩu
  const handleLogin = () => {
    // TODO: Thay bằng logic xác thực thực tế
    if (email && password) {
      setLoggedIn(true);
    } else {
      alert('Vui lòng nhập email và mật khẩu!');
    }
  };

  function alert(message: string) {
    Alert.alert('Thông báo', message);
  }


  // Xử lý gửi OTP
  const handleSendOtp = () => {
    // TODO: Gọi API gửi OTP về số điện thoại
    if (phone.length < 8) {
      alert('Vui lòng nhập số điện thoại hợp lệ!');
      return;
    }
    setOtpSent(true);
    alert('Đã gửi mã OTP (demo)!');
  };

  // Xử lý xác thực OTP
  const handleVerifyOtp = () => {
    // TODO: Gọi API xác thực OTP
    if (otp.length === 6) {
      setLoggedIn(true);
    } else {
      alert('Mã OTP không hợp lệ!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      {/* Chế độ đăng nhập bằng tài khoản/mật khẩu */}
      {!showOtp ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email đăng nhập"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={'#4E443A'}
          />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={'#4E443A'}
          />
          <Pressable
            style={({ pressed }) => pressed ? { ...styles.btn, backgroundColor: '#FA812F' } : styles.btn}
            onPress={handleLogin}
          >
            <Text style={styles.btnText}>Đăng nhập</Text>
          </Pressable>
          <TouchableOpacity onPress={() => setShowOtp(true)} style={styles.switchMode}>
            <Text style={styles.switchText}>Đăng nhập bằng OTP</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Chế độ đăng nhập bằng OTP */}
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor={'#4E443A'}
          />
          {otpSent && (
            <TextInput
              style={styles.input}
              placeholder="Nhập mã OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              placeholderTextColor={'#4E443A'}
            />
          )}
          {!otpSent ? (
            <Pressable
              style={({ pressed }) => pressed ? { ...styles.btn, backgroundColor: '#FA812F' } : styles.btn}
              onPress={handleSendOtp}
            >
              <Text style={styles.btnText}>Gửi mã OTP</Text>
            </Pressable>
          ) : (
            <Pressable
              style={({ pressed }) => pressed ? { ...styles.btn, backgroundColor: '#FA812F' } : styles.btn}
              onPress={handleVerifyOtp}
            >
              <Text style={styles.btnText}>Xác thực OTP</Text>
            </Pressable>
          )}
          <TouchableOpacity onPress={() => setShowOtp(false)} style={styles.switchMode}>
            <Text style={styles.switchText}>Đăng nhập bằng mật khẩu</Text>
          </TouchableOpacity>
        </>
      )}
      {/* Chuyển sang màn đăng ký */}
      <View style={styles.loginRow}>
        <Text>Chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.switchText}>Đăng ký</Text>
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
    marginBottom: 24,
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
  switchMode: {
    marginTop: 12,
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

export default LoginScreen;
