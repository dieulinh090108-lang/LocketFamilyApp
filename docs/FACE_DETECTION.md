# Hệ thống Face Detection - LocketFamily

## Tổng quan

Hệ thống Face Detection trong LocketFamily được thiết kế đặc biệt để hỗ trợ người cao tuổi có bệnh Alzheimer nhận diện các thành viên gia đình thông qua hình ảnh và âm thanh.

## Kiến trúc Hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│                    Face Detection Pipeline                  │
├─────────────────────┬───────────────────┬───────────────────┤
│   Image Input       │   Coordinate      │   UI Rendering    │
│   (Original Size)   │   Transformation  │   (Screen Size)   │
├─────────────────────┼───────────────────┼───────────────────┤
│ originalWidth: 1000 │   scaleX = 0.4    │ screenX = 120     │
│ originalHeight: 800 │   scaleY = 0.5    │ screenY = 100     │
│ faceX1: 300        │   offsetX = 50    │ faceWidth = 80    │
│ faceY1: 200        │   offsetY = 25    │ faceHeight = 60   │
└─────────────────────┴───────────────────┴───────────────────┘
```

## Coordinate System

### 1. Định dạng Tọa độ Chuẩn

```typescript
interface FaceBox {
  id: string;      // Unique identifier
  name: string;    // Tên tiếng Việt của thành viên
  x1: number;      // Left edge (trái)
  y1: number;      // Top edge (trên)
  x2: number;      // Right edge (phải)
  y2: number;      // Bottom edge (dưới)
}

// Ví dụ:
const faceExample: FaceBox = {
  id: 'face_001',
  name: 'Bà Ngoại',
  x1: 150,    // Pixel thứ 150 từ trái ảnh gốc
  y1: 100,    // Pixel thứ 100 từ trên ảnh gốc
  x2: 250,    // Pixel thứ 250 từ trái ảnh gốc
  y2: 200     // Pixel thứ 200 từ trên ảnh gốc
};
```

### 2. Coordinate Origin và Direction

```
Original Image Coordinate System:
┌─────────────────────────────> X (width)
│  (0,0)
│    ┌─────────────────────┐
│    │                     │
│    │   (x1,y1)●────────┐ │
│    │     │             │ │
│    │     │   Face Box  │ │
│    │     │             │ │
│    │     └────────●(x2,y2) │
│    │                     │
│    └─────────────────────┘
│
▼ Y (height)
```

**Quan trọng**: 
- Origin (0,0) ở góc **trên-trái**
- X tăng từ trái sang phải
- Y tăng từ trên xuống dưới
- Tọa độ dựa trên kích thước ảnh gốc, không phải màn hình

## Algorithm Chi tiết

### 1. Aspect Ratio Calculation

```typescript
/**
 * Tính toán tỷ lệ khung hình để xác định cách ảnh được hiển thị
 * với resizeMode="contain"
 */
const calculateImageDisplay = (
  originalWidth: number,
  originalHeight: number,
  containerWidth: number,
  containerHeight: number
) => {
  const imageAspectRatio = originalWidth / originalHeight;
  const containerAspectRatio = containerWidth / containerHeight;
  
  let actualImageWidth: number;
  let actualImageHeight: number;
  let offsetX = 0;
  let offsetY = 0;
  
  if (imageAspectRatio > containerAspectRatio) {
    // Ảnh rộng hơn container → fit theo chiều rộng
    actualImageWidth = containerWidth;
    actualImageHeight = containerWidth / imageAspectRatio;
    offsetY = (containerHeight - actualImageHeight) / 2;
  } else {
    // Ảnh cao hơn container → fit theo chiều cao
    actualImageHeight = containerHeight;
    actualImageWidth = containerHeight * imageAspectRatio;
    offsetX = (containerWidth - actualImageWidth) / 2;
  }
  
  return {
    actualImageWidth,
    actualImageHeight,
    offsetX,
    offsetY,
    scaleX: actualImageWidth / originalWidth,
    scaleY: actualImageHeight / originalHeight
  };
};
```

### 2. Coordinate Transformation

```typescript
/**
 * Chuyển đổi tọa độ từ ảnh gốc sang tọa độ màn hình
 */
