import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from "../../utils";


interface QRScannerProps {
  onRead: (qrtext: string) => void;
  onClose?: () => void;
}

const QRScanner = ({ onRead, onClose }: QRScannerProps) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const device = useCameraDevice("back");
  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      if (codes[0]?.value) {
        onRead(codes[0].value);
        if (onClose) onClose();
      }
    },
  });

  useEffect(() => {
    // exception case
    setRefresh(!refresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device, hasPermission]);

  useEffect(() => {
    const requestCameraPermission = async () => {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission === "granted");
    };
    requestCameraPermission();
    // Auto close after 30s (optional)
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 30 * 1000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (device && hasPermission) {
    return (
      <View style={styles.page2}>
        <Camera
          codeScanner={codeScanner}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
        />
        <View style={styles.backHeader}>
          {onClose && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={onClose}
            >
              <Ionicons name={"arrow-back-outline"} size={25} color={"snow"} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.footer}>
          {onClose && (
            <TouchableOpacity
              style={styles.btn}
              onPress={onClose}
            >
              <Text style={styles.closeText}>Đóng</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.page2}>
        <Text style={styles.noPermissionText}>
          Camera not available or not permitted
        </Text>
      </View>
    );
  }
};


const styles = StyleSheet.create({
  page2: {
    flex: 1,
    position: "absolute",
    top: 0,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  backHeader: {
    backgroundColor: "#00000090",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: "2%",
    height: "5%",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  footer: {
    backgroundColor: "#00000090",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "10%",
    height: "20%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "snow",
    alignItems: "center",
  },
  backBtn: {
    padding: 10
  },
  closeText: {
    color: "snow",
    fontSize: 14
  },
  noPermissionText: {
    backgroundColor: "white"
  }
});

export default QRScanner;