import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: "tutor" | "gestor";
  createdAt?: Date;
}

class UserService {
  async createUser(userData: UserData): Promise<void> {
    console.log('🟢 [UserService] createUser chamado com:', userData);
    
    try {
      const userDoc = doc(db, "users", userData.uid);
      console.log('🟢 [UserService] Referência do documento criada:', userDoc.path);
      
      const dataToSave = {
        ...userData,
        createdAt: new Date(),
      };
      console.log('🟢 [UserService] Dados a serem salvos:', dataToSave);
      
      await setDoc(userDoc, dataToSave);
      console.log('🟢 [UserService] Documento salvo com sucesso no Firestore');
    } catch (error) {
      console.error('❌ [UserService] Erro ao criar usuário no Firestore:', error);
      console.error('❌ [UserService] Detalhes do erro:', JSON.stringify(error, null, 2));
      throw new Error("Não foi possível criar o usuário no Firestore");
    }
  }

  async getUser(uid: string): Promise<UserData | null> {
    console.log('🟢 [UserService] getUser chamado com uid:', uid);
    
    try {
      const userDoc = doc(db, "users", uid);
      console.log('🟢 [UserService] Referência do documento criada:', userDoc.path);
      
      console.log('🟢 [UserService] Buscando documento no Firestore...');
      const docSnap = await getDoc(userDoc);
      console.log('🟢 [UserService] Documento existe?', docSnap.exists());

      if (docSnap.exists()) {
        const data = docSnap.data() as UserData;
        console.log('🟢 [UserService] Dados do usuário encontrados:', data);
        return data;
      }
      
      console.log('🟢 [UserService] Documento não existe, retornando null');
      return null;
    } catch (error) {
      console.error('❌ [UserService] Erro ao buscar usuário no Firestore:', error);
      console.error('❌ [UserService] Detalhes do erro:', JSON.stringify(error, null, 2));
      throw new Error("Não foi possível buscar o usuário no Firestore");
    }
  }
}

export const userService = new UserService();
console.log('🟢 [UserService] Serviço instanciado');