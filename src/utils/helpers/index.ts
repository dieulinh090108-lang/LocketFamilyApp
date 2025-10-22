import { Dimensions } from 'react-native';

// ========================================
// SCREEN & DEVICE UTILITIES
// ========================================

/**
 * Lấy kích thước màn hình hiện tại
 * - SCREEN_WIDTH/HEIGHT: Kích thước nội dung (không bao gồm status bar, navigation bar)
 * - WINDOW_WIDTH/HEIGHT: Kích thước toàn màn hình (bao gồm tất cả)
 */
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
export const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('screen');

/**
 * Kiểm tra kích thước màn hình để responsive design
 * - Small screen: < 375px (iPhone SE, small Android devices)
 * - Large screen: > 414px (iPad, large Android tablets)
 */
export const isSmallScreen = SCREEN_WIDTH < 375;
export const isLargeScreen = SCREEN_WIDTH > 414;

// ========================================
// DATE & TIME HELPERS
// ========================================

/**
 * Format date thành chuỗi dễ đọc
 * Input: Date object
 * Output: "Sep 12, 2025"
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format time thành chuỗi 24h
 * Input: Date object
 * Output: "14:30"
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Kết hợp date và time
 * Output: "Sep 12, 2025 at 14:30"
 */
export const formatDateTime = (date: Date): string => {
  return `${formatDate(date)} at ${formatTime(date)}`;
};

/**
 * Tính thời gian tương đối (relative time)
 * Input: Date object
 * Output: "Just now", "5m ago", "2h ago", "3d ago", hoặc full date
 */
export const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(date);
};

// ========================================
// STRING MANIPULATION HELPERS
// ========================================

/**
 * Viết hoa chữ cái đầu tiên của chuỗi
 * Input: "hello world" -> Output: "Hello world"
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Cắt ngắn chuỗi và thêm "..." nếu quá dài
 * Input: truncate("Hello World", 5) -> Output: "Hello..."
 */
export const truncate = (str: string, length: number): string => {
  return str.length > length ? `${str.substring(0, length)}...` : str;
};

/**
 * Loại bỏ tất cả ký tự đặc biệt, chỉ giữ lại chữ cái, số và khoảng trắng
 * Input: "Hello@World!123" -> Output: "HelloWorld123"
 */
export const removeSpecialChars = (str: string): string => {
  return str.replace(/[^a-zA-Z0-9\s]/g, '');
};

// ========================================
// VALIDATION HELPERS
// ========================================

/**
 * Kiểm tra email hợp lệ sử dụng regex
 * Pattern: local-part@domain.com
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Kiểm tra password có độ dài tối thiểu 6 ký tự
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Kiểm tra số điện thoại hợp lệ
 * - Cho phép ký tự: số, khoảng trắng, dấu gạch ngang, dấu ngoặc
 * - Sau khi loại bỏ ký tự đặc biệt phải có ít nhất 10 số
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// ========================================
// ARRAY MANIPULATION HELPERS
// ========================================

/**
 * Chia mảng thành các mảng con có kích thước cố định
 * Input: chunk([1,2,3,4,5], 2) -> Output: [[1,2], [3,4], [5]]
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Loại bỏ các phần tử trùng lặp trong mảng
 * Input: unique([1,2,2,3,3,3]) -> Output: [1,2,3]
 */
export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

/**
 * Xáo trộn ngẫu nhiên các phần tử trong mảng
 * Sử dụng Fisher-Yates shuffle algorithm
 */
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// ========================================
// ASYNC/PROMISE HELPERS
// ========================================

/**
 * Tạo delay (chờ) trong async function
 * Input: delay(1000) - chờ 1 giây
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Thêm timeout cho một Promise
 * Nếu Promise không hoàn thành trong thời gian quy định, sẽ reject với lỗi "Timeout"
 * Input: timeout(fetchData(), 5000) - timeout sau 5 giây
 */
export const timeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    ),
  ]);
};
