import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { auth } from '@/services/firebase';
import { Redirect, Stack } from 'expo-router';
import { Text, TouchableOpacity, ActivityIndicator, View } from 'react-native';

export default function AppLayout() {
  console.log('📱 [AppLayout] Componente renderizado');
  
  const { user, userData, loading } = useAuth();
  const colorScheme = useColorScheme();
  
  console.log('📱 [AppLayout] Estado:', {
    loading,
    hasUser: !!user,
    userId: user?.uid,
    hasUserData: !!userData,
    role: userData?.role,
    colorScheme
  });

  const handleLogout = () => {
    console.log('📱 [AppLayout] Logout iniciado');
    auth.signOut()
      .then(() => console.log('✅ [AppLayout] Logout bem-sucedido'))
      .catch((error) => console.error('❌ [AppLayout] Erro no logout:', error));
  };

  if (loading) {
    console.log('📱 [AppLayout] Ainda carregando...');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#aa5b14" />
        <Text style={{ marginTop: 16, color: '#666' }}>Verificando autenticação...</Text>
      </View>
    );
  }

  if (!user) {
    console.log('📱 [AppLayout] Sem usuário, redirecionando para login');
    return <Redirect href="/(auth)/login" />;
  }

  console.log('📱 [AppLayout] Usuário autenticado, mostrando Stack');
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