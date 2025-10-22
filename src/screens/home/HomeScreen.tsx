import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchUserGroups, Group } from '../../services/api/group';

const HomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  // State lưu danh sách nhóm, trạng thái loading và lỗi
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Gọi API lấy danh sách nhóm khi màn hình mount
  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUserGroups();
        setGroups(data);
      } catch (e) {
        setError('Không thể tải danh sách nhóm.');
      } finally {
        setLoading(false);
      }
    };
    loadGroups();
  }, []);

  // Render từng item nhóm
  const renderGroupItem = ({ item }: { item: Group }) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() => navigation.navigate('GroupScreen', { groupId: item.id, groupName: item.name })}
    >
      <Text style={styles.groupName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Nhóm của bạn!</Text>
      </View>
      {/* Bố cục 2 nút chức năng */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('CreateGroup')}
        >
          <Text style={styles.buttonText}>Tạo nhóm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('JoinGroup')}
        >
          <Text style={styles.buttonText}>Tham gia nhóm</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        {/* Hiển thị trạng thái loading */}
        {loading && <ActivityIndicator size="large" color="#F9A826" style={styles.loadingIndicator} />}
        {/* Hiển thị lỗi nếu có */}
        {error && !loading && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        {/* Hiển thị danh sách nhóm */}
        {!loading && !error && (
          <FlatList
            data={groups}
            renderItem={renderGroupItem}
            keyExtractor={item => item.id}
            contentContainerStyle={groups.length === 0 ? styles.emptyContainer : undefined}
            ListEmptyComponent={<Text style={styles.emptyText}>Bạn chưa có nhóm nào.</Text>}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Layout tổng thể
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FEEFD2',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  // Tiêu đề
  titleContainer: {
    marginVertical: 20,
  },
  titleText: {
    fontSize: 30,
    fontFamily: 'OpenSans-Bold',
  },
  // Hàng nút chức năng
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 20,
    gap: 0,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F9A826',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    letterSpacing: 0.5,
  },
  // Danh sách nhóm
  groupItem: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  groupName: {
    fontSize: 18,
    fontFamily: 'OpenSans-SemiBold',
    color: '#333',
  },
  // Trạng thái đặc biệt
  loadingIndicator: {
    marginTop: 40,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    fontFamily: 'OpenSans-Regular',
  },
});

export default HomeScreen;
