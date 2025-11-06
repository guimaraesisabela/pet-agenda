import { theme } from "@/components/theme/theme";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/services/firebase";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AgendamentoScreen() {
  console.log('🏠 [Agendamento] Tela home do tutor renderizada');
  
  const { userData } = useAuth();
  
  console.log('🏠 [Agendamento] Dados do usuário:', {
    displayName: userData?.displayName,
    role: userData?.role
  });

  const handleLogout = () => {
    console.log('🏠 [Agendamento] Logout iniciado');
    auth.signOut()
      .then(() => console.log('✅ [Agendamento] Logout bem-sucedido'))
      .catch((error) => console.error('❌ [Agendamento] Erro no logout:', error));
  };

  return (
    <>
      <Stack.Screen options={{ title: "" }} />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
      </TouchableOpacity>

      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/agendamentos.png")}
            style={styles.headerImage}
          />
          <Text style={styles.welcomeText}>
            Olá, {userData?.displayName || 'Tutor'}! 👋
          </Text>
          <Text style={styles.subtitle}>
            O que você gostaria de fazer hoje?
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionCard, styles.primaryCard]}
            onPress={() => {
              console.log('🏠 [Agendamento] Navegando para tela de novo agendamento');
              router.push("/(app)/schedule");
            }}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="add-circle" size={48} color="#fff" />
            </View>
            <Text style={[styles.actionTitle, styles.primaryText]}>Novo Agendamento</Text>
            <Text style={[styles.actionDescription, styles.primaryText]}>
              Agende um serviço para seu pet
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => {
              console.log('🏠 [Agendamento] Navegando para agendamento-usuario');
              router.push("/(app)/agendamento-usuario");
            }}
          >
            <View style={[styles.actionIconContainer, styles.secondaryIcon]}>
              <Ionicons name="calendar" size={48} color={theme.colors.primary} />
            </View>
            <Text style={styles.actionTitle}>Meus Agendamentos</Text>
            <Text style={styles.actionDescription}>
              Veja seus agendamentos e histórico
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Como funciona?</Text>
          
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Solicite um horário</Text>
              <Text style={styles.stepDescription}>
                Escolha o serviço, data e horário desejados
              </Text>
            </View>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Aguarde aprovação</Text>
              <Text style={styles.stepDescription}>
                O gestor irá confirmar ou sugerir outro horário
              </Text>
            </View>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Compareça no horário</Text>
              <Text style={styles.stepDescription}>
                Leve seu pet no dia e horário confirmados
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  logoutButton: {
    position: "absolute",
    top: 50,
    right: 16,
    zIndex: 10,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 32,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerImage: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  actionsContainer: {
    padding: 20,
    gap: 16,
  },
  actionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryCard: {
    backgroundColor: theme.colors.primary,
  },
  actionIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  secondaryIcon: {
    backgroundColor: `${theme.colors.primary}15`,
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 8,
  },
  primaryText: {
    color: "#fff",
  },
  actionDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  infoSection: {
    padding: 20,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 20,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});