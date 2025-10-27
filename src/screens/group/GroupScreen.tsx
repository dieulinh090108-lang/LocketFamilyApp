import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, ImageSourcePropType } from 'react-native';
import Share from 'react-native-share';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import PostCard from '../../components/group/PostCard';
import QRShareModal from '../../components/group/QRShareModal';
import UserPostInput from '../../components/group/UserPostInput';
import ImageDetailModal from '../../components/group/ImageDetailModal';
import { images } from '../../assets';
import { SCREEN_HEIGHT } from '../../utils';
import { COLORS } from '../../constants';

/**
 * GroupScreen - Main Timeline Screen
 * 
 * This is the core screen of the LocketFamily app, designed specifically
 * for elderly users with Alzheimer's to interact with family photos and memories.
 * 
 * Features:
 * - Facebook-like timeline with family posts
 * - Face detection integration for photo interactions
 * - QR code sharing for easy group invitation
 * - Voice feedback for accessibility
 * 
 * Design Philosophy:
 * - Large, clear UI elements for elderly users
 * - Minimal cognitive load with simple interactions
 * - Vietnamese language support throughout
 */


// Configuration constants
const GROUP_CODE = 'example-group-code-123';
const USER_NAME = 'Nguyễn Diệu Linh';

/**
 * Face detection data structure
 * Must match the format expected by ImageDetailModal
 */
interface FaceBox {
  id: string;     // Unique identifier
  name: string;   // Vietnamese family member name
  x1: number;     // Bounding box coordinates (original image scale)
  y1: number;
  x2: number;
  y2: number;
}

/**
 * Post data structure for family timeline
 * Includes face detection metadata for photos
 */
interface PostItem {
  id: string;
  user: { name: string; avatar: string };
  content: string;                    // Post text content
  image?: string | ImageSourcePropType; // Image (remote URL or local require)
  createdAt: string;                  // ISO timestamp
  likes: number;                      // Engagement metrics
  comments: number;
  faces?: FaceBox[];                 // Face detection data (optional)
  originalWidth?: number;            // Required for accurate face positioning
  originalHeight?: number;           // Required for accurate face positioning
}

/**
 * MOCK DATA - Family Posts with Face Detection
 * 
 * This mock data demonstrates the full face detection system.
 * In production, this would come from your backend API.
 * 
 * Important: Face coordinates (x1,y1,x2,y2) must be relative to
 * the original image dimensions (originalWidth/originalHeight).
 */
