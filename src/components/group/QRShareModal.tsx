import React, { RefObject } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';

interface QRShareModalProps {
  visible: boolean;
  onClose: () => void;
  onShare: () => void;
  viewShotRef: RefObject<any>;
  qrValue: string;
}

const QRShareModal: React.FC<QRShareModalProps> = ({ visible, onClose, onShare, viewShotRef, qrValue }) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <View style={styles.modalBg}>
      <View style={styles.modalContent}>
        <Text style={styles.qrTitle}>Mã QR nhóm</Text>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={styles.qrBox}>
          <QRCode value={qrValue} size={200} />
        </ViewShot>
        <TouchableOpacity style={styles.saveBtn} onPress={onShare}>
          <Text style={styles.saveText}>Chia sẻ mã QR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: 300,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  qrBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  saveBtn: {
    backgroundColor: '#4F8EF7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    color: '#4F8EF7',
    fontWeight: 'bold',
  },
});

export default QRShareModal;
