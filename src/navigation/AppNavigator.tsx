import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useWalkthrough } from '../hooks/useWalkthrough';
import { useAuth } from '../hooks/useAuth';
import { WalkthroughScreen } from '../screens/walkthrough/WalkthroughScreen';
import MainStackNavigator from './MainStackNavigator';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Khởi tạo Stack Navigator cho app
const Stack = createNativeStackNavigator();

/**
 * AppNavigator là component điều hướng chính của app.
 * Nó sẽ tự động điều hướng giữa Walkthrough và Home dựa vào trạng thái walkthrough.
 */
const AppNavigator = () => {
  // Lấy trạng thái walkthrough từ custom hook
  // showWalkthrough: true nếu cần hiển thị màn walkthrough
  // completeWalkthrough: hàm đánh dấu walkthrough đã hoàn thành
  // loading: true khi đang kiểm tra trạng thái
  // resetWalkthrough: hàm reset trạng thái walkthrough (dùng cho dev/test)
  // Lấy trạng thái walkthrough và đăng nhập
  const { showWalkthrough, completeWalkthrough, loading } = useWalkthrough();
  const { isLoggedIn } = useAuth();

  // Nếu đang loading trạng thái walkthrough, chưa render navigation
  if (loading) return null;

  return (
    // NavigationContainer là root provider cho React Navigation
    <NavigationContainer>
      {/* Stack.Navigator quản lý các màn hình dạng stack */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Nếu cần walkthrough, render màn Walkthrough đầu tiên */}
        {showWalkthrough ? (
          <Stack.Screen name="Walkthrough">
            {() => (
              <WalkthroughScreen
                onComplete={completeWalkthrough} // Khi hoàn thành walkthrough
                onSkip={completeWalkthrough}     // Khi skip walkthrough
              />
            )}
          </Stack.Screen>
        ) :
          // Nếu chưa đăng nhập, render login/register
          !isLoggedIn ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : null}
        {/* Nếu đã đăng nhập, render MainStackNavigator (quản lý các màn chính) */}
        {isLoggedIn && <Stack.Screen name="Main" component={MainStackNavigator} />}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
