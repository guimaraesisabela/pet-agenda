import { theme } from "@/components/theme/theme";
import { useAuth } from "@/contexts/AuthContext";
import { Appointment, appointmentService } from "@/services/appointmentService";
import { auth } from "@/services/firebase";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AgendamentoGestorScreen() {
  console.log('👔 [GestorHome] Tela renderizada');
  
  const { userData } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [gestorNotes, setGestorNotes] = useState("");
  const [actionType, setActionType] = useState<"confirm" | "reject" | "complete" | null>(null);

  const loadAppointments = useCallback(async () => {
    console.log('👔 [GestorHome] Carregando todos os agendamentos...');
    setLoading(true);
    
    try {
      const data = await appointmentService.getAllAppointments();
      console.log('✅ [GestorHome] Agendamentos carregados:', data.length);
      setAppointments(data);
    } catch (error) {
      console.error('❌ [GestorHome] Erro ao carregar:', error);
      Alert.alert("Erro", "Não foi possível carregar os agendamentos");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log('👔 [GestorHome] Tela focada, recarregando');
      loadAppointments();
    }, [loadAppointments])
  );

  const handleAction = (appointment: Appointment, action: "confirm" | "reject" | "complete") => {
    console.log('👔 [GestorHome] Ação iniciada:', action, 'para agendamento:', appointment.id);
    setSelectedAppointment(appointment);
    setActionType(action);
    setGestorNotes(appointment.gestorNotes || "");
    setModalVisible(true);
  };

  const confirmAction = async () => {
    if (!selectedAppointment || !actionType) {
      console.log('⚠️ [GestorHome] Dados inválidos para confirmação');
      return;
    }

    console.log('👔 [GestorHome] Confirmando ação:', actionType);
    setLoading(true);
    setModalVisible(false);

    try {
      const statusMap = {
        confirm: "confirmed" as const,
        reject: "rejected" as const,
        complete: "completed" as const,
      };

      await appointmentService.updateAppointmentStatus(
        selectedAppointment.id!,
        statusMap[actionType],
        gestorNotes
      );

      console.log('✅ [GestorHome] Status atualizado com sucesso');
      Alert.alert("Sucesso!", "Agendamento atualizado com sucesso");
      await loadAppointments();
    } catch (error) {
      console.error('❌ [GestorHome] Erro ao atualizar:', error);
      Alert.alert("Erro", "Não foi possível atualizar o agendamento");
    } finally {
      setLoading(false);
      setSelectedAppointment(null);
      setActionType(null);
      setGestorNotes("");
    }
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "#4CAF50";
      case "pending": return "#FF9800";
      case "completed": return "#9E9E9E";
      case "rejected": return "#F44336";
      default: return theme.colors.grey;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed": return "Confirmado";
      case "pending": return "Pendente";
      case "completed": return "Concluído";
      case "rejected": return "Rejeitado";
      default: return status;
    }
  };

  const pendingAppointments = appointments.filter(a => a.status === "pending");
  const confirmedAppointments = appointments.filter(a => a.status === "confirmed");
  const otherAppointments = appointments.filter(a => a.status === "completed" || a.status === "rejected");

  const handleLogout = () => {
    console.log('👔 [GestorHome] Logout iniciado');
    auth.signOut();
  };

  if (loading && appointments.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title: "" }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando agendamentos...</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "" }} />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
      </TouchableOpacity>

      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="calendar-outline" size={28} color={theme.colors.primary} />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Painel do Gestor</Text>
              <Text style={styles.headerSubtitle}>Olá, {userData?.displayName || 'Gestor'}!</Text>
            </View>
          </View>
          <TouchableOpacity onPress={loadAppointments} style={styles.refreshButton}>
            <Ionicons name="refresh" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
          {/* PENDENTES */}
          {pendingAppointments.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="time" size={20} color="#FF9800" />
                <Text style={styles.sectionTitle}>
                  Pendentes ({pendingAppointments.length})
                </Text>
              </View>

              {pendingAppointments.map((appointment) => (
                <View key={appointment.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardInfo}>
                      <Text style={styles.petName}>🐾 {appointment.petName}</Text>
                      <Text style={styles.tutorName}>Tutor: {appointment.tutorName}</Text>
                      <Text style={styles.service}>{appointment.service}</Text>
                    </View>
                    <View style={styles.dateTime}>
                      <Text style={styles.date}>{formatDate(appointment.dateTime)}</Text>
                      <Text style={styles.time}>{formatTime(appointment.dateTime)}</Text>
                    </View>
                  </View>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => handleAction(appointment, "reject")}
                    >
                      <Ionicons name="close-circle" size={18} color="#fff" />
                      <Text style={styles.actionButtonText}>Rejeitar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.confirmButton]}
                      onPress={() => handleAction(appointment, "confirm")}
                    >
                      <Ionicons name="checkmark-circle" size={18} color="#fff" />
                      <Text style={styles.actionButtonText}>Confirmar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* CONFIRMADOS */}
          {confirmedAppointments.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.sectionTitle}>
                  Confirmados ({confirmedAppointments.length})
                </Text>
              </View>

              {confirmedAppointments.map((appointment) => (
                <View key={appointment.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardInfo}>
                      <Text style={styles.petName}>🐾 {appointment.petName}</Text>
                      <Text style={styles.tutorName}>Tutor: {appointment.tutorName}</Text>
                      <Text style={styles.service}>{appointment.service}</Text>
                    </View>
                    <View style={styles.dateTime}>
                      <Text style={styles.date}>{formatDate(appointment.dateTime)}</Text>
                      <Text style={styles.time}>{formatTime(appointment.dateTime)}</Text>
                    </View>
                  </View>

                  {appointment.gestorNotes && (
                    <View style={styles.notesContainer}>
                      <Text style={styles.notesLabel}>Observações:</Text>
                      <Text style={styles.notesText}>{appointment.gestorNotes}</Text>
                    </View>
                  )}

                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.completeButton]}
                      onPress={() => handleAction(appointment, "complete")}
                    >
                      <Ionicons name="checkmark-done" size={18} color="#fff" />
                      <Text style={styles.actionButtonText}>Concluir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* OUTROS (Concluídos e Rejeitados) */}
          {otherAppointments.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="archive" size={20} color="#9E9E9E" />
                <Text style={styles.sectionTitle}>
                  Histórico ({otherAppointments.length})
                </Text>
              </View>

              {otherAppointments.map((appointment) => (
                <View key={appointment.id} style={[styles.card, styles.cardDisabled]}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardInfo}>
                      <Text style={styles.petName}>🐾 {appointment.petName}</Text>
                      <Text style={styles.tutorName}>Tutor: {appointment.tutorName}</Text>
                      <Text style={styles.service}>{appointment.service}</Text>
                    </View>
                    <View>
                      <Text style={styles.date}>{formatDate(appointment.dateTime)}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
                        <Text style={styles.statusText}>{getStatusText(appointment.status)}</Text>
                      </View>
                    </View>
                  </View>

                  {appointment.gestorNotes && (
                    <View style={styles.notesContainer}>
                      <Text style={styles.notesLabel}>Observações:</Text>
                      <Text style={styles.notesText}>{appointment.gestorNotes}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {appointments.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>Nenhum agendamento cadastrado</Text>
            </View>
          )}
        </ScrollView>

        {/* MODAL DE AÇÃO */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                {actionType === "confirm" && "Confirmar Agendamento"}
                {actionType === "reject" && "Rejeitar Agendamento"}
                {actionType === "complete" && "Concluir Agendamento"}
              </Text>

              {selectedAppointment && (
                <View style={styles.modalInfo}>
                  <Text style={styles.modalInfoText}>
                    Pet: {selectedAppointment.petName}
                  </Text>
                  <Text style={styles.modalInfoText}>
                    Tutor: {selectedAppointment.tutorName}
                  </Text>
                  <Text style={styles.modalInfoText}>
                    Serviço: {selectedAppointment.service}
                  </Text>
                </View>
              )}

              <Text style={styles.inputLabel}>
                Observações {actionType === "reject" ? "(obrigatório)" : "(opcional)"}:
              </Text>
              <TextInput
                style={styles.textArea}
                placeholder="Digite observações para o tutor..."
                value={gestorNotes}
                onChangeText={setGestorNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    console.log('👔 [GestorHome] Modal cancelado');
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalConfirmButton}
                  onPress={confirmAction}
                >
                  <Text style={styles.modalConfirmText}>Confirmar</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  logoutButton: {
    position: "absolute",
    top: 50,
    right: 16,
    zIndex: 10,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: theme.colors.pink,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerText: {
    gap: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C2C2C",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  refreshButton: {
    padding: 8,
  },
  mainScroll: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C2C2C",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardDisabled: {
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  petName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C2C2C",
  },
  tutorName: {
    fontSize: 14,
    color: "#666",
  },
  service: {
    fontSize: 13,
    color: "#999",
  },
  dateTime: {
    alignItems: "flex-end",
    gap: 4,
  },
  date: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C2C2C",
  },
  time: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  statusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  notesContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: "#2C2C2C",
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  completeButton: {
    backgroundColor: "#2196F3",
  },
  actionButtonText: {
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C2C2C",
    marginBottom: 16,
    textAlign: "center",
  },
  modalInfo: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 4,
  },
  modalInfoText: {
    fontSize: 14,
    color: "#2C2C2C",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C2C2C",
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});