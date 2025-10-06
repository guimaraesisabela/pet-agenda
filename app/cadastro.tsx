import { theme } from "@/components/theme/theme";
import { useRouter } from "expo-router";
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

export default function CadastroScreen() {
  const [role, setRole] = useState<"usuario" | "gestor">("usuario");
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // usuário
  const [nomePet, setNomePet] = useState("");
  const [especie, setEspecie] = useState("");

  // gestor
  const [petshop, setPetshop] = useState("");
  const [unidade, setUnidade] = useState("");

  //para visualização > só trocar o valor que estiver entre "" para "gestor" ou "usuario"
  useEffect(() => {
    setRole("usuario");
  }, []);

  const handleCadastro = () => {
    console.log("Novo cadastro:", {
      role,
      nome,
      email,
      senha,
      confirmarSenha,
      ...(role === "gestor" ? { petshop, unidade } : { nomePet, especie }),
    });
    router.replace("/home");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("@/assets/hello-cat.jpg")}
        style={{
          width: 180,
          height: 180,
          alignSelf: "center",
          marginBottom: -15,
        }}
      />

      <Text style={styles.title}>
        {role === "gestor" ? "Cadastro Gestor" : "Cadastro"}
      </Text>

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

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/agendamento")}
      >
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Já tem uma conta?</Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.loginLink}> Fazer Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: theme.colors.text,
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
  loginButton: {
    textAlign: "center",
    color: theme.colors.text,
    fontStyle: "italic",
    fontWeight: "500",
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
});
