import { useEffect } from 'react';
import { useSession } from '@/components/SessionContext';
import { router } from 'expo-router';

export function useAuthGuard(): boolean {
  const { session, loading } = useSession();

  useEffect(() => {
    if (!loading && !session) {
      console.log('🚫 No session, redirecting...');
      router.replace('/');
    }
  }, [loading, session]);

  return loading;
}
