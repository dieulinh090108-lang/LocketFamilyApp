// src/services/api/group.ts
// Service gọi API lấy danh sách nhóm của người dùng

export interface Group {
  id: string;
  name: string;
  // Thêm các trường khác nếu cần
}

/**
 * Hàm giả lập gọi API lấy danh sách nhóm
 * Thay thế bằng fetch/axios khi có API thật
 */
export const fetchUserGroups = async (): Promise<Group[]> => {
  // TODO: Thay thế bằng gọi API thực tế
  // Ví dụ: return fetch('https://api.example.com/groups').then(res => res.json());
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: '1', name: 'Gia đình nội' },
        { id: '2', name: 'Gia đình ngoại' },
      ]);
    }, 1000);
  });
};
