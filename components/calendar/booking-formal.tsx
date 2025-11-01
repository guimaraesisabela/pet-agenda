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
import { Dropdown } from "react-native-element-dropdown";
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

  const especies = [
    { label: "Cachorro", value: "cachorro" },
    { label: "Gato", value: "gato" },
    { label: "Coelho", value: "coelho" },
    { label: "Hamster", value: "hamster" },
    { label: "Pássaro", value: "passaro" },
  ];

  const servicos = [
    { label: "Banho", value: "banho" },
    { label: "Tosa", value: "tosa" },
    { label: "Banho e Tosa Completa", value: "banho_tosa" },
    { label: "Tosa Higiênica", value: "tosa_higienica" },
    { label: "Consulta Veterinária", value: "consulta" },
    { label: "Vacinação", value: "vacinacao" },
  ];

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
          <ScrollView 
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            <Image
              source={require("@/assets/gatinho-anotando.jpeg")}
              style={styles.image}
            />
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

            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={especies}
              maxHeight={200}
              labelField="label"
              valueField="value"
              placeholder="Selecione uma espécie"
              value={especie}
              onChange={(item) => setEspecie(item.value)}
              containerStyle={styles.dropdownContainer}
              itemContainerStyle={styles.itemContainer}
              itemTextStyle={styles.itemTextStyle}
              activeColor="#F5F5F5"
              renderItem={(item) => (
                <View style={styles.dropdownItem}>
                  <Text style={styles.itemTextStyle}>{item.label}</Text>
                </View>
              )}
            />

            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={servicos}
              maxHeight={200}
              labelField="label"
              valueField="value"
              placeholder="Selecione um serviço"
              value={tipoServico}
              onChange={(item) => setTipoServico(item.value)}
              containerStyle={styles.dropdownContainer}
              itemContainerStyle={styles.itemContainer}
              itemTextStyle={styles.itemTextStyle}
              activeColor="#F5F5F5"
              renderItem={(item) => (
                <View style={styles.dropdownItem}>
                  <Text style={styles.itemTextStyle}>{item.label}</Text>
                </View>
              )}
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
    maxHeight: "80%",
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
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.grey,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
    backgroundColor: "#fff",
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: theme.colors.text,
  },
  dropdownContainer: {
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  itemContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  itemTextStyle: {
    fontSize: 14,
    color: theme.colors.text,
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