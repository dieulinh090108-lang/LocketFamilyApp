# Helper Functions Guide

## 📱 Screen & Device Utilities

```typescript
import { SCREEN_WIDTH, SCREEN_HEIGHT, isSmallScreen, isLargeScreen } from '../src/utils/helpers';

// Kiểm tra kích thước màn hình
if (isSmallScreen) {
  // Layout cho màn hình nhỏ
}

console.log(`Screen size: ${SCREEN_WIDTH}x${SCREEN_HEIGHT}`);
```

## 📅 Date & Time Helpers

```typescript
import { formatDate, formatTime, formatDateTime, getTimeAgo } from '../src/utils/helpers';

const now = new Date();

// Format date: "Sep 12, 2025"
console.log(formatDate(now));

// Format time: "14:30"
console.log(formatTime(now));

// Format cả date và time: "Sep 12, 2025 at 14:30"
console.log(formatDateTime(now));

// Relative time: "5m ago", "2h ago", "3d ago"
console.log(getTimeAgo(new Date(Date.now() - 300000))); // 5 phút trước
```

## 🔤 String Helpers

```typescript
import { capitalize, truncate, removeSpecialChars } from '../src/utils/helpers';

// Viết hoa chữ đầu: "Hello world"
console.log(capitalize('hello world'));

// Cắt ngắn chuỗi: "Hello..."
console.log(truncate('Hello World', 5));

// Loại bỏ ký tự đặc biệt: "HelloWorld123"
console.log(removeSpecialChars('Hello@World!123'));
```

## ✅ Validation Helpers

```typescript
import { isValidEmail, isValidPassword, isValidPhoneNumber } from '../src/utils/helpers';

// Kiểm tra email
console.log(isValidEmail('user@example.com')); // true

// Kiểm tra password (tối thiểu 6 ký tự)
console.log(isValidPassword('123456')); // true

// Kiểm tra số điện thoại
console.log(isValidPhoneNumber('+1 234 567 8900')); // true
```

## 📊 Array Helpers

```typescript
import { chunk, unique, shuffle } from '../src/utils/helpers';

// Chia mảng thành chunks
console.log(chunk([1,2,3,4,5], 2)); // [[1,2], [3,4], [5]]

// Loại bỏ trùng lặp
console.log(unique([1,2,2,3,3,3])); // [1,2,3]

// Xáo trộn mảng
console.log(shuffle([1,2,3,4,5])); // [3,1,5,2,4] (random)
```

## ⏱️ Async Helpers

```typescript
import { delay, timeout } from '../src/utils/helpers';

// Delay 1 giây
await delay(1000);

// Timeout cho API call
try {
  const data = await timeout(fetchData(), 5000); // Timeout sau 5 giây
} catch (error) {
  console.log('Request timeout or failed');
}
```

## 💡 Tips

- Tất cả functions đều pure (không có side effects)
- Type-safe với TypeScript generics
- Optimized cho performance
- Easy to test và maintain
