import AsyncStorage from '@react-native-async-storage/async-storage';

const LOGIN_KEY = 'isLoggedIn';

/**
 * Lưu trạng thái đăng nhập vào AsyncStorage
 */
export const setLoginState = async (value: boolean) => {
  await AsyncStorage.setItem(LOGIN_KEY, value ? 'true' : 'false');
};

/**
 * Lấy trạng thái đăng nhập từ AsyncStorage
 */
export const getLoginState = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem(LOGIN_KEY);
  return value === 'true';
};

/**
 * Xóa trạng thái đăng nhập (logout)
 */
export const clearLoginState = async () => {
  await AsyncStorage.removeItem(LOGIN_KEY);
};
