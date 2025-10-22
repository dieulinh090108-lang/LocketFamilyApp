import AsyncStorage from '@react-native-async-storage/async-storage';

// ========================================
// WALKTHROUGH STORAGE KEYS
// ========================================

export const STORAGE_KEYS = {
  WALKTHROUGH_COMPLETED: '@walkthrough_completed',
  APP_FIRST_LAUNCH: '@app_first_launch',
} as const;

// ========================================
// WALKTHROUGH STORAGE SERVICE
// ========================================

/**
 * Lưu trạng thái walkthrough đã hoàn thành
 */
export const setWalkthroughCompleted = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.WALKTHROUGH_COMPLETED, 'true');
  } catch (error) {
    console.error('Error saving walkthrough status:', error);
  }
};

/**
 * Kiểm tra walkthrough đã hoàn thành chưa
 */
export const isWalkthroughCompleted = async (): Promise<boolean> => {
  try {
    const completed = await AsyncStorage.getItem(STORAGE_KEYS.WALKTHROUGH_COMPLETED);
    return completed === 'true';
  } catch (error) {
    console.error('Error checking walkthrough status:', error);
    return false;
  }
};

/**
 * Đánh dấu app đã được mở lần đầu
 */
export const setAppLaunched = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.APP_FIRST_LAUNCH, 'true');
  } catch (error) {
    console.error('Error saving app launch status:', error);
  }
};

/**
 * Kiểm tra app đã được mở lần đầu chưa
 */
export const isAppFirstLaunch = async (): Promise<boolean> => {
  try {
    const launched = await AsyncStorage.getItem(STORAGE_KEYS.APP_FIRST_LAUNCH);
    return launched !== 'true';
  } catch (error) {
    console.error('Error checking app launch status:', error);
    return true; // Mặc định là lần đầu nếu có lỗi
  }
};

/**
 * Reset walkthrough (dùng cho testing hoặc user muốn xem lại)
 */
export const resetWalkthrough = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.WALKTHROUGH_COMPLETED);
  } catch (error) {
    console.error('Error resetting walkthrough:', error);
  }
};

/**
 * Reset tất cả app data (dùng cho testing)
 */
export const resetAllAppData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.WALKTHROUGH_COMPLETED,
      STORAGE_KEYS.APP_FIRST_LAUNCH,
    ]);
    console.log('All app data has been reset.');
  } catch (error) {
    console.error('Error resetting app data:', error);
  }
};
