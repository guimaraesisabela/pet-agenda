import { theme } from "@/components/theme/theme";
import { auth } from "@/services/firebase";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Agendamento {
  id: number;
  horario: string;
  petNome: string;
  servico: string;
  tutorNome: string;
  tutorTelefone: string;
  icon: string;
  iconColor: string;
}

interface AgendamentosPorData {
  [data: string]: Agendamento[];
}

export default function AgendamentoGestorScreen() {
  const [selectedDate, setSelectedDate] = useState("23/10");

  const dates = [
    { day: "SEG", date: "23/10" },
    { day: "TER", date: "24/10" },
    { day: "QUA", date: "25/10" },
    { day: "QUI", date: "26/10" },
    { day: "SEX", date: "27/10" },
  ];

  const agendamentos: AgendamentosPorData = {
    "23/10": [
      {
        id: 1,
        horario: "09:00",
        petNome: "Thor",
        servico: "Banho e Tosa Completa",
        tutorNome: "Ana Silva",
        tutorTelefone: "(11) 99999-8888",
        icon: "home",
        iconColor: "#4CAF50",
      },
      {
        id: 2,
        horario: "10:00",
        petNome: "Bella",
        servico: "Tosa Higiênica",
        tutorNome: "Carlos Souza",
        tutorTelefone: "(11) 98888-7777",
        icon: "cut",
        iconColor: "#FF9800",
      },
      {
        id: 3,
        horario: "10:00",
        petNome: "Max",
        servico: "Consulta Veterinária",
        tutorNome: "Julia Lima",
        tutorTelefone: "(11) 97777-6666",
        icon: "medical",
        iconColor: "#9C27B0",
      },
    ],
    "24/10": [],
    "25/10": [],
    "26/10": [],
    "27/10": [],
  };

  const agendamentosHoje = agendamentos[selectedDate] || [];

  const groupByHorario = (agendamentos: Agendamento[]) => {
    const grouped: { [key: string]: Agendamento[] } = {};
    agendamentos.forEach((agendamento) => {
      if (!grouped[agendamento.horario]) {
        grouped[agendamento.horario] = [];
      }
      grouped[agendamento.horario].push(agendamento);
    });
    return grouped;
  };

  const agendamentosAgrupados = groupByHorario(agendamentosHoje);
  const horarios = Object.keys(agendamentosAgrupados).sort();

  const allHorarios = ["09:00", "10:00", "11:00", "12:00"];

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <>
      <Stack.Screen options={{ title: "" }} />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons
              name="calendar-outline"
              size={28}
              color={theme.colors.primary}
            />
            <Text style={styles.headerTitle}>Agenda</Text>
          </View>
        </View>

        <ScrollView style={styles.mainScroll}>
          <View style={styles.datesWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.datesContentContainer}
            >
              {dates.map((item) => (
                <TouchableOpacity
                  key={item.date}
                  style={[
                    styles.dateButton,
                    selectedDate === item.date && styles.dateButtonActive,
                  ]}
                  onPress={() => setSelectedDate(item.date)}
                >
                  <Text
                    style={[
                      styles.dateDay,
                      selectedDate === item.date && styles.dateDayActive,
                    ]}
                  >
                    {item.day} {item.date}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.content}>
            {allHorarios.map((horario) => (
              <View key={horario}>
                <Text style={styles.horarioTitle}>{horario}</Text>
                {agendamentosAgrupados[horario] &&
                agendamentosAgrupados[horario].length > 0 ? (
                  agendamentosAgrupados[horario].map((agendamento) => (
                    <View key={agendamento.id} style={styles.card}>
                      <View
                        style={[
                          styles.cardIcon,
                          { backgroundColor: `${agendamento.iconColor}15` },
                        ]}
                      >
                        <Ionicons
                          name={agendamento.icon as any}
                          size={28}
                          color={agendamento.iconColor}
                        />
                      </View>
                      <View style={styles.cardContent}>
                        <Text style={styles.petNome}>
                          {agendamento.petNome}
                        </Text>
                        <Text style={styles.servico}>
                          {agendamento.servico}
                        </Text>
                        <Text style={styles.tutorInfo}>
                          Tutor: {agendamento.tutorNome} | Tel:{" "}
                          {agendamento.tutorTelefone}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="paw" size={50} color="#B0B0B0" />
                    <Text style={styles.emptyText}>
                      Nenhum agendamento para este horário.
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 35,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
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
    // paddingTop: "20%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: "18%",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2C2C2C",
  },
  mainScroll: {
    flex: 1,
  },
  datesWrapper: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  datesContentContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  dateButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
  },
  dateButtonActive: {
    backgroundColor: theme.colors.pink,
  },
  dateDay: {
    fontSize: 12,
    fontWeight: "600",
    color: "black",
  },
  dateDayActive: {
    color: "#fff",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  horarioTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C2C2C",
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  petNome: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C2C2C",
    marginBottom: 4,
  },
  servico: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  tutorInfo: {
    fontSize: 11,
    color: "#999",
    lineHeight: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    color: "#999",
    marginTop: 8,
  },
});
