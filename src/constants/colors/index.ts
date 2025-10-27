// Colors constants
export const COLORS = {
  // Background colors
  backgroundColor: '#FEEFD2',

  // Primary colors
  primary: '#007AFF',
  primaryDark: '#0056CC',
  primaryLight: '#4DA3FF',

  // Secondary colors
  secondary: '#FF9500',
  secondaryDark: '#E68600',
  secondaryLight: '#FFB340',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
  grayLight: '#C7C7CC',
  grayDark: '#48484A',

  // Status colors
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#007AFF',
  loading: '#5856D6',

  // Background colors
  background: '#F2F2F7',
  surface: '#FFFFFF',
  surfaceSecondary: '#F2F2F7',

  // Text colors
  textPrimary: '#000000',
  textSecondary: '#66666B',
  textTertiary: '#C7C7CC',
} as const;

export type ColorType = typeof COLORS;
