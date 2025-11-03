import { theme } from "@/components/theme/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../services/firebase";

export default function LoginScreen() {
  console.log("LoginScreen rendered");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogin = async () => {
    console.log("handleLogin called");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Busca o role do AsyncStorage
      const role = await AsyncStorage.getItem(`@user_role_${userCredential.user.uid}`);

      // Redireciona baseado no role
      if (role === "gestor") {
        router.replace("/(app)/agendamento-gestor");
      } else {
        router.replace("/(app)/agendamento");
      }
    } catch (error) {
      setModalVisible(true);
      console.error(error);
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
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={{ gap: 12 }}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cadastroRow}>
          <Text style={styles.cadastroText}>Ainda não tem uma conta?</Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/cadastro")}>
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
              <Text style={styles.modalMessage}>
                Erro ao fazer login. Verifique suas credenciais.
              </Text>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
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