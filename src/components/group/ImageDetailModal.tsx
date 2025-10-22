import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Modal, View, Image, StyleSheet, TouchableOpacity, Text, Dimensions, ImageSourcePropType } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
// @ts-ignore - types may be missing; ensure package installed
import Tts from 'react-native-tts';

/**
 * ImageDetailModal Component
 * 
 * A fullscreen modal for displaying family photos with interactive face recognition.
 * Designed specifically for elderly users with Alzheimer's to help them remember
 * family member names through visual and audio feedback.
 * 
 * Features:
 * - Fullscreen image display with resizeMode="contain"
 * - Interactive face detection boxes overlayed on faces
 * - Text-to-speech for Vietnamese name pronunciation
 * - Accurate coordinate mapping accounting for image aspect ratio
 */

/**
 * Face detection data structure
 * Coordinates are based on the original image dimensions
 */
interface FaceBox {
  id: string;          // Unique identifier for the face
  name: string;        // Vietnamese name of the family member
  // Bounding box coordinates relative to original image size
  // Format: x1,y1,x2,y2 (top-left corner, bottom-right corner)
  x1: number;          // Left edge position
  y1: number;          // Top edge position  
  x2: number;          // Right edge position
  y2: number;          // Bottom edge position
}

/**
 * Props for ImageDetailModal component
 */
interface ImageDetailModalProps {
  visible: boolean;                    // Controls modal visibility
  imageUri: string | ImageSourcePropType | undefined; // URL, local require, or path to the image
  faces?: FaceBox[];                  // Array of face detection data
  onClose: () => void;                // Callback when modal is closed
  originalWidth?: number;             // Original image width (required for accurate positioning)
  originalHeight?: number;            // Original image height (required for accurate positioning)
}

const screen = Dimensions.get('window');

/**
 * MEMOIZED FACE OVERLAY COMPONENT
 * Prevents re-rendering when parent updates but face data hasn't changed
 */
interface TransformedFace extends FaceBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface FaceOverlayProps {
  face: TransformedFace;
  onPress: (name: string) => void;
}

const FaceOverlay = React.memo<FaceOverlayProps>(({ face, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(face.name);
  }, [onPress, face.name]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[styles.faceBox, {
        left: face.left,
        top: face.top,
        width: face.width,
        height: face.height
      }]}
      accessibilityRole="button"
      accessibilityLabel={`Nhấn để nghe tên ${face.name}`}
    />
  );
});

const ImageDetailModal = React.memo<ImageDetailModalProps>(({
  visible,
  imageUri,
  faces = [],
  onClose,
  originalWidth = 1000,
  originalHeight = 1000
}) => {
  // Dynamic layout tracking for responsive design
  const [layoutWidth, setLayoutWidth] = useState(screen.width);
  const displayWidth = layoutWidth;
  const displayHeight = screen.height;

  /**
   * COORDINATE MAPPING ALGORITHM - MEMOIZED FOR PERFORMANCE
   * 
   * Problem: When using resizeMode="contain", the actual image doesn't fill
   * the entire container. We need to calculate where the image actually appears
   * within the container to position face boxes correctly.
   * 
   * Solution: Compare aspect ratios to determine how the image is fitted,
   * then calculate the actual image dimensions and offset within the container.
   * 
   * OPTIMIZATION: Use useMemo to prevent recalculation on every render
   */
  const { offsetX, offsetY, scaleX, scaleY } = useMemo(() => {
    const imageAspectRatio = originalWidth / originalHeight;
    const containerAspectRatio = displayWidth / displayHeight;

    let width: number, height: number, x = 0, y = 0;

    if (imageAspectRatio > containerAspectRatio) {
      // Image is wider than container ratio
      // → Image fits to container width, empty space on top/bottom
      width = displayWidth;
      height = displayWidth / imageAspectRatio;
      y = (displayHeight - height) / 2; // Center vertically
    } else {
      // Image is taller than container ratio
      // → Image fits to container height, empty space on left/right
      height = displayHeight;
      width = displayHeight * imageAspectRatio;
      x = (displayWidth - width) / 2; // Center horizontally
    }

    // Calculate scaling factors from original image to display size
    const sx = width / originalWidth;
    const sy = height / originalHeight;

    return {
      actualImageWidth: width,
      actualImageHeight: height,
      offsetX: x,
      offsetY: y,
      scaleX: sx,
      scaleY: sy
    };
  }, [displayWidth, displayHeight, originalWidth, originalHeight]);  /**
   * TEXT-TO-SPEECH SETUP
   * Configure Vietnamese language for elderly users
   */
  useEffect(() => {
    if (visible) {
      // Set Vietnamese language for proper name pronunciation
      Tts.setDefaultLanguage('vi-VN').catch(() => {
        console.warn('Vietnamese TTS not available, falling back to default');
      });
    }
  }, [visible]);

  /**
   * Speak family member name
   * Stops any current speech before starting new one
   */
  const speak = useCallback((text: string) => {
    Tts.stop(); // Stop current speech to avoid overlap
    Tts.speak(text);
  }, []);

  /**
   * TRANSFORM FACE COORDINATES - MEMOIZED
   * Convert original image coordinates to screen coordinates
   * Only recalculates when faces or scaling factors change
   */
  const transformedFaces = useMemo(() => {
    return faces.map(face => ({
      ...face,
      left: face.x1 * scaleX + offsetX,   // Scale and offset X position
      top: face.y1 * scaleY + offsetY,    // Scale and offset Y position
      width: (face.x2 - face.x1) * scaleX,   // Scale width
      height: (face.y2 - face.y1) * scaleY,   // Scale height
    }));
  }, [faces, scaleX, scaleY, offsetX, offsetY]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent={false}>
      <View style={styles.fullScreenContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ảnh chi tiết</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <View
              style={styles.fullWidth}
              onLayout={e => setLayoutWidth(e.nativeEvent.layout.width)}
            >
              <View style={[styles.imageWrapper, { width: displayWidth, height: displayHeight }]}>
                <Image
                  source={typeof imageUri === 'string' ? { uri: imageUri } : imageUri}
                  style={[styles.detailImage, { width: displayWidth, height: displayHeight }]}
                  resizeMode="contain"
                />
                {transformedFaces.map(face => (
                  <FaceOverlay
                    key={face.id}
                    face={face}
                    onPress={speak}
                  />
                ))}
              </View>
            </View>
          ) : (
            <Text style={styles.noImageText}>Không có ảnh</Text>
          )}
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  headerSpacer: { width: 40 },
  scrollContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidth: { width: '100%' },
  imageWrapper: { alignSelf: 'center' },
  detailImage: { borderRadius: 0 },
  faceBox: {
    position: 'absolute',
    borderWidth: 3,                    // Thicker border for better visibility
    borderColor: '#4F8EF7',
    borderRadius: 8,
    backgroundColor: 'rgba(79, 142, 247, 0.1)', // Subtle background for better visibility
  },
  faceLabel: {
    position: 'relative',
    bottom: '-104%',
    left: 0,
    backgroundColor: 'rgba(79, 142, 247, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  faceLabelText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '500',
    flexShrink: 0,
  },
  noImageText: { textAlign: 'center', color: '#666' },
});

export default ImageDetailModal;