const transformFaceCoordinates = (
  face: FaceBox,
  transformation: {
    scaleX: number;
    scaleY: number;
    offsetX: number;
    offsetY: number;
  }
) => {
  const { scaleX, scaleY, offsetX, offsetY } = transformation;
  
  return {
    left: face.x1 * scaleX + offsetX,
    top: face.y1 * scaleY + offsetY,
    width: (face.x2 - face.x1) * scaleX,
    height: (face.y2 - face.y1) * scaleY
  };
};
```

### 3. Hit Testing Algorithm

```typescript
/**
 * Kiểm tra xem một điểm touch có nằm trong face box không
 */
const isPointInFaceBox = (
  touchX: number,
  touchY: number,
  faceBox: TransformedFaceBox
) => {
  return (
    touchX >= faceBox.left &&
    touchX <= faceBox.left + faceBox.width &&
    touchY >= faceBox.top &&
    touchY <= faceBox.top + faceBox.height
  );
};
```

## Ví dụ Thực tế

### Scenario: Ảnh gia đình có kích thước 1200x800, hiển thị trên màn hình 400x600

```typescript
// Dữ liệu đầu vào
const originalImage = {
  width: 1200,
  height: 800
};

const screenContainer = {
  width: 400,
  height: 600
};

const faceData = {
  id: 'ba_face',
  name: 'Ba',
  x1: 300,  // 25% từ trái ảnh gốc
  y1: 200,  // 25% từ trên ảnh gốc
  x2: 600,  // 50% từ trái ảnh gốc
  y2: 500   // 62.5% từ trên ảnh gốc
};

// Bước 1: Tính aspect ratio
const imageRatio = 1200 / 800 = 1.5;
const containerRatio = 400 / 600 = 0.67;

// imageRatio > containerRatio → ảnh rộng hơn
// → Fit theo chiều rộng container

// Bước 2: Tính kích thước thực tế
const actualWidth = 400;  // Full container width
const actualHeight = 400 / 1.5 = 266.67;
const offsetX = 0;
const offsetY = (600 - 266.67) / 2 = 166.67;

// Bước 3: Tính scaling factors
const scaleX = 400 / 1200 = 0.33;
const scaleY = 266.67 / 800 = 0.33;

