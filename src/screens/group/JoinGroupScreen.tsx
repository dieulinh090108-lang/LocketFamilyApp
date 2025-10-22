import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import QRScanner from '../../components/common/QRScanner';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { WINDOW_HEIGHT } from '../../utils';
import JoinGroupProfileModal from './JoinGroupProfileModal';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { saveUser } from '../../services/storage';

const JoinGroupScreen: React.FC = () => {
  const [groupCode, setGroupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleJoinGroup = () => {
    if (!groupCode.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã nhóm');
      return;
    }
    setShowProfileModal(true);
  };

  const handleProfileSubmit = (profile: { name: string; dob: Date; avatarUri: string | null }) => {
    setShowProfileModal(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      saveUser({ name: profile.name, dob: profile.dob, avatarUri: profile.avatarUri });
      Alert.alert(
        'Thành công',
        `Bạn đã tham gia nhóm với mã: ${groupCode}\nTên: ${profile.name}\nNgày sinh: ${profile.dob.toLocaleDateString('vi-VN')}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Main', { screen: 'Home', initial: false, })
          }
        ],
      );
      setGroupCode('');
    }, 3000);
  };

  const openQRscanner = () => {
    setShowQR(true);
  }

  const onQrRead = (qrtext: string) => {
    setGroupCode(qrtext);
    setShowQR(false);
    Alert.alert('Đã quét QR', qrtext);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tham gia nhóm</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập mã nhóm"
        value={groupCode}
        onChangeText={setGroupCode}
        placeholderTextColor={'#4E443A'}
        autoCapitalize="characters"
        editable={!loading}
      />
      <Pressable
        style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
        onPress={handleJoinGroup}
        disabled={loading}
      >
        <Text style={styles.btnText}>{loading ? 'Đang tham gia...' : 'Tham gia nhóm'}</Text>
      </Pressable>
      <View style={styles.qrContainer}>
        <Pressable
          style={({ pressed }) => [styles.qrButton, pressed && styles.qrButtonPressed]}
          onPress={() => openQRscanner()}>
          <Ionicons name="scan" size={44} color="#fff" style={styles.qrIcon} />
          <Text style={styles.qrLabel}>Quét mã QR</Text>
        </Pressable>
      </View>
      {showQR ? <QRScanner onRead={onQrRead} onClose={() => setShowQR(false)} /> : null}
      <JoinGroupProfileModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSubmit={handleProfileSubmit}
      />
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
    fontFamily: 'OpenSans-Bold',
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
    fontFamily: 'OpenSans-Regular',
    backgroundColor: '#fff',
  },
  btn: {
    backgroundColor: '#F9A826',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
    shadowColor: '#F9A826',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  btnPressed: {
    backgroundColor: '#FA812F',
    opacity: 0.85,
  },
  btnText: {
    color: '#fff',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  qrContainer: {
    marginTop: WINDOW_HEIGHT * 0.05,
    alignItems: 'center',
    width: '100%',
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4E443A',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 28,
    shadowColor: '#4E443A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  qrButtonPressed: {
    backgroundColor: '#2d2217',
    opacity: 0.85,
  },
  qrIcon: {
    marginRight: 10,
  },
  qrLabel: {
    color: '#fff',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default JoinGroupScreen;