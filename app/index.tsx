import { useAuth } from '@/contexts/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function AppIndex() {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        const role = await AsyncStorage.getItem(`@user_role_${user.uid}`);
        setUserRole(role);
      }
      setCheckingRole(false);
    };

    if (!loading) {
      checkUserRole();
    }
  }, [user, loading]);

  if (loading || checkingRole) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Redireciona baseado no role
  if (userRole === "gestor") {
    return <Redirect href="/(app)/agendamento-gestor" />;
  }

  return <Redirect href="/(app)/agendamento" />;
}