// Bước 4: Transform face coordinates
const screenFace = {
  left: 300 * 0.33 + 0 = 100,
  top: 200 * 0.33 + 166.67 = 233.33,
  width: (600 - 300) * 0.33 = 100,
  height: (500 - 200) * 0.33 = 100
};
```

**Kết quả**: Face box của "Ba" sẽ xuất hiện tại vị trí (100, 233) với kích thước 100x100 pixels trên màn hình.

## Implementation trong React Native

### 1. ImageDetailModal Component

```typescript
const ImageDetailModal: React.FC<Props> = ({ faces, originalWidth, originalHeight }) => {
  // Container dimensions
  const displayWidth = screen.width;
  const displayHeight = screen.height;
  
  // Calculate transformation parameters
  const imageAspectRatio = originalWidth / originalHeight;
  const containerAspectRatio = displayWidth / displayHeight;
  
  let actualImageWidth: number, actualImageHeight: number;
  let offsetX = 0, offsetY = 0;
  
  if (imageAspectRatio > containerAspectRatio) {
    actualImageWidth = displayWidth;
    actualImageHeight = displayWidth / imageAspectRatio;
    offsetY = (displayHeight - actualImageHeight) / 2;
  } else {
    actualImageHeight = displayHeight;
    actualImageWidth = displayHeight * imageAspectRatio;
    offsetX = (displayWidth - actualImageWidth) / 2;
  }
  
  const scaleX = actualImageWidth / originalWidth;
  const scaleY = actualImageHeight / originalHeight;
  
  return (
    <View style={{ width: displayWidth, height: displayHeight }}>
      <Image 
        source={{ uri: imageUri }}
        style={{ width: displayWidth, height: displayHeight }}
        resizeMode="contain"
      />
      
      {faces.map(face => {
        const left = face.x1 * scaleX + offsetX;
        const top = face.y1 * scaleY + offsetY;
        const width = (face.x2 - face.x1) * scaleX;
        const height = (face.y2 - face.y1) * scaleY;
        
        return (
          <TouchableOpacity
            key={face.id}
            style={{
              position: 'absolute',
              left,
              top,
              width,
              height,
              borderWidth: 2,
              borderColor: '#4F8EF7',
              borderRadius: 6
            }}
            onPress={() => speakName(face.name)}
          >
            <View style={styles.nameLabel}>
              <Text style={styles.nameText}>{face.name}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
```

### 2. Performance Optimizations

```typescript
// Memoize expensive calculations
const transformedFaces = useMemo(() => {
  return faces.map(face => transformFaceCoordinates(face, {
    scaleX, scaleY, offsetX, offsetY
  }));
}, [faces, scaleX, scaleY, offsetX, offsetY]);

// Debounce layout calculations
const [layoutWidth, setLayoutWidth] = useState(screen.width);
const handleLayout = useCallback(
  debounce((event) => {
    setLayoutWidth(event.nativeEvent.layout.width);
  }, 100),
  []
);
```

## Data Format từ Backend

### 1. API Response Format

```json
{
  "posts": [
    {
      "id": "post_123",
      "content": "Gia đình mình đi picnic cuối tuần",
      "image": {
        "url": "https://api.example.com/images/family_picnic.jpg",
        "originalWidth": 1920,
        "originalHeight": 1080,
        "faces": [
          {
            "id": "face_ba_001",
            "name": "Ba",
            "boundingBox": {
              "x1": 450,
              "y1": 200,
              "x2": 650,
              "y2": 400
            },
            "confidence": 0.95
          },
          {
            "id": "face_me_002", 
            "name": "Mẹ",
            "boundingBox": {
              "x1": 700,
              "y1": 180,
              "x2": 900,
              "y2": 380
            },
            "confidence": 0.92
          }
        ]
      }
    }
  ]
}
```

### 2. Data Transformation

```typescript
// Transform API response to app format
const transformApiResponse = (apiPost: ApiPost): PostItem => {
  return {
    id: apiPost.id,
    content: apiPost.content,
    image: apiPost.image.url,
    originalWidth: apiPost.image.originalWidth,
    originalHeight: apiPost.image.originalHeight,
    faces: apiPost.image.faces.map(apiFace => ({
      id: apiFace.id,
      name: apiFace.name,
      x1: apiFace.boundingBox.x1,
      y1: apiFace.boundingBox.y1,
      x2: apiFace.boundingBox.x2,
      y2: apiFace.boundingBox.y2
    }))
  };
};
```

## Text-to-Speech Integration

### 1. Voice Setup

```typescript
import Tts from 'react-native-tts';

const initializeTTS = async () => {
  try {
    // Set Vietnamese language
    await Tts.setDefaultLanguage('vi-VN');
    
    // Configure speech parameters for elderly users
    await Tts.setDefaultRate(0.4);     // Slower speech rate
    await Tts.setDefaultPitch(1.0);    // Normal pitch
    
    // Check available voices
    const voices = await Tts.voices();
    const vietnameseVoices = voices.filter(v => 
      v.language.startsWith('vi')
    );
    
    if (vietnameseVoices.length > 0) {
      await Tts.setDefaultVoice(vietnameseVoices[0].id);
    }
    
  } catch (error) {
    console.warn('TTS setup failed:', error);
  }
};
```

### 2. Name Pronunciation

```typescript
const speakName = useCallback((name: string) => {
  // Stop any current speech
  Tts.stop();
  
  // Add Vietnamese pronunciation hints if needed
  const pronunciationMap: Record<string, string> = {
    'Nguyễn': 'Nguyên',
    'Thị': 'Thị', 
    'Văn': 'Wan'
  };
  
  const pronouncableName = name.split(' ')
    .map(word => pronunciationMap[word] || word)
    .join(' ');
  
  // Speak with emotional warmth
  Tts.speak(`${pronouncableName}`, {
    androidParams: {
      KEY_PARAM_PAN: 0,
      KEY_PARAM_VOLUME: 1.0,
    },
  });
}, []);
```

## Error Handling & Edge Cases

### 1. Missing Face Data

```typescript
const renderFaceOverlays = () => {
  if (!faces || faces.length === 0) {
    return null; // No face overlays
  }
  
  return faces
    .filter(face => face.x1 >= 0 && face.y1 >= 0) // Valid coordinates
    .map(face => renderFaceBox(face));
};
```

### 2. Invalid Coordinates

```typescript
const validateFaceBox = (face: FaceBox, imageWidth: number, imageHeight: number): boolean => {
  return (
    face.x1 >= 0 && face.x1 < imageWidth &&
    face.y1 >= 0 && face.y1 < imageHeight &&
    face.x2 > face.x1 && face.x2 <= imageWidth &&
    face.y2 > face.y1 && face.y2 <= imageHeight
  );
};
```

### 3. Network Issues

```typescript
const [imageLoadError, setImageLoadError] = useState(false);

<Image 
  source={{ uri: imageUri }}
  onError={() => setImageLoadError(true)}
  onLoad={() => setImageLoadError(false)}
  style={styles.image}
/>

{imageLoadError && (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>
      Không thể tải ảnh. Vui lòng kiểm tra kết nối mạng.
    </Text>
  </View>
)}
```

## Testing Strategy

### 1. Coordinate Transformation Tests

```typescript
describe('Face Detection Coordinate Transformation', () => {
  test('should correctly scale face coordinates', () => {
    const face = { id: '1', name: 'Test', x1: 100, y1: 100, x2: 200, y2: 200 };
    const scale = { scaleX: 0.5, scaleY: 0.5, offsetX: 50, offsetY: 25 };
    
    const result = transformFaceCoordinates(face, scale);
    
    expect(result.left).toBe(100);    // 100 * 0.5 + 50
    expect(result.top).toBe(75);      // 100 * 0.5 + 25
    expect(result.width).toBe(50);    // (200-100) * 0.5
    expect(result.height).toBe(50);   // (200-100) * 0.5
  });
  
  test('should handle edge cases', () => {
    const face = { id: '1', name: 'Test', x1: 0, y1: 0, x2: 1000, y2: 800 };
    // Test with various screen sizes and aspect ratios
  });
});
```

### 2. TTS Integration Tests

```typescript
describe('Text-to-Speech Integration', () => {
  test('should speak Vietnamese names correctly', async () => {
    const mockTts = jest.spyOn(Tts, 'speak');
    await speakName('Nguyễn Văn A');
    expect(mockTts).toHaveBeenCalledWith('Nguyên Wan A', expect.any(Object));
  });
});
```

## Performance Considerations

### 1. Memory Management
- Face boxes chỉ render khi visible
- Image caching để tránh re-download
- Cleanup event listeners khi unmount

### 2. Calculation Optimization
- Memoize coordinate transformations
- Debounce layout calculations
- Use requestAnimationFrame cho smooth animations

### 3. Accessibility
- Large touch targets (minimum 44px)
- High contrast colors
- Screen reader support
- Haptic feedback cho successful face taps

---

Hệ thống Face Detection này được tối ưu hóa đặc biệt cho người cao tuổi, đảm bảo tính chính xác, dễ sử dụng và accessibility cao.