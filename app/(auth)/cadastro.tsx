import { theme } from "@/components/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";

export default function CadastroScreen() {
  console.log('CadastroScreen rendered');
  const [role, setRole] = useState<"usuario" | "gestor">("usuario");
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [nomePet, setNomePet] = useState("");
  const [especie, setEspecie] = useState("");

  const [petshop, setPetshop] = useState("");
  const [unidade, setUnidade] = useState("");

  useEffect(() => {
    setRole("usuario");
  }, []);

  const handleCadastro = async () => {
    console.log('handleCadastro called');
    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      // TODO: Save user data (role, name, etc.) to Firestore
      router.replace("/(auth)/login");
    } catch (error) {
      alert("Erro ao cadastrar. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "" }} />
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Image
          source={
            role === "gestor"
              ? require("@/assets/macaquinho.png")
              : require("@/assets/hello-cat.jpg")
          }
          style={[styles.image, role === "gestor" && styles.imageGestor]}
        />

        <Text style={styles.title}>Crie sua Conta</Text>
        <Text style={styles.subtitle}>
          Para começar, selecione seu tipo de perfil:
        </Text>

        <View style={styles.roleSelector}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "usuario" && styles.roleButtonActiveUsuario,
              role !== "usuario" && styles.roleButtonInactive,
            ]}
            onPress={() => setRole("usuario")}
          >
            <Text
              style={[
                styles.roleButtonText,
                role === "usuario" && styles.roleButtonTextActive,
              ]}
            >
              Sou Tutor
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "gestor" && styles.roleButtonActiveGestor,
              role !== "gestor" && styles.roleButtonInactive,
            ]}
            onPress={() => setRole("gestor")}
          >
            <Text
              style={[
                styles.roleButtonText,
                role === "gestor" && styles.roleButtonTextActive,
              ]}
            >
              Sou Gestor
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          value={nome}
          onChangeText={setNome}
        />

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
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
        />

        {role === "gestor" ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nome do Petshop"
              value={petshop}
              onChangeText={setPetshop}
            />
            <TextInput
              style={styles.input}
              placeholder="Unidade"
              value={unidade}
              onChangeText={setUnidade}
            />
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nome do pet"
              value={nomePet}
              onChangeText={setNomePet}
            />
            <TextInput
              style={styles.input}
              placeholder="Espécie (gato, cachorro...)"
              value={especie}
              onChangeText={setEspecie}
            />
          </>
        )}

        <TouchableOpacity style={styles.button} onPress={handleCadastro}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Já tem uma conta?</Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.loginLink}> Fazer Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    // marginBottom: 24,
    textAlign: "center",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 24,
    textAlign: "center",
    color: theme.colors.text,
  },
  roleSelector: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 12,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  roleButtonInactive: {
    backgroundColor: "rgba(255, 192, 203, 0.3)",
  },
  roleButtonActiveUsuario: {
    borderColor: theme.colors.pink,
    backgroundColor: theme.colors.pink,
  },
  roleButtonActiveGestor: {
    borderColor: theme.colors.pink,
    backgroundColor: theme.colors.pink,
  },
  roleButtonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  roleButtonTextActive: {
    color: theme.colors.background,
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
    marginBottom: 8,
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "400",
    color: theme.colors.text,
  },
  loginLink: {
    fontSize: 16,
    color: theme.colors.pink,
    fontWeight: "700",
    fontStyle: "italic",
  },
  image: {
    width: 180,
    height: 180,
    alignSelf: "center",
    marginBottom: -40,
  },
  imageGestor: {
    width: 140,
    height: 130,
    marginBottom: 2,
  },
});
