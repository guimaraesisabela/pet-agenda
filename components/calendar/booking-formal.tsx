import { theme } from "@/components/theme/theme";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WarningModal } from "./atencao-modal";

type BookingFormModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (formData: {
    tutor: string;
    pet: string;
    especie: string;
    observacoes?: string;
    tipoServico: string;
  }) => void;
  selectedDate: string;
  selectedTime: string;
};

export function BookingFormModal({
  visible,
  onClose,
  onConfirm,
  selectedDate,
  selectedTime,
}: BookingFormModalProps) {
  const [tutor, setTutor] = useState("");
  const [pet, setPet] = useState("");
  const [especie, setEspecie] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [tipoServico, setTipoServico] = useState("");
  const [warningVisible, setWarningVisible] = useState(false);

  const handleSubmit = () => {
    if (!tutor || !pet || !especie || !tipoServico) {
      setWarningVisible(true);
      return;
    }

    onConfirm({ tutor, pet, especie, observacoes, tipoServico });
    setTutor("");
    setPet("");
    setEspecie("");
    setObservacoes("");
    setTipoServico("");
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modalContainer}>
          <Image
            source={require("@/assets/gatinho-anotando.jpeg")}
            style={styles.image}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Detalhes do Agendamento</Text>
            <Text style={styles.subtitle}>
              {selectedDate} às {selectedTime}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome do tutor"
              value={tutor}
              onChangeText={setTutor}
            />

            <TextInput
              style={styles.input}
              placeholder="Nome do pet"
              value={pet}
              onChangeText={setPet}
            />

            <TextInput
              style={styles.input}
              placeholder="Espécie (ex: gato, cachorro...)"
              value={especie}
              onChangeText={setEspecie}
            />

            <TextInput
              style={styles.input}
              placeholder="Tipo de serviço (ex: banho, consulta...)"
              value={tipoServico}
              onChangeText={setTipoServico}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Observações (opcional)"
              multiline
              numberOfLines={4}
              value={observacoes}
              onChangeText={setObservacoes}
            />

            <View style={styles.buttons}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleSubmit}
              >
                <Text style={styles.confirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        <WarningModal
          visible={warningVisible}
          onClose={() => setWarningVisible(false)}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    elevation: 10,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 5,
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: theme.colors.text,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.grey,
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 10,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: theme.colors.pink,
    backgroundColor: theme.colors.pink,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelText: {
    color: theme.colors.background,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
  },
});
