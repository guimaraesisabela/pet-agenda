import { theme } from "@/components/theme/theme";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require("@/assets/logo-pet.png")}
          style={{ width: 180, height: 145, alignSelf: "center" }}
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
          <Text style={{ color: theme.colors.background }}>Crie sua conta</Text>
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
  },
});
