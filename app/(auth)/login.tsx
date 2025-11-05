import { theme } from "@/components/theme/theme";
import { Stack, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../services/firebase";
import { userService } from "../../services/userService";

export default function LoginScreen() {
  console.log("🔐 [Login] Tela renderizada");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    console.log("🔐 [Login] handleLogin iniciado");
    console.log("🔐 [Login] Email:", email);
    console.log("🔐 [Login] Tem senha:", !!password);
    
    if (!email || !password) {
      console.log("⚠️ [Login] Campos vazios");
      setModalMessage("Por favor, preencha todos os campos!");
      setModalVisible(true);
      return;
    }

    console.log("🔐 [Login] Iniciando processo de autenticação...");
    setIsLoading(true);
    
    try {
      console.log("🔐 [Login] Chamando signInWithEmailAndPassword...");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ [Login] Login no Auth bem-sucedido!", {
        uid: userCredential.user.uid,
        email: userCredential.user.email
      });
      
      console.log("🔐 [Login] Buscando dados do usuário no Firestore...");
      const userData = await userService.getUser(userCredential.user.uid);
      console.log("✅ [Login] Dados do Firestore obtidos:", userData);

      console.log("🔐 [Login] Role do usuário:", userData?.role);

      if (userData?.role === "gestor") {
        console.log("🔐 [Login] Redirecionando para /agendamento-gestor");
        router.replace("/(app)/agendamento-gestor");
      } else {
        console.log("🔐 [Login] Redirecionando para /agendamento");
        router.replace("/(app)/agendamento");
      }
    } catch (error: any) {
      console.error("❌ [Login] Erro no processo de login:", error);
      console.error("❌ [Login] Código do erro:", error.code);
      console.error("❌ [Login] Mensagem:", error.message);
      
      let errorMessage = "Erro ao fazer login. Verifique suas credenciais.";
      
      if (error.code === "auth/user-not-found") {
        errorMessage = "Usuário não encontrado!";
        console.log("⚠️ [Login] Usuário não encontrado");
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Senha incorreta!";
        console.log("⚠️ [Login] Senha incorreta");
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "E-mail inválido!";
        console.log("⚠️ [Login] E-mail inválido");
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "Usuário desabilitado!";
        console.log("⚠️ [Login] Usuário desabilitado");
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "E-mail ou senha incorretos!";
        console.log("⚠️ [Login] Credenciais inválidas");
      }
      
      setModalMessage(errorMessage);
      setModalVisible(true);
    } finally {
      console.log("🔐 [Login] Finalizando processo (setIsLoading false)");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "" }} />
      <View style={styles.container}>
        <View>
          <Image
            source={require("@/assets/hello-dog.jpg")}
            style={{
              width: 200,
              height: 200,
              alignSelf: "center",
              marginBottom: -20,
            }}
          />
        </View>
        <Text style={styles.title}>Bem-vindo(a) de volta!</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />

        <View style={{ gap: 12 }}>
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.background} />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.cadastroRow}>
          <Text style={styles.cadastroText}>Ainda não tem uma conta?</Text>
          <TouchableOpacity 
            onPress={() => {
              console.log("🔐 [Login] Navegando para cadastro");
              router.push("/(auth)/cadastro");
            }}
            disabled={isLoading}
          >
            <Text style={styles.cadastroLink}> Cadastre-se</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>⚠️</Text>
              </View>

              <Text style={styles.modalTitle}>Ops!</Text>
              <Text style={styles.modalMessage}>{modalMessage}</Text>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  console.log("🔐 [Login] Modal fechado");
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Entendi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderColor: theme.colors.grey,
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    width: "85%",
    alignSelf: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  cadastroRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  cadastroText: {
    fontSize: 16,
    fontWeight: "400",
    color: theme.colors.text,
  },
  cadastroLink: {
    fontSize: 16,
    color: theme.colors.pink,
    fontWeight: "700",
    fontStyle: "italic",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#FFF3CD",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF3CD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  iconText: {
    fontSize: 32,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    color: "black",
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    color: "black",
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: "100%",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});