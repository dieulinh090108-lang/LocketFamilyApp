// Custom hook chỉ để truy cập context đăng nhập
import { useContext } from 'react';
import { AuthContext, AuthContextType } from './AuthProvider';

/**
 * useAuth: hook để truy cập trạng thái đăng nhập toàn cục
 * Sử dụng: const { isLoggedIn, setLoggedIn } = useAuth();
 */
export const useAuth = (): AuthContextType => useContext(AuthContext);
