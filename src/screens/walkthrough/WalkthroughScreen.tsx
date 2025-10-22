import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
} from 'react-native';
import { WalkthroughItem } from './WalkthroughItem';
import { Button } from '../../components/common/Button';
import { COLORS, TEXTS } from '../../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ========================================
// WALKTHROUGH DATA - Dữ liệu cho các màn hình giới thiệu
// ========================================

const WALKTHROUGH_DATA = [
  {
    id: '1',
    title: 'LocketFamily',
    description: 'Ứng dụng giúp kết nối và chia sẻ khoảnh khắc gia đình một cách dễ dàng và bảo mật.',
    backgroundColor: COLORS.backgroundColor,
    image: require('../../assets/images/ongBa.png'),
  },
  {
    id: '2',
    title: 'Chia sẻ khoảnh khắc',
    description: 'Upload và chia sẻ ảnh với các thành viên trong gia đình. Tạo album để lưu giữ kỷ niệm.',
    backgroundColor: COLORS.backgroundColor,
    image: require('../../assets/images/ongBa.png'),
  },
  {
    id: '3',
    title: 'Kết nối mọi lúc',
    description: 'Nhận thông báo khi có thành viên mới upload. Chat và tương tác với gia đình mọi lúc mọi nơi.',
    backgroundColor: COLORS.backgroundColor,
    image: require('../../assets/images/ongBa.png'),
  },
  {
    id: '4',
    title: 'Bảo mật tuyệt đối',
    description: 'Dữ liệu của bạn được mã hóa và chỉ chia sẻ với các thành viên được mời trong gia đình.',
    backgroundColor: COLORS.backgroundColor,
    image: require('../../assets/images/ongBa.png'),
  },
];

// ========================================
// WALKTHROUGH SCREEN COMPONENT - Component chính cho màn hình walkthrough
// ========================================

interface WalkthroughScreenProps {
  onComplete: () => void; // Callback khi hoàn thành walkthrough
  onSkip: () => void;     // Callback khi bỏ qua walkthrough
}

export const WalkthroughScreen: React.FC<WalkthroughScreenProps> = ({
  onComplete,
  onSkip,
}) => {
  // State để track màn hình hiện tại (0, 1, 2, 3)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Ref cho FlatList để có thể scroll programmatically
  const flatListRef = useRef<FlatList>(null);

  // Animated value để track vị trí scroll cho animation mượt mà của dots
  const scrollX = useRef(new Animated.Value(0)).current;

  // Handler cho scroll event - sử dụng Animated.event để performance tốt hơn
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  // Handler khi scroll kết thúc (momentum) - cập nhật currentIndex chính xác
  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  // Handler cho nút Next - chuyển sang màn tiếp theo hoặc hoàn thành
  const handleNext = () => {
    if (currentIndex < WALKTHROUGH_DATA.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      onComplete();
    }
  };

  // Handler cho nút Skip - bỏ qua walkthrough
  const handleSkip = () => {
    onSkip();
  };

  // Render từng item walkthrough
  const renderItem = ({ item }: { item: typeof WALKTHROUGH_DATA[0] }) => (
    <WalkthroughItem
      title={item.title}
      description={item.description}
      image={item.image}
      backgroundColor={item.backgroundColor}
    />
  );

  // Render các dot indicators với animation mượt mà
  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {WALKTHROUGH_DATA.map((_, index) => {
          // Tạo input range cho interpolation dựa trên vị trí scroll
          // Ví dụ: index 0 -> [-SCREEN_WIDTH, 0, SCREEN_WIDTH]
          // index 1 -> [0, SCREEN_WIDTH, 2*SCREEN_WIDTH]
          const inputRange = [
            (index - 1) * SCREEN_WIDTH, // Trước đó
            index * SCREEN_WIDTH,       // Hiện tại
            (index + 1) * SCREEN_WIDTH, // Tiếp theo
          ];

          // Animation cho width: 8px -> 20px -> 8px
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 20, 8],
            extrapolate: 'clamp', // Giữ giá trị trong range
          });

          // Animation cho opacity: 0.3 -> 1 -> 0.3
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          // Animation cho backgroundColor: gray -> primary -> gray
          const backgroundColor = scrollX.interpolate({
            inputRange,
            outputRange: [COLORS.grayLight, COLORS.primary, COLORS.grayLight],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Walkthrough Slides - FlatList với paging để tạo hiệu ứng swipe */}
      <FlatList
        ref={flatListRef}
        data={WALKTHROUGH_DATA}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
      />

      {/* Bottom Controls - Chứa dots và buttons */}
      <View style={styles.bottomContainer}>
        {/* Page Indicator Dots - với animation mượt mà */}
        {renderDots()}

        {/* Buttons - Skip/Next hoặc Start tùy theo màn hình */}
        <View 
          style={[
            styles.buttonContainer,
            currentIndex >= WALKTHROUGH_DATA.length - 1 && styles.finalButtonContainer
          ]} 
          key={`buttons-${currentIndex}`} // Force re-render khi currentIndex thay đổi
        >
          {currentIndex < WALKTHROUGH_DATA.length - 1 ? (
            // Màn 0-2: Hiển thị Skip và Next
            <>
              <Button
                title={TEXTS.SKIP}
                onPress={handleSkip}
                variant="outline"
                style={styles.skipButton}
              />
              <Button
                title={TEXTS.NEXT}
                onPress={handleNext}
                variant="primary"
                style={styles.nextButton}
              />
            </>
          ) : (
            // Màn cuối: Chỉ hiển thị nút Start
            <>
              <Button
                title="Bắt đầu"
                onPress={onComplete}
                variant="primary"
                style={styles.startButton}
              />
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bottomContainer: {
    position: 'absolute', // Đặt ở bottom của screen
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Căn giữa các dots
    alignItems: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 8,  // Width mặc định, sẽ được override bởi animation
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.grayLight, // Màu mặc định, sẽ được override
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Skip bên trái, Next bên phải
    alignItems: 'center',
  },
  finalButtonContainer: {
    justifyContent: 'center', // Căn giữa nút Start ở màn cuối
  },
  skipButton: {
    flex: 1, // Chiếm 50% width
    marginRight: 10,
  },
  nextButton: {
    flex: 1, // Chiếm 50% width
    marginLeft: 10,
  },
  startButton: {
    width: '100%', // Chiếm full width ở màn cuối
  },
});
