import { useState, useEffect } from 'react';
import {
  isWalkthroughCompleted,
  setWalkthroughCompleted,
  isAppFirstLaunch,
  setAppLaunched,
  resetAllAppData,
} from '../services/storage/index';

interface UseWalkthroughReturn {
  showWalkthrough: boolean;
  loading: boolean;
  completeWalkthrough: () => Promise<void>;
  skipWalkthrough: () => Promise<void>;
  resetWalkthrough: () => Promise<void>;
}

/**
 * Custom hook để quản lý trạng thái walkthrough
 * - Kiểm tra xem walkthrough đã hoàn thành chưa
 * - Cung cấp functions để hoàn thành hoặc bỏ qua walkthrough
 */
export const useWalkthrough = (): UseWalkthroughReturn => {
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkWalkthroughStatus();
  }, []);

  const checkWalkthroughStatus = async () => {
    try {
      // Kiểm tra app lần đầu mở
      const isFirstLaunch = await isAppFirstLaunch();
      if (isFirstLaunch) {
        await setAppLaunched();
        setShowWalkthrough(true);
      } else {
        // Nếu không phải lần đầu, kiểm tra walkthrough đã hoàn thành chưa
        const completed = await isWalkthroughCompleted();
        setShowWalkthrough(!completed);
      }
    } catch (error) {
      console.error('Error checking walkthrough status:', error);
      // Mặc định hiển thị walkthrough nếu có lỗi
      setShowWalkthrough(true);
    } finally {
      setLoading(false);
    }
  };

  const completeWalkthrough = async () => {
    try {
      await setWalkthroughCompleted();
      setShowWalkthrough(false);
    } catch (error) {
      console.error('Error completing walkthrough:', error);
    }
  };

  const skipWalkthrough = async () => {
    try {
      await setWalkthroughCompleted();
      setShowWalkthrough(false);
    } catch (error) {
      console.error('Error skipping walkthrough:', error);
    }
  };

  const resetWalkthrough = async () => {
    try {
      await resetAllAppData();
    } catch (error) {
      console.error('Error resetting walkthrough:', error);
    }
  };

  return {
    showWalkthrough,
    loading,
    completeWalkthrough,
    skipWalkthrough,
    resetWalkthrough,
  };
};
