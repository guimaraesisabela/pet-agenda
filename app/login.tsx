import { theme } from "@/components/theme/theme";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function LoginScreen() {
  //   const { role } = useLocalSearchParams<{ role?: string }>();
  const router = useRouter();

  const [role, setRole] = useState<"usuario" | "gestor">("usuario");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setRole("usuario");
  }, []);

  const handleLogin = () => {
    console.log("Tentando login para", role, email, password);
    router.replace("/home");
  };

  const handleCadastro = () => {
    console.log("Tentando cadastro para", role, email, password);
    router.replace("/home");
  };

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require("@/assets/hello-dog.jpg")}
          style={{ width: 200, height: 200, alignSelf: "center", marginBottom: -20, }}
        />
      </View>
      <Text style={styles.title}>
        {role === "gestor" ? "Login Gestor" : "Login"}
      </Text>

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

        <TouchableOpacity
          style={styles.register}
          onPress={() => router.push("/cadastro")}
        >
          <Text style={styles.buttonText}>Criar Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  register: {
    backgroundColor: theme.colors.pink,
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
});
