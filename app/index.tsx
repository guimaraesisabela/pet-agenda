import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';

export default function AppIndex() {
  console.log('🏠 [Index] Componente renderizado');
  
  const { user, userData, loading } = useAuth();
  
  console.log('🏠 [Index] Estado do Auth:', {
    loading,
    hasUser: !!user,
    userId: user?.uid,
    hasUserData: !!userData,
    role: userData?.role
  });

  if (loading) {
    console.log('🏠 [Index] Ainda carregando autenticação...');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#aa5b14" />
        <Text style={{ marginTop: 16, color: '#666' }}>Carregando...</Text>
      </View>
    );
  }

  if (!user) {
    console.log('🏠 [Index] Nenhum usuário autenticado, redirecionando para login');
    return <Redirect href="/(auth)/login" />;
  }

  console.log('🏠 [Index] Usuário autenticado, verificando role...');
  
  if (userData?.role === "gestor") {
    console.log('🏠 [Index] Role = gestor, redirecionando para /agendamento-gestor');
    return <Redirect href="/(app)/agendamento-gestor" />;
  }

  console.log('🏠 [Index] Role = tutor (ou não definido), redirecionando para /agendamento');
  return <Redirect href="/(app)/agendamento" />;
}