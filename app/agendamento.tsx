import { WarningModal } from "@/components/calendar/atencao-modal";
import { BookingFormModal } from "@/components/calendar/booking-formal";
import { CalendarPicker } from "@/components/calendar/calendar-picker";
import { ConfirmationModal } from "@/components/calendar/confirmacao-modal";
import { theme } from "@/components/theme/theme";
import { useState } from "react";
import {
  FlatList,
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
    "2025-10-07": ["09:00", "10:30", "13:00", "15:00"],
    "2025-10-08": ["08:30", "11:00", "14:00", "16:30"],
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agende um horário para seu pet:</Text>

      <CalendarPicker onDateSelect={setSelectedDate} />

      {selectedDate ? (
        horarios.length > 0 ? (
          <>
            <Text style={styles.subtitle}>Horários disponíveis:</Text>
            <FlatList
              data={horarios}
              keyExtractor={(item) => item}
              numColumns={3}
              renderItem={({ item }) => (
                <TouchableOpacity
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
              )}
            />
          </>
        ) : (
            <Text style={styles.noSlotsText}>
              Não temos horários disponíveis para essa data 😿
            </Text>
        )
      ) : (
        <Text style={styles.infoText}>
          Selecione uma data para ver os horários disponíveis.
        </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16, paddingTop: 40 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginVertical: 10,
  },
  noSlotsText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: 16,
    marginTop: 20,
  },
  infoText: {
    textAlign: "center",
    marginTop: 20,
    color: theme.colors.text,
  },
  timeButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.grey,
    margin: 6,
  },
  timeButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  timeText: { color: theme.colors.text },
  timeTextSelected: { color: theme.colors.background },
});
