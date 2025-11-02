import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/contexts/auth';

export default function AuthLayout() {
  const { user, loading } = useAuth();
  console.log('AuthLayout rendered, user:', user, 'loading:', loading);

  if (loading) {
    console.log('AuthLayout: loading');
    return null;
  }

  if (user) {
    console.log('AuthLayout: user is authenticated, redirecting to /app');
    return <Redirect href="/(app)" />;
  }

  console.log('AuthLayout: no user');
  return <Stack screenOptions={{ headerShown: false }} />;
}
