import { theme } from "@/components/theme/theme";
import React from "react";
import {
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type ConfirmationModalProps = {
  visible: boolean;
  onClose: () => void;
  date: string;
  time: string;
};

export function ConfirmationModal({
  visible,
  onClose,
  date,
  time,
}: ConfirmationModalProps) {
  const dataFormatada = new Date(date).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          <Image
            source={require("@/assets/pets-feliz.jpg")}
            style={{
              width: 200,
              height: 200,
              alignSelf: "center",
              marginBottom: -5,
            }}
          />

          <Text style={styles.title}>Agendamento Confirmado!</Text>
          <Text style={styles.subtitle}>
             {dataFormatada} às {time}
          </Text>
        </View>
      </View>
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
    backgroundColor: "#eadcdc",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    width: "85%",
    elevation: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 14,
    zIndex: 2,
  },
  closeText: {
    fontSize: 28,
    color: theme.colors.text,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "center",
  },
});
