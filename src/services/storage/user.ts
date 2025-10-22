import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'user';

export const saveUser = async (user: any) => {
  try {
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem(USER_KEY, jsonValue);
  } catch (e) {
    // saving error
    console.error('Error saving user data:', e);
  }
};

export const getUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
    console.error('Error reading user data:', e);
    return null;
  }
};

export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (e) {
    // error removing value
    console.error('Error removing user data:', e);
  }
};
