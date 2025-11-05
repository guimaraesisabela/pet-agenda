import { theme } from "@/components/theme/theme";
import { useAuth } from "@/contexts/AuthContext";
import { Appointment, appointmentService } from "@/services/appointmentService";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function MyAppointmentsScreen() {
  console.log('📋 [MyAppointments] Tela renderizada');
  
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"proximos" | "historico">("proximos");
  const [selectedAgendamento, setSelectedAgendamento] = useState<Appointment | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = useCallback(async () => {
    if (!user) {
      console.log('⚠️ [MyAppointments] Usuário não autenticado');
      return;
    }

    console.log('📋 [MyAppointments] Carregando agendamentos do tutor:', user.uid);
    setLoading(true);
    
    try {
      const data = await appointmentService.getTutorAppointments(user.uid);
      console.log('✅ [MyAppointments] Agendamentos carregados:', data.length);
      console.log('📋 [MyAppointments] Dados:', data);
      setAppointments(data);
    } catch (error) {
      console.error('❌ [MyAppointments] Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      console.log('📋 [MyAppointments] Tela focada, recarregando dados');
      loadAppointments();
    }, [loadAppointments])
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const proximos = appointments.filter((ag) => {
    const agData = new Date(ag.dateTime);
    return (
      agData >= today && 
      ag.status !== "rejected" && 
      ag.status !== "completed"
    );
  });

  const historico = appointments.filter((ag) => {
    const agData = new Date(ag.dateTime);
    return (
      agData < today || 
      ag.status === "rejected" || 
      ag.status === "completed"
    );
  });

  console.log('📋 [MyAppointments] Filtrados:', {
    total: appointments.length,
    proximos: proximos.length,
    historico: historico.length,
    activeTab
  });

  const agendamentosExibidos = activeTab === "proximos" ? proximos : historico;

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "#4CAF50";
      case "pending":
        return theme.colors.secondary;
      case "completed":
        return "#9E9E9E";
      case "rejected":
        return "#F44336";
      default:
        return theme.colors.grey;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado";
      case "pending":
        return "Pendente";
      case "completed":
        return "Concluído";
      case "rejected":
        return "Cancelado";
      default:
        return status;
    }
  };

  const openDetails = (agendamento: Appointment) => {
    console.log('📋 [MyAppointments] Abrindo detalhes do agendamento:', agendamento.id);
    setSelectedAgendamento(agendamento);
    setDetailsModalVisible(true);
  };

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: "Meus Agendamentos" }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando agendamentos...</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Meus Agendamentos" }} />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            console.log('📋 [MyAppointments] Voltando');
            router.back();
          }}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "proximos" && styles.tabActive]}
            onPress={() => {
              console.log('📋 [MyAppointments] Tab alterada para: proximos');
              setActiveTab("proximos");
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "proximos" && styles.tabTextActive,
              ]}
            >
              Próximos ({proximos.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "historico" && styles.tabActive]}
            onPress={() => {
              console.log('📋 [MyAppointments] Tab alterada para: historico');
              setActiveTab("historico");
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "historico" && styles.tabTextActive,
              ]}
            >
              Histórico ({historico.length})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {agendamentosExibidos.length > 0 ? (
            agendamentosExibidos.map((agendamento) => (
              <View key={agendamento.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.petInfo}>
                    <Text style={styles.petIcon}>🐾</Text>
                    <View>
                      <Text style={styles.petNome}>{agendamento.petName}</Text>
                      <Text style={styles.servico}>{agendamento.service}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(agendamento.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {getStatusText(agendamento.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>
                      {formatDate(agendamento.dateTime)}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>
                      {formatTime(agendamento.dateTime)}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => openDetails(agendamento)}
                  >
                    <Text style={styles.detailsButtonText}>Ver Detalhes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>
                {activeTab === "proximos"
                  ? "Você não tem agendamentos futuros"
                  : "Nenhum agendamento no histórico"}
              </Text>
            </View>
          )}
        </ScrollView>

        <Modal
          visible={detailsModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setDetailsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Detalhes do Agendamento</Text>
                <TouchableOpacity onPress={() => {
                  console.log('📋 [MyAppointments] Fechando modal de detalhes');
                  setDetailsModalVisible(false);
                }}>
                  <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>

              {selectedAgendamento && (
                <View style={styles.modalBody}>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Pet:</Text>
                    <Text style={styles.modalValue}>
                      {selectedAgendamento.petName}
                    </Text>
                  </View>

                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Serviço:</Text>
                    <Text style={styles.modalValue}>
                      {selectedAgendamento.service}
                    </Text>
                  </View>

                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Data:</Text>
                    <Text style={styles.modalValue}>
                      {formatDate(selectedAgendamento.dateTime)}
                    </Text>
                  </View>

                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Horário:</Text>
                    <Text style={styles.modalValue}>
                      {formatTime(selectedAgendamento.dateTime)}
                    </Text>
                  </View>

                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Status:</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: getStatusColor(
                            selectedAgendamento.status
                          ),
                        },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {getStatusText(selectedAgendamento.status)}
                      </Text>
                    </View>
                  </View>

                  {selectedAgendamento.gestorNotes && (
                    <View style={styles.modalRow}>
                      <Text style={styles.modalLabel}>Observações do Gestor:</Text>
                      <Text style={styles.modalValue}>
                        {selectedAgendamento.gestorNotes}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setDetailsModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
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
    backgroundColor: "#F5F5F5",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    paddingTop: 60,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
  },
  tabTextActive: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  petInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  petIcon: {
    fontSize: 32,
  },
  petNome: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  servico: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  cardBody: {
    marginBottom: 12,
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
  cardFooter: {
    flexDirection: "row",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 12,
  },
  detailsButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: "center",
  },
  detailsButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
  },
  modalBody: {
    gap: 16,
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  modalValue: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
    textAlign: "right",
  },
  closeButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});