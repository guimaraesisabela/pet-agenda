import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { auth } from '@/services/firebase';
import { Redirect, Stack } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

export default function AppLayout() {
  const { user, loading } = useAuth();
  const colorScheme = useColorScheme();
  console.log('AppLayout rendered, user:', user, 'loading:', loading);

  const handleLogout = () => {
    console.log('handleLogout called');
    auth.signOut();
  };

  if (loading) {
    console.log('AppLayout: loading');
    return null;
  }

  if (!user) {
    console.log('AppLayout: no user, redirecting to /auth/login');
    return <Redirect href="/(auth)/login" />;
  }

  console.log('AppLayout: user is authenticated, showing logout button');
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
            <Text style={{ color: Colors[colorScheme ?? 'light'].tint }}>Logout</Text>
          </TouchableOpacity>
        ),
      }}
    />
  );
}