const MOCK_POSTS: PostItem[] = [
  {
    id: '1',
    user: { name: 'Nguyễn Văn A', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    content: 'Chào cả nhà! Đây là bài đăng đầu tiên.',
    image: '',
    createdAt: '2025-10-06T08:00:00Z',
    likes: 2,
    comments: 1,
  },
  {
    id: '2',
    user: {
      name: 'Trần Thị B',
      avatar: 'https://randomuser.me/api/portraits/men/31.jpg'
    },
    content: 'Một buổi sáng se lạnh ở Melbourne, cả nhà dừng chân trước Thư viện Bang Victoria — nơi lưu giữ tri thức và những kỷ niệm ấm áp giữa trời thu nước Úc.',
    image: images.diDuLich,
    createdAt: '2025-10-17T09:45:00Z',
    likes: 27,
    comments: 8,
    // Face detection (pixel coordinates, corrected for original 4032x2268)
    faces: [
      { id: 'f1', name: 'Diệu Linh', x1: 1396, y1: 1280, x2: 1567, y2: 1492 },   // Bên trái (nữ đeo kính)
      { id: 'f2', name: 'Ông Đồng', x1: 1688, y1: 1230, x2: 1840, y2: 1426 },   // Thứ hai từ trái (ông lớn tuổi)
      { id: 'f3', name: 'Bố Trung', x1: 1925, y1: 1235, x2: 2082, y2: 1401 },   // Thứ ba từ trái (áo trắng)
      { id: 'f4', name: 'Mẹ Thoan', x1: 2122, y1: 1310, x2: 2288, y2: 1492 }    // Bên phải (nữ áo beige)
    ],
    originalWidth: 4032,
    originalHeight: 2268
  },
  {
    id: '3',
    user: {
      name: 'Lê Văn C',
      avatar: 'https://randomuser.me/api/portraits/men/31.jpg'
    },
    content: 'Buổi tối quây quần bên nồi lẩu nghi ngút khói, cả nhà vừa ăn vừa cười, ấm lòng giữa tiết trời se lạnh.',
    image: images.giaDinhDieuLinh,
    createdAt: '2025-10-17T18:30:00Z',
    likes: 34,
    comments: 10,
    // Face detection (pixel coordinates) — corrected for original 3602x2481
    faces: [
      { id: 'f1', name: 'Bố Trung', x1: 470, y1: 978, x2: 819, y2: 1384 },  // Trái ngoài (nam, áo xanh)
      { id: 'f2', name: 'Mẹ Thoan', x1: 1166, y1: 943, x2: 1503, y2: 1300 },  // Thứ hai từ trái (nữ ngồi giữa bàn)
      { id: 'f3', name: 'Diệu Linh', x1: 2431, y1: 997, x2: 2793, y2: 1439 },  // Thứ ba từ trái (nữ đeo kính, áo trắng)
      { id: 'f4', name: 'Em Thành', x1: 2907, y1: 1166, x2: 3314, y2: 1652 }   // Phải ngoài (nam trẻ, ngồi ghế)
    ],
    originalWidth: 3602,
    originalHeight: 2481
  },
  {
    id: '4',
    user: { name: 'Nguyễn Thị D', avatar: 'https://randomuser.me/api/portraits/women/67.jpg' },
    content: 'Cả nhà cùng nhau du lịch lên núi tuyết. Dù lạnh tê người, ai cũng cười tươi rạng rỡ giữa khung cảnh trắng xóa.',
    image: images.giaDinhBacHoa,
    createdAt: '2025-10-17T19:05:00Z',
    likes: 41,
    comments: 7,
    // Face detection (pixel coordinates)
    faces: [
      { id: 'f1', name: 'Anh Bách', x1: 688, y1: 281, x2: 803, y2: 459 },   // Trái ngoài
      { id: 'f2', name: 'Bác Hòa', x1: 822, y1: 410, x2: 934, y2: 568 },   // Thứ hai từ trái
      { id: 'f3', name: 'Bác Tăng', x1: 1073, y1: 361, x2: 1204, y2: 527 },   // Thứ ba
      { id: 'f4', name: 'Chị Linh Chi', x1: 1248, y1: 445, x2: 1393, y2: 609 }    // Phải ngoài
    ],
    originalWidth: 2048,
    originalHeight: 1366,
  },
  {
    id: '5',
    user: { name: 'Phạm Văn F', avatar: 'https://randomuser.me/api/portraits/men/33.jpg' },
    content: 'Một buổi chiều đầy nắng và tiếng cười, cô gái trẻ rạng rỡ trong khung cảnh hiện đại, mang theo bó hoa khô và nụ cười tươi tắn giữa ánh sáng vàng nhẹ.',
    image: images.chiLinhChi,
    createdAt: '2025-10-17T10:45:00Z',
    likes: 42,
    comments: 10,
    // Face detection (pixel coordinates)
    faces: [
      { id: 'f1', name: 'Chị Linh Chi', x1: 480, y1: 639, x2: 1054, y2: 1282 }
    ],
    originalWidth: 1365,
    originalHeight: 2048
  },
  {
    id: '6',
    user: { name: 'Hoàng Thị G', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
    content: 'Khoảnh khắc dịu dàng bên những bông hoa vàng rực rỡ — nụ cười và ánh sáng hoà quyện, mang đến cảm giác bình yên của một ngày đầy nắng.',
    image: images.bacHoa,
    createdAt: '2025-10-17T11:00:00Z',
    likes: 38,
    comments: 9,
    // Face detection (pixel coordinates)
    faces: [
      { id: 'f1', name: 'Bác Hòa', x1: 740, y1: 600, x2: 1130, y2: 1050 }
    ],
    originalWidth: 1365,
    originalHeight: 2048
  },
  {
    id: '7',
    user: { name: 'Lý Thị H', avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
    content: 'Khoảnh khắc duyên dáng trong bộ hanbok truyền thống, mang đến cảm giác thanh lịch và tươi sáng của nét đẹp Á Đông.',
    image: images.chiThuy,
    createdAt: '2025-10-17T11:10:00Z',
    likes: 42,
    comments: 11,
    faces: [
      { id: 'f1', name: 'Chị Thủy', x1: 410, y1: 290, x2: 650, y2: 620 }
    ],
    originalWidth: 1365,
    originalHeight: 2048,
  },
];

const GroupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);
  const [qrVisible, setQrVisible] = useState(false);
  const [posts, setPosts] = useState<PostItem[]>(MOCK_POSTS);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  // state newPost removed – handled inside UserPostInput composer
  const viewShotRef = useRef<any>(null);

  useEffect(() => {
    // Giả lập lấy dữ liệu user
    const fetchUser = async () => {
      try {
        const userData = await new Promise<{ name: string; avatar: string }>((resolve) =>
          setTimeout(() => resolve({ name: USER_NAME, avatar: 'https://randomuser.me/api/portraits/women/1.jpg' }), 500)
        );
        setUser(userData);
      } catch (err) {
        console.error('Lỗi lấy user:', err);
      }
    };
    fetchUser();
  }, []);

  const handleTestMemory = useCallback(() => {
    navigation.navigate('FaceTest');
  }, [navigation]);

  // MEMOIZED EVENT HANDLERS FOR PERFORMANCE
  const handleShare = useCallback(() => setQrVisible(true), []);

  const handleSaveOrShare = useCallback(async () => {
    try {
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();
        await Share.open({
          url: uri,
          type: 'image/png',
          title: 'Chia sẻ mã QR nhóm',
          message: 'Quét mã QR này để tham gia nhóm!',
        });
      }
    } catch (e: any) {
      if (
        e?.message === 'User did not share' ||
        e?.error?.code === 'USER_CANCELLED' ||
        e?.code === 'USER_CANCELLED' ||
        e?.message?.includes('User cancelled')
      ) {
        return;
      }
      Alert.alert('Lỗi', 'Không thể chia sẻ mã QR.');
    }
  }, []);

  const handleCreatePost = useCallback(({ content, imageUri }: { content: string; imageUri?: string }) => {
    const trimmed = content.trim();
    if (!trimmed && !imageUri) return;
    const post: PostItem = {
      id: Date.now().toString(),
      user: user || { name: USER_NAME, avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
      content: trimmed,
      image: imageUri || '',
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
    };
    setPosts(prev => [post, ...prev]);
  }, [user]);

  const openDetail = useCallback((post: PostItem) => {
    if (!post.image) return; // only open modal when there is an image
    setSelectedPost(post);
  }, []);

  const closeDetail = useCallback(() => setSelectedPost(null), []);

  /**
   * MEMOIZED RENDER FUNCTION FOR FLATLIST PERFORMANCE
   * Render individual post with face detection indicator
   * Shows face count badge when faces are detected
   */
  const renderPost = useCallback(({ item }: { item: PostItem }) => (
    <PostCard
      user={item.user}
      content={item.content}
      image={item.image}
      createdAt={item.createdAt}
      likes={item.likes}
      comments={item.comments}
      facesCount={item.faces?.length}
      onPress={() => openDetail(item)}
    />
  ), [openDetail]);

  // MEMOIZED KEY EXTRACTOR FOR FLATLIST
  const keyExtractor = useCallback((item: PostItem) => item.id, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dòng thời gian</Text>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Avatar + Input + Đăng (component) */}
      <UserPostInput
        avatarUrl={user?.avatar}
        onCreatePost={handleCreatePost}
        userName={user?.name || USER_NAME}
      />

      {/* Danh sách bài đăng - OPTIMIZED FLATLIST */}
      <View style={styles.timelineContainer}>
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.timelineContent}
          showsVerticalScrollIndicator={false}
          // PERFORMANCE OPTIMIZATIONS
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={50}
          initialNumToRender={3}
          windowSize={10}
        />
      </View>

      {/* Nút test trí nhớ */}
      <TouchableOpacity style={styles.testMemoryBtn} onPress={handleTestMemory}>
        <MaterialDesignIcons name="brain" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Modal QR code */}
      <QRShareModal
        visible={qrVisible}
        onClose={() => setQrVisible(false)}
        onShare={handleSaveOrShare}
        viewShotRef={viewShotRef}
        qrValue={GROUP_CODE}
      />
      <ImageDetailModal
        visible={!!selectedPost}
        imageUri={selectedPost?.image}
        faces={selectedPost?.faces}
        originalWidth={selectedPost?.originalWidth}
        originalHeight={selectedPost?.originalHeight}
        onClose={closeDetail}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEEFD2',
  },
  // ...existing code...
  timelineContainer: {
    flex: 1,
  },
  timelineContent: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  shareBtn: {
    backgroundColor: '#840000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  testMemoryBtn: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.05,
    right: 20,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default GroupScreen;