import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, Image, Pressable, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { launchImageLibrary } from 'react-native-image-picker';

interface JoinGroupProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (profile: { name: string; dob: Date; avatarUri: string | null }) => void;
}

const JoinGroupProfileModal: React.FC<JoinGroupProfileModalProps> = ({ visible, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState<Date>(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const pickAvatar = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
    if (result.assets && result.assets[0]?.uri) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDob(selectedDate);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên!', [{ text: 'OK' }]);
      return;
    }
    onSubmit({ name: name.trim(), dob, avatarUri });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Thông tin cá nhân</Text>
          <TouchableOpacity style={styles.avatarPicker} onPress={pickAvatar}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <Ionicons name="person-circle-outline" size={80} color="#ccc" />
            )}
            <Text style={styles.avatarText}>Chọn ảnh đại diện</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Tên của bạn"
            value={name}
            onChangeText={setName}
            placeholderTextColor={'#4E443A'}
          />
          <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={22} color="#4E443A" />
            <Text style={styles.dateText}>{dob.toLocaleDateString('vi-VN')}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dob}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
          <View style={styles.btnRow}>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Hủy</Text>
            </Pressable>
            <Pressable style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Xác nhận</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    marginBottom: 18,
  },
  avatarPicker: {
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 6,
  },
  avatarText: {
    color: '#4E443A',
    fontSize: 13,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#4E443A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    color: '#000',
    fontFamily: 'OpenSans-Regular',
    backgroundColor: '#fff',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4E443A',
    borderRadius: 8,
    padding: 10,
    marginBottom: 18,
    width: '100%',
    backgroundColor: '#fff',
  },
  dateText: {
    marginLeft: 10,
    color: '#4E443A',
    fontSize: 15,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelText: {
    color: '#333',
    fontFamily: 'OpenSans-SemiBold',
  },
  submitBtn: {
    flex: 1,
    backgroundColor: '#F9A826',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  submitText: {
    color: '#fff',
    fontFamily: 'OpenSans-SemiBold',
  },
});

export default JoinGroupProfileModal;

