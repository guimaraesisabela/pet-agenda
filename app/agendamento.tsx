import { WarningModal } from "@/components/calendar/atencao-modal";
import { BookingFormModal } from "@/components/calendar/booking-formal";
import { CalendarPicker } from "@/components/calendar/calendar-picker";
import { ConfirmationModal } from "@/components/calendar/confirmacao-modal";
import { theme } from "@/components/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AgendamentoScreen() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);

  const horariosPorDia: Record<string, string[]> = {
    "2025-10-07": [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "14:00",
      "14:30",
      "15:00",
    ],
    "2025-10-08": ["08:30", "09:00", "11:00", "14:00", "16:30"],
  };

  const horarios = horariosPorDia[selectedDate] || [];

  const handleHorarioPress = (hora: string) => {
    if (!selectedDate) {
      setWarningVisible(true);
      return;
    }
    setSelectedTime(hora);
    setFormModalVisible(true);
  };

  const handleConfirmForm = (formData: any) => {
    console.log("Dados enviados:", {
      ...formData,
      date: selectedDate,
      time: selectedTime,
    });
    setFormModalVisible(false);
    setConfirmationVisible(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("pt-BR", { month: "long" });
    return `${day} de ${month.charAt(0).toUpperCase() + month.slice(1)}`;
  };

  return (
    <>
      <Stack.Screen options={{ title: "Novo Agendamento" }} />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/agendamentos.png")}
            style={styles.headerImage}
          />
        </View>
        <TouchableOpacity
          style={styles.meusAgendamentosButton}
          onPress={() => router.push("/agendamento-usuario")}
        >
          <Ionicons name="calendar" size={20} color={theme.colors.primary} />
          <Text style={styles.meusAgendamentosText}>Meus Agendamentos</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecione uma data</Text>
          <View style={styles.card}>
            <CalendarPicker onDateSelect={setSelectedDate} />
          </View>
        </View>

        {selectedDate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Horários disponíveis para {formatDate(selectedDate)}
            </Text>
            <View style={styles.card}>
              {horarios.length > 0 ? (
                <View style={styles.horariosContainer}>
                  {horarios.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.timeButton,
                        item === selectedTime && styles.timeButtonSelected,
                      ]}
                      onPress={() => handleHorarioPress(item)}
                    >
                      <Text
                        style={[
                          styles.timeText,
                          item === selectedTime && styles.timeTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={styles.noSlotsText}>
                  Não há horários disponíveis para esta data 😿
                </Text>
              )}
            </View>
          </View>
        )}

        <WarningModal
          visible={warningVisible}
          onClose={() => setWarningVisible(false)}
        />

        <BookingFormModal
          visible={formModalVisible}
          onClose={() => setFormModalVisible(false)}
          onConfirm={handleConfirmForm}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />

        <ConfirmationModal
          visible={confirmationVisible}
          onClose={() => setConfirmationVisible(false)}
          date={selectedDate}
          time={selectedTime}
        />
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
  imageContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  headerImage: {
    width: 180,
    height: 180,
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  meusAgendamentosButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  meusAgendamentosText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  horariosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  timeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.grey,
    backgroundColor: "#fff",
    minWidth: 75,
    alignItems: "center",
  },
  timeButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  timeText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  timeTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  noSlotsText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: 14,
    paddingVertical: 20,
  },
});
