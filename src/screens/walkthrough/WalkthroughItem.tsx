import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { COLORS } from '../../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface WalkthroughItemProps {
  title: string;
  description: string;
  image?: ImageSourcePropType;
  backgroundColor?: string;
}

export const WalkthroughItem: React.FC<WalkthroughItemProps> = ({
  title,
  description,
  image,
  backgroundColor = COLORS.background,
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      {/* Image/Icon Section */}
      <View style={styles.imageContainer}>
        {image ? (
          <View style={styles.imageBorder}>
            <Image source={image} style={styles.image} resizeMode="contain" />
          </View>
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>📱</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  imageContainer: {
    flex: 2,
    alignItems: 'center',
  },
  imageBorder: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.7,
    maxWidth: 350,
    maxHeight: 350,
    borderRadius: (SCREEN_WIDTH * 0.7) / 2,
    borderWidth: 4,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundColor,
    overflow: 'hidden',
  },
  image: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.6,
    maxWidth: 300,
    maxHeight: 300,
    position: 'absolute', // Đặt ở bottom của screen
    bottom: -5,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 50,
  },
});
