import { onAuthStateChanged, User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { UserData, userService } from '../services/userService';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  userData: null,
  loading: true 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('🔷 [AuthContext] AuthProvider renderizado');

  useEffect(() => {
    console.log('🔷 [AuthContext] useEffect iniciado - configurando listener de autenticação');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔷 [AuthContext] onAuthStateChanged disparado');
      console.log('🔷 [AuthContext] Firebase User:', firebaseUser ? {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName
      } : 'null');
      
      setUser(firebaseUser);
      
      if (firebaseUser) {
        console.log('🔷 [AuthContext] Usuário autenticado, buscando dados do Firestore...');
        try {
          console.log('🔷 [AuthContext] Chamando userService.getUser com uid:', firebaseUser.uid);
          const data = await userService.getUser(firebaseUser.uid);
          console.log('🔷 [AuthContext] Dados do Firestore recebidos:', data);
          setUserData(data);
          console.log('🔷 [AuthContext] userData state atualizado');
        } catch (error) {
          console.error('❌ [AuthContext] Erro ao carregar dados do usuário:', error);
          setUserData(null);
        }
      } else {
        console.log('🔷 [AuthContext] Nenhum usuário autenticado');
        setUserData(null);
      }
      
      console.log('🔷 [AuthContext] Definindo loading = false');
      setLoading(false);
    });

    return () => {
      console.log('🔷 [AuthContext] Limpando listener de autenticação');
      unsubscribe();
    };
  }, []);

  console.log('🔷 [AuthContext] Estado atual:', { 
    hasUser: !!user, 
    hasUserData: !!userData, 
    role: userData?.role,
    loading 
  });

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  console.log('🔷 [AuthContext] useAuth chamado');
  const context = useContext(AuthContext);
  console.log('🔷 [AuthContext] Contexto retornado:', {
    hasUser: !!context.user,
    hasUserData: !!context.userData,
    role: context.userData?.role,
    loading: context.loading
  });
  return context;
};