import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image, Modal, Text, ScrollView, Alert } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

interface UserPostInputProps {
  avatarUrl?: string;
  placeholder?: string;
  onCreatePost: (post: { content: string; imageUri?: string }) => void;
  userName?: string; // Tên người dùng để hiển thị bên cạnh avatar
}

const UserPostInput: React.FC<UserPostInputProps> = ({ avatarUrl, placeholder = 'Bạn đang nghĩ gì?', onCreatePost, userName }) => {
  const [composerVisible, setComposerVisible] = useState(false);
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [pickingImageFirst, setPickingImageFirst] = useState(false);

  const openComposer = () => {
    setComposerVisible(true);
  };

  const closeComposer = () => {
    setComposerVisible(false);
    setPickingImageFirst(false);
    setContent('');
    setImageUri(undefined);
  };

  const handlePickImage = async () => {
    try {
      const options: ImageLibraryOptions = { mediaType: 'photo', selectionLimit: 1, quality: 0.9 };
      const result = await launchImageLibrary(options);
      if (result.didCancel) {
        if (pickingImageFirst && !composerVisible) {
          // do nothing, user canceled initial image selection
        }
        return;
      }
      const asset = result.assets?.[0];
      if (asset?.uri) {
        setImageUri(asset.uri);
        if (!composerVisible) {
          // If we started from image first, show composer now
          setComposerVisible(true);
        }
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể chọn ảnh.');
    } finally {
      setPickingImageFirst(false);
    }
  };

  const startWithImage = () => {
    setPickingImageFirst(true);
    handlePickImage();
  };

  const handleSubmit = () => {
    if (!content.trim() && !imageUri) {
      Alert.alert('Thông báo', 'Vui lòng nhập nội dung hoặc chọn ảnh.');
      return;
    }
    onCreatePost({ content: content.trim(), imageUri });
    closeComposer();
  };

  return (
    <>
      {/* Collapsed bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inputRow}
      >
        <View style={styles.avatarBox}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-circle-outline" size={48} color="#840000" />
          )}
        </View>
        <TouchableOpacity style={styles.fakeInput} onPress={openComposer} activeOpacity={0.8}>
          <Text style={styles.fakeInputText}>{placeholder}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imgSelectBtn} onPress={startWithImage}>
          <Ionicons name='image-outline' size={28} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {/* Composer Modal */}
      <Modal visible={composerVisible} animationType="slide" onRequestClose={closeComposer}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeComposer} style={styles.headerBtn}>
              <Text style={styles.headerBtnText}>Hủy</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Tạo bài viết</Text>
            <TouchableOpacity onPress={handleSubmit} style={styles.publishBtn}>
              <Text style={styles.publishBtnText}>Đăng</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.composerUser}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarSmall} />
              ) : (
                <Ionicons name="person-circle-outline" size={40} color="#840000" />
              )}
              <Text style={styles.userName}>{userName}</Text>
            </View>
            <TextInput
              style={styles.composerInput}
              placeholder={placeholder}
              value={content}
              onChangeText={setContent}
              multiline
              autoFocus
            />
            {imageUri && (
              <View style={styles.imagePreviewWrapper}>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeImgBtn} onPress={() => setImageUri(undefined)}>
                  <Ionicons name="close" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.footerAction} onPress={handlePickImage}>
              <Ionicons name='image-outline' size={24} color="#4F8EF7" />
              <Text style={styles.footerActionText}>Ảnh</Text>
            </TouchableOpacity>
            {/* Additional actions can go here */}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  inputRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 8, alignItems: 'center' },
  avatarBox: { justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#eee' },
  fakeInput: { flex: 1, backgroundColor: '#fff', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, justifyContent: 'center' },
  fakeInputText: { color: '#666', fontSize: 15 },
  imgSelectBtn: { backgroundColor: '#4F8EF7', borderRadius: 10, padding: 8, marginLeft: 8 },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ddd' },
  headerBtn: { padding: 4 },
  headerBtnText: { color: '#555', fontSize: 16 },
  modalTitle: { fontSize: 18, fontWeight: '600' },
  publishBtn: { backgroundColor: '#4F8EF7', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  publishBtnText: { color: '#fff', fontWeight: '600' },
  modalContent: { padding: 16 },
  composerUser: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  avatarSmall: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eee', marginRight: 8 },
  userName: { fontSize: 16, fontWeight: '600', color: '#222' },
  composerInput: { minHeight: 120, fontSize: 16, textAlignVertical: 'top', marginBottom: 12 },
  imagePreviewWrapper: { position: 'relative', marginBottom: 20 },
  imagePreview: { width: '100%', height: 220, borderRadius: 12, backgroundColor: '#eee' },
  removeImgBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.5)', padding: 6, borderRadius: 16 },
  modalFooter: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#ddd' },
  footerAction: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
  footerActionText: { marginLeft: 6, color: '#4F8EF7', fontWeight: '600' },
});

export default UserPostInput;
