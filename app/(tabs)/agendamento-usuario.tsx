import { theme } from "@/components/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Agendamento {
  id: number;
  petNome: string;
  petEspecie: string;
  servico: string;
  data: string;
  horario: string;
  status: "agendado" | "confirmado" | "concluido" | "cancelado";
  observacoes?: string;
}

export default function MeusAgendamentosScreen() {
  const [activeTab, setActiveTab] = useState<"proximos" | "historico">(
    "proximos"
  );
  const [selectedAgendamento, setSelectedAgendamento] =
    useState<Agendamento | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  const agendamentos: Agendamento[] = [
    {
      id: 1,
      petNome: "Rex",
      petEspecie: "Cachorro",
      servico: "Banho e Tosa Completa",
      data: "2025-11-15",
      horario: "10:00",
      status: "confirmado",
      observacoes: "Rex tem medo de secador",
    },
    {
      id: 2,
      petNome: "Mimi",
      petEspecie: "Gato",
      servico: "Consulta Veterinária",
      data: "2025-11-20",
      horario: "14:30",
      status: "agendado",
    },
    {
      id: 3,
      petNome: "Bob",
      petEspecie: "Cachorro",
      servico: "Vacinação",
      data: "2025-11-25",
      horario: "09:00",
      status: "agendado",
    },
    {
      id: 4,
      petNome: "Luna",
      petEspecie: "Gato",
      servico: "Tosa Higiênica",
      data: "2025-10-10",
      horario: "11:00",
      status: "concluido",
    },
    {
      id: 5,
      petNome: "Thor",
      petEspecie: "Cachorro",
      servico: "Banho",
      data: "2025-10-05",
      horario: "15:00",
      status: "concluido",
    },
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const proximos = agendamentos.filter((ag) => {
    const agData = new Date(ag.data);
    return (
      agData >= today && ag.status !== "cancelado" && ag.status !== "concluido"
    );
  });

  const historico = agendamentos.filter((ag) => {
    const agData = new Date(ag.data);
    return (
      agData < today || ag.status === "cancelado" || ag.status === "concluido"
    );
  });

  const agendamentosExibidos = activeTab === "proximos" ? proximos : historico;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado":
        return "#4CAF50";
      case "agendado":
        return theme.colors.secondary;
      case "concluido":
        return "#9E9E9E";
      case "cancelado":
        return "#F44336";
      default:
        return theme.colors.grey;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmado":
        return "Confirmado";
      case "agendado":
        return "Agendado";
      case "concluido":
        return "Concluído";
      case "cancelado":
        return "Cancelado";
      default:
        return status;
    }
  };

  const getIconName = (especie: string) => {
    if (especie.toLowerCase().includes("gato")) return "🐱";
    if (especie.toLowerCase().includes("cachorro")) return "🐕";
    if (especie.toLowerCase().includes("coelho")) return "🐰";
    if (especie.toLowerCase().includes("passaro")) return "🐦";
    return "🐾";
  };

  const handleCancelAgendamento = () => {
    console.log("Cancelando agendamento:", selectedAgendamento?.id);
    setCancelModalVisible(false);
    setSelectedAgendamento(null);
  };

  const openDetails = (agendamento: Agendamento) => {
    setSelectedAgendamento(agendamento);
    setDetailsModalVisible(true);
  };

  const openCancelModal = (agendamento: Agendamento) => {
    setSelectedAgendamento(agendamento);
    setCancelModalVisible(true);
  };

  return (
    <>
      <Stack.Screen options={{ title: "Meus Agendamentos" }} />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "proximos" && styles.tabActive]}
            onPress={() => setActiveTab("proximos")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "proximos" && styles.tabTextActive,
              ]}
            >
              Próximos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "historico" && styles.tabActive]}
            onPress={() => setActiveTab("historico")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "historico" && styles.tabTextActive,
              ]}
            >
              Histórico
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {agendamentosExibidos.length > 0 ? (
            agendamentosExibidos.map((agendamento) => (
              <View key={agendamento.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.petInfo}>
                    <Text style={styles.petIcon}>
                      {getIconName(agendamento.petEspecie)}
                    </Text>
                    <View>
                      <Text style={styles.petNome}>{agendamento.petNome}</Text>
                      <Text style={styles.servico}>{agendamento.servico}</Text>
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
                      {formatDate(agendamento.data)}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>{agendamento.horario}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => openDetails(agendamento)}
                  >
                    <Text style={styles.detailsButtonText}>Ver Detalhes</Text>
                  </TouchableOpacity>

                  {agendamento.status !== "cancelado" &&
                    agendamento.status !== "concluido" && (
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => openCancelModal(agendamento)}
                      >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                      </TouchableOpacity>
                    )}
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
                <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                  <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>

              {selectedAgendamento && (
                <View style={styles.modalBody}>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Pet:</Text>
                    <Text style={styles.modalValue}>
                      {selectedAgendamento.petNome} (
                      {selectedAgendamento.petEspecie})
                    </Text>
                  </View>

                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Serviço:</Text>
                    <Text style={styles.modalValue}>
                      {selectedAgendamento.servico}
                    </Text>
                  </View>

                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Data:</Text>
                    <Text style={styles.modalValue}>
                      {formatDate(selectedAgendamento.data)}
                    </Text>
                  </View>

                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Horário:</Text>
                    <Text style={styles.modalValue}>
                      {selectedAgendamento.horario}
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

                  {selectedAgendamento.observacoes && (
                    <View style={styles.modalRow}>
                      <Text style={styles.modalLabel}>Observações:</Text>
                      <Text style={styles.modalValue}>
                        {selectedAgendamento.observacoes}
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

        <Modal
          visible={cancelModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setCancelModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Cancelar Agendamento</Text>
              <Text style={styles.cancelWarning}>
                Tem certeza que deseja cancelar este agendamento?
              </Text>

              <View style={styles.cancelButtons}>
                <TouchableOpacity
                  style={styles.cancelNoButton}
                  onPress={() => setCancelModalVisible(false)}
                >
                  <Text style={styles.cancelNoButtonText}>Não</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelYesButton}
                  onPress={handleCancelAgendamento}
                >
                  <Text style={styles.cancelYesButtonText}>Sim, Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 25,
    left: 10,
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
    paddingTop: 45,
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
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.pink,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
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
  cancelWarning: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "center",
    marginVertical: 20,
  },
  cancelButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelNoButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.grey,
    alignItems: "center",
  },
  cancelNoButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  cancelYesButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: theme.colors.pink,
    alignItems: "center",
  },
  cancelYesButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
