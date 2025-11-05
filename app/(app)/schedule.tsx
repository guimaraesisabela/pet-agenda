import { theme } from "@/components/theme/theme";
import { useAuth } from "@/contexts/AuthContext";
import { appointmentService } from "@/services/appointmentService";
import { PETSHOP_SERVICES } from "@/services/services";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Stack, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ScheduleScreen() {
  const { user, userData } = useAuth();
  const [petName, setPetName] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // NOVO: edição manual
  const [isEditingDateTime, setIsEditingDateTime] = useState<boolean>(false);
  const [manualDate, setManualDate] = useState<string>(() =>
    formatDateBR(new Date())
  ); // DD/MM/YYYY
  const [manualTime, setManualTime] = useState<string>(() =>
    formatTimeHM(new Date())
  ); // HH:MM

  // Utility: formata para DD/MM/YYYY
  function formatDateBR(d: Date) {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  // Utility: formata para HH:MM
  function formatTimeHM(d: Date) {
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  // Parse data no formato DD/MM/YYYY -> Date (meio-dia)
  function parseDateBR(value: string): Date | null {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
    if (!match) return null;
    const day = Number(match[1]);
    const month = Number(match[2]) - 1;
    const year = Number(match[3]);
    const d = new Date(year, month, day);
    // checar basicamente se manteve os valores (evita 31/02 virar 03/03)
    if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) {
      return null;
    }
    return d;
  }

  // Parse hora HH:MM -> { hours, minutes }
  function parseTimeHM(value: string): { hours: number; minutes: number } | null {
    const match = /^(\d{2}):(\d{2})$/.exec(value);
    if (!match) return null;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
    return { hours, minutes };
  }

  // Quando usuário salva edição manual
  const applyManualDateTime = () => {
    const d = parseDateBR(manualDate);
    const t = parseTimeHM(manualTime);

    if (!d) {
      Alert.alert("Data inválida", "Use o formato DD/MM/AAAA (ex: 25/12/2025).");
      return;
    }
    if (!t) {
      Alert.alert("Hora inválida", "Use o formato HH:MM no formato 24h (ex: 09:30).");
      return;
    }

    const combined = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      t.hours,
      t.minutes
    );

    if (combined < new Date()) {
      Alert.alert("Data/Hora inválida", "Não é possível escolher data/hora no passado.");
      return;
    }

    // Aplica nos estados
    setSelectedDate(new Date(combined.getFullYear(), combined.getMonth(), combined.getDate()));
    setSelectedTime(new Date(0, 0, 0, combined.getHours(), combined.getMinutes()));
    setIsEditingDateTime(false);
  };

  // Handlers do DateTimePicker (corrigidos)
  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "set" && date) {
      // Mantém apenas a parte da data
      setSelectedDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
      // atualiza os inputs manuais para refletir a mudança
      setManualDate(formatDateBR(date));
    }
    if (Platform.OS !== "ios") {
      setShowDatePicker(false);
    }
  };

  const onTimeChange = (event: DateTimePickerEvent, time?: Date) => {
    if (event.type === "set" && time) {
      setSelectedTime(new Date(0, 0, 0, time.getHours(), time.getMinutes()));
      setManualTime(formatTimeHM(time));
    }
    if (Platform.OS !== "ios") {
      setShowTimePicker(false);
    }
  };

  const handleSchedule = async () => {
    if (!petName || !selectedService) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }
    if (!user) {
      Alert.alert("Erro", "Você precisa estar logado para agendar");
      return;
    }

    const dateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes()
    );

    if (dateTime < new Date()) {
      Alert.alert("Erro", "Não é possível agendar em uma data/hora passada");
      return;
    }

    setIsLoading(true);
    try {
      const appointmentId = await appointmentService.createAppointment(
        user.uid,
        userData?.displayName || user.email || "Usuário",
        {
          petName,
          service: selectedService,
          dateTime,
        }
      );

      Alert.alert(
        "Sucesso!",
        "Agendamento solicitado com sucesso! Aguarde a aprovação do gestor.",
        [
          {
            text: "OK",
            onPress: () => {
              setPetName("");
              setSelectedService("");
              const now = new Date();
              setSelectedDate(now);
              setSelectedTime(now);
              setManualDate(formatDateBR(now));
              setManualTime(formatTimeHM(now));
              router.back();
            },
          },
        ]
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao criar agendamento";
      Alert.alert("Erro", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Sincroniza os inputs manuais sempre que selectedDate/time mudarem externamente
  const syncManualInputs = () => {
    setManualDate(formatDateBR(selectedDate));
    setManualTime(formatTimeHM(selectedTime));
  };

  // chama sync quando componentes mudarem (aqui manualmente: sempre que entrar no modo de edição)
  // Obs: como este componente não usa useEffect pra evitar confusão no snippet, chamamos sempre em toggles abaixo

  return (
    <>
      <Stack.Screen options={{ title: "Agendar Serviço" }} />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons name="calendar" size={48} color="#FF6B35" strokeWidth={1.5} />
            <Text style={styles.title}>Novo Agendamento</Text>
            <Text style={styles.subtitle}>
              Preencha os dados para solicitar um horário
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome do Pet</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Rex, Bella, Luna..."
                placeholderTextColor="#999"
                value={petName}
                onChangeText={setPetName}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Serviço</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.servicesScroll}
              >
                {PETSHOP_SERVICES.map((service) => (
                  <TouchableOpacity
                    key={service}
                    style={[
                      styles.serviceChip,
                      selectedService === service && styles.serviceChipSelected,
                    ]}
                    onPress={() => setSelectedService(service)}
                    disabled={isLoading}
                  >
                    <Text
                      style={[
                        styles.serviceChipText,
                        selectedService === service && styles.serviceChipTextSelected,
                      ]}
                    >
                      {service}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* DATA */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Data</Text>

              {!isEditingDateTime ? (
                <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                  <TouchableOpacity
                    style={styles.dateTimeButton}
                    onPress={() => setShowDatePicker(true)}
                    disabled={isLoading}
                  >
                    <Ionicons name="calendar" size={20} color="#FF6B35" />
                    <Text style={styles.dateTimeText}>
                      {formatDateBR(selectedDate)}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.smallButton]}
                    onPress={() => {
                      // abrir edição manual: sincroniza antes
                      syncManualInputs();
                      setIsEditingDateTime(true);
                    }}
                    disabled={isLoading}
                  >
                    <Text style={styles.smallButtonText}>Editar</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="DD/MM/AAAA"
                    value={manualDate}
                    onChangeText={setManualDate}
                    editable={!isLoading}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>
              )}
            </View>

            {/* HORA */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Horário</Text>

              {!isEditingDateTime ? (
                <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                  <TouchableOpacity
                    style={styles.dateTimeButton}
                    onPress={() => setShowTimePicker(true)}
                    disabled={isLoading}
                  >
                    <Ionicons name="time" size={20} color="#FF6B35" />
                    <Text style={styles.dateTimeText}>
                      {formatTimeHM(selectedTime)}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.smallButton]}
                    onPress={() => {
                      syncManualInputs();
                      setIsEditingDateTime(true);
                    }}
                    disabled={isLoading}
                  >
                    <Text style={styles.smallButtonText}>Editar</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="HH:MM"
                    value={manualTime}
                    onChangeText={setManualTime}
                    editable={!isLoading}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
              )}
            </View>

            {/* controles de edição manual */}
            {isEditingDateTime && (
              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  style={[styles.buttonSmall, { backgroundColor: "#4CAF50" }]}
                  onPress={() => applyManualDateTime()}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonSmallText}>Salvar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.buttonSmall, { backgroundColor: "#9E9E9E" }]}
                  onPress={() => {
                    // cancelar edição - reseta os valores manuais
                    setManualDate(formatDateBR(selectedDate));
                    setManualTime(formatTimeHM(selectedTime));
                    setIsEditingDateTime(false);
                  }}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonSmallText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* DateTimePickers */}
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
                minimumDate={new Date()}
                locale="pt-BR"
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onTimeChange}
                locale="pt-BR"
              />
            )}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSchedule}
              disabled={isLoading}
            >
              <Ionicons name="time" size={20} color="#FFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>
                {isLoading ? "Agendando..." : "Solicitar Agendamento"}
              </Text>
            </TouchableOpacity>
          </View>
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
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    padding: 20,
    paddingTop: 80,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1A1A1A",
  },
  dateTimeButton: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateTimeText: {
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "600",
  },
  servicesScroll: {
    flexDirection: "row",
  },
  serviceChip: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
  serviceChipSelected: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },
  serviceChipText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  serviceChipTextSelected: {
    color: "#FFF",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    flexDirection: "row",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#FFB8A0",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },

  // pequenos botões e estilos
  smallButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  smallButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },
  buttonSmall: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSmallText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
