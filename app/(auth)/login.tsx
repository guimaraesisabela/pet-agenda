import { theme } from "@/components/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";

export default function LoginScreen() {
  console.log('LoginScreen rendered');
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log('handleLogin called');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(app)");
    } catch (error) {
      alert("Erro ao fazer login. Verifique suas credenciais.");
      console.error(error);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "" }} />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
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
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
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
});
