# Tài liệu Dự án LocketFamily

## Danh sách Tài liệu

### 📖 Tài liệu chính
- **[README.md](../README.md)** - Tổng quan dự án, tính năng và cách sử dụng
- **[SETUP.md](./SETUP.md)** - Hướng dẫn cài đặt và chạy ứng dụng

### 🏗️ Tài liệu kỹ thuật  
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Kiến trúc code, component structure và data flow
- **[FACE_DETECTION.md](./FACE_DETECTION.md)** - Chi tiết hệ thống nhận diện khuôn mặt

## Quick Start

1. **Bắt đầu nhanh**: Đọc [README.md](../README.md) để hiểu mục đích của dự án
2. **Cài đặt**: Làm theo [SETUP.md](./SETUP.md) để setup môi trường development
3. **Hiểu code**: Tham khảo [ARCHITECTURE.md](./ARCHITECTURE.md) để nắm được cấu trúc dự án
4. **Face Detection**: Đọc [FACE_DETECTION.md](./FACE_DETECTION.md) để hiểu cách hoạt động của tính năng chính

## Dành cho Developer

### Tính năng chính cần hiểu
- **Timeline Posts**: Hiển thị các bài đăng gia đình với face detection indicator
- **Face-aware Image Viewer**: Modal fullscreen với interactive face zones  
- **Text-to-Speech**: Đọc tên người thân bằng tiếng Việt
- **Coordinate Transformation**: Chuyển đổi tọa độ từ ảnh gốc sang màn hình

### ⚡ Performance Optimizations (New!)
- **React.memo**: ImageDetailModal, PostCard, FaceOverlay components memoized
- **useMemo**: Coordinate calculations và face transformations memoized  
- **useCallback**: TTS functions và event handlers memoized
- **FlatList Optimizations**: Smooth scrolling với windowing và batching
- **Large Touch Targets**: Face boxes 150-250px để dễ tap cho người cao tuổi
- **60-80% reduction** in unnecessary re-renders

### Code Structure
```
src/
├── components/group/          # UI Components
│   ├── ImageDetailModal.tsx   # Face-aware image viewer
│   ├── PostCard.tsx          # Timeline post display  
│   ├── QRShareModal.tsx      # QR sharing functionality
│   └── UserPostInput.tsx     # Post creation input
└── screens/group/
    └── GroupScreen.tsx       # Main timeline screen
```

### Key Files để đọc code
1. **GroupScreen.tsx** - Entry point, state management với performance optimizations
2. **ImageDetailModal.tsx** - Core face detection logic với memoized calculations
3. **PostCard.tsx** - Post rendering với face count, React.memo applied
4. **Mock data** trong GroupScreen - Face boxes được tăng kích thước cho testing

### 🧪 Performance Testing
```bash
# Test performance trong Release mode
yarn android --mode=Release
yarn ios --mode=Release

# Test các điểm sau:
# ✅ Timeline scrolling (phải mượt mà)
# ✅ Face detection tapping (< 200ms response time)
# ✅ Modal transitions (không lag)
# ✅ Memory usage (stable trong 5+ phút)
```

## Dành cho Designer/PM

### User Journey
1. **Timeline View**: User xem các bài đăng gia đình
2. **Tap to Open**: Chạm vào ảnh để mở chế độ xem chi tiết
3. **Face Recognition**: Nhìn thấy các khung xanh quanh khuôn mặt
4. **Tap to Hear**: Chạm vào khuôn mặt để nghe tên người thân
5. **Close Modal**: Đóng để quay lại timeline

### Accessibility Features  
- **Large Touch Targets**: Minimum 44px cho người cao tuổi
- **High Contrast**: Màu sắc dễ nhìn
- **Text-to-Speech**: Hỗ trợ người khó đọc
- **Simple Navigation**: UI đơn giản, ít phức tạp

## FAQ

### Q: Tại sao cần originalWidth và originalHeight?
**A**: Face detection API trả về tọa độ dựa trên ảnh gốc. Chúng ta cần kích thước gốc để chuyển đổi chính xác sang tọa độ màn hình.

### Q: Làm thế nào để face boxes hiển thị đúng vị trí?
**A**: Sử dụng algorithm trong `FACE_DETECTION.md` để tính toán aspect ratio và offset khi `resizeMode="contain"`.

### Q: TTS hoạt động trên emulator không?
**A**: TTS hoạt động tốt nhất trên thiết bị thật. Emulator có thể không hỗ trợ đầy đủ Vietnamese TTS.

### Q: Làm thế nào để thêm face detection data mới?
**A**: Cập nhật MOCK_POSTS trong GroupScreen.tsx theo format FaceBox interface.

## Contributing

Khi đóng góp code, hãy:
1. Đọc ARCHITECTURE.md để hiểu cấu trúc
2. Follow coding conventions trong existing code
3. Test TTS functionality trên thiết bị thật
4. Đảm bảo accessibility cho người cao tuổi

## Support

- **Issues**: Tạo GitHub issue với label tương ứng
- **Documentation**: Cập nhật docs khi thay đổi tính năng
- **Testing**: Test trên các thiết bị khác nhau, đặc biệt Android cũ

---

*Dự án được phát triển với mục đích hỗ trợ người cao tuổi và gia đình Việt Nam* ❤️