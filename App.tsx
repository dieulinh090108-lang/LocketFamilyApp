/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useEffect } from 'react';
import { Platform, StatusBar, useColorScheme, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BootSplash from 'react-native-bootsplash';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/hooks/AuthProvider';


// Thiết lập font mặc định cho toàn bộ app (chỉ chạy 1 lần khi load file)
if (Text && (Text as any).defaultProps) {
  (Text as any).defaultProps.allowFontScaling = false;
  (Text as any).defaultProps.style = [{ fontFamily: 'OpenSans-Regular' }];
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // Ẩn splash screen khi app sẵn sàng (chỉ Android)
  useEffect(() => {
    if (Platform.OS === 'android') {
      BootSplash.hide({ fade: true }).then(() => {
        console.log('BootSplash has been hidden successfully');
      });
    }
  }, []);

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppNavigator />
      </SafeAreaProvider>
    </AuthProvider>
  );
}

export default App;
