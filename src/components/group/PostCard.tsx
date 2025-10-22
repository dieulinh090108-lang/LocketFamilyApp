import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';

/**
 * PostCard Component
 * 
 * Displays individual family posts in the timeline.
 * Optimized for elderly users with large, clear elements.
 * 
 * Features:
 * - Face detection indicator badge
 * - Tap to open detailed view with face recognition
 * - Clean, accessible design with good contrast
 * - Vietnamese date/time formatting
 */

interface User {
  name: string;
  avatar: string;
}

interface PostCardProps {
  user: User;                    // Post author information
  content: string;               // Post text content
  image?: string | ImageSourcePropType; // Optional image (remote URL or local require)
  createdAt: string;             // ISO timestamp
  likes: number;                 // Like count
  comments: number;              // Comment count
  onPress?: () => void;          // Callback when post is tapped
  facesCount?: number;           // Number of detected faces (shows badge)
}

/**
 * Format timestamp for Vietnamese users
 * Shows time and date in familiar format
 */
const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit', 
    day: '2-digit', 
    month: '2-digit' 
  });
};

const PostCard = React.memo<PostCardProps>(({ 
  user, 
  content, 
  image, 
  createdAt, 
  likes, 
  comments, 
  onPress, 
  facesCount 
}) => (
  <TouchableOpacity 
    activeOpacity={0.85} 
    style={styles.postCard} 
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`Bài đăng của ${user.name}. ${facesCount ? `Có ${facesCount} khuôn mặt.` : ''} Nhấn để xem chi tiết.`}
  >
    {/* Post Header: Avatar, Name, Time, Face Badge */}
    <View style={styles.postHeader}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <View style={styles.flex1}>
        <Text style={styles.postName}>{user.name}</Text>
        <Text style={styles.postTime}>{formatTime(createdAt)}</Text>
      </View>
      {/* Face Detection Indicator Badge */}
      {typeof facesCount === 'number' && facesCount > 0 && (
        <View style={styles.faceBadge}>
          <Text style={styles.faceBadgeText}>{facesCount}</Text>
        </View>
      )}
    </View>
    
    {/* Post Content */}
    <Text style={styles.postContent}>{content}</Text>
    
    {/* Post Image (if present) */}
    {image ? (
      <Image
        source={typeof image === 'string' ? { uri: image } : image}
        style={styles.postImage}
        resizeMode="cover"
        accessibilityLabel="Ảnh trong bài đăng"
      />
    ) : null}
    
    {/* Engagement Actions */}
    <View style={styles.postActions}>
      <Text style={styles.actionBtn}>👍 {likes}</Text>
      <Text style={styles.actionBtn}>💬 {comments}</Text>
    </View>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  postCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  postName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  postTime: {
    fontSize: 12,
    color: '#888',
  },
  postContent: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  actionBtn: {
    color: '#4F8EF7',
    fontWeight: 'bold',
    marginLeft: 16,
  },
  flex1: {
    flex: 1,
  },
  faceBadge: {
    backgroundColor: '#4F8EF7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  faceBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default PostCard;
