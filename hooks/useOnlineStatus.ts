import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected !== false);
    });
  }, []);

  return isOnline;
}
