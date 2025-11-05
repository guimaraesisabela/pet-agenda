import { useAuth } from '@/contexts/AuthContext';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';

export default function AuthLayout() {
  console.log('🔒 [AuthLayout] Componente renderizado');
  
  const { user, userData, loading } = useAuth();
  
  console.log('🔒 [AuthLayout] Estado:', {
    loading,
    hasUser: !!user,
    userId: user?.uid,
    hasUserData: !!userData,
    role: userData?.role
  });

  if (loading) {
    console.log('🔒 [AuthLayout] Ainda carregando...');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#aa5b14" />
        <Text style={{ marginTop: 16, color: '#666' }}>Verificando autenticação...</Text>
      </View>
    );
  }

  if (user) {
    console.log('🔒 [AuthLayout] Usuário já autenticado, redirecionando...');
    console.log('🔒 [AuthLayout] Role do usuário:', userData?.role);
    
    if (userData?.role === "gestor") {
      console.log('🔒 [AuthLayout] Redirecionando gestor para /agendamento-gestor');
      return <Redirect href="/(app)/agendamento-gestor" />;
    }
    
    console.log('🔒 [AuthLayout] Redirecionando tutor para /agendamento');
    return <Redirect href="/(app)/agendamento" />;
  }

  console.log('🔒 [AuthLayout] Sem usuário, mostrando Stack de auth');
  return <Stack screenOptions={{ headerShown: false }} />;
}