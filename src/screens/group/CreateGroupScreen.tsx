import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';

const CreateGroupScreen: React.FC = () => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên nhóm');
      return;
    }
    // TODO: Gửi dữ liệu lên server hoặc xử lý tạo nhóm tại đây
    Alert.alert('Thành công', `Nhóm "${groupName}" đã được tạo!`);
    setGroupName('');
    setDescription('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo nhóm mới</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên nhóm"
        value={groupName}
        onChangeText={setGroupName}
        placeholderTextColor={'#4E443A'}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Mô tả nhóm (không bắt buộc)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        placeholderTextColor={'#4E443A'}
      />
      <Pressable
        style={({ pressed }) => pressed ? { ...styles.btn, backgroundColor: '#FA812F' } : styles.btn}
        onPress={handleCreateGroup}
      >
        <Text style={styles.btnText}>Tạo nhóm</Text>
      </Pressable>
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
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  btn: {
    backgroundColor: '#F9A826',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  btnText: {
    color: '#fff',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
  },
});

export default CreateGroupScreen;