import { theme } from "@/components/theme/theme";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require("@/assets/animais-felizes.png")}
          style={{ width: 300, height: 200, alignSelf: "center" }}
        />
      </View>
      <Text style={styles.title}>Bem-vindo ao Agenda Pet!</Text>
      <Text style={styles.description}>
        Agende banhos, tosas e outros cuidados para o seu pet de forma simples e
        rápida. Aqui, seu melhor amigo está em boas mãos: seguro, bem cuidado e
        cheio de carinho!
      </Text>

      <View>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => router.push("/cadastro")}
        >
          <Text style={{ color: theme.colors.background, fontWeight: "600", fontSize: 16 }}>Crie sua conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/login")}
        >
          <Text style={{ color: theme.colors.background, fontWeight: "600", fontSize: 16 }}>Login</Text>
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
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: theme.colors.primary,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: theme.colors.text,
    marginBottom: 32,
  },
  buttons: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    alignSelf: "center",
    alignItems: "center",
    width: "85%",
    marginBottom: 12,
  },
  loginButton: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: theme.colors.pink,
    paddingVertical: 10,
    alignSelf: "center",
    alignItems: "center",
    width: "85%",
    marginBottom: 12,
  },
});
