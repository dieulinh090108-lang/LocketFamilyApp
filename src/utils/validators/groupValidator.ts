// User input validation for group join/create

/**
 * Kiểm tra mã nhóm hợp lệ (chỉ chữ cái, số, tối thiểu 4 ký tự)
 */
export const isValidGroupCode = (code: string): boolean => {
  return /^[A-Za-z0-9]{4,}$/.test(code.trim());
};

/**
 * Kiểm tra tên nhóm hợp lệ (không rỗng, tối đa 50 ký tự)
 */
export const isValidGroupName = (name: string): boolean => {
  return name.trim().length > 0 && name.trim().length <= 50;
};

/**
 * Kiểm tra mô tả nhóm hợp lệ (tùy chọn, tối đa 200 ký tự)
 */
export const isValidGroupDescription = (desc: string): boolean => {
  return desc.trim().length <= 200;
};
