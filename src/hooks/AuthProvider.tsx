import React, { createContext, useState, useEffect } from 'react';
import { setLoginState, getLoginState } from '../services/storage/auth';

// Định nghĩa kiểu dữ liệu cho context
export interface AuthContextType {
  isLoggedIn: boolean;
  setLoggedIn: (v: boolean) => void;
}

// Tạo context mặc định
export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setLoggedIn: () => {},
});

/**
 * AuthProvider là component bọc toàn bộ app, cung cấp trạng thái đăng nhập toàn cục
 * Dùng để bọc ngoài cùng trong App.tsx
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // State lưu trạng thái đăng nhập
  const [isLoggedIn, setLoggedInState] = useState(false);

  /**
   * Hàm setLoggedIn sẽ lưu trạng thái vào AsyncStorage để giữ đăng nhập khi mở lại app
   */
  // Hàm setLoggedIn sẽ lưu trạng thái vào service storage
  const setLoggedIn = async (value: boolean) => {
    setLoggedInState(value);
    await setLoginState(value);
  };

  // Khi app khởi động, lấy trạng thái đăng nhập từ AsyncStorage
  useEffect(() => {
    // Khi app khởi động, lấy trạng thái đăng nhập từ service storage
    const loadLoginState = async () => {
      const value = await getLoginState();
      setLoggedInState(value);
    };
    loadLoginState();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};