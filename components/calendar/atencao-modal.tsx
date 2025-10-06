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

type WarningModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function WarningModal({ visible, onClose }: WarningModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Image
            source={require("@/assets/gatinho-duvida.jpg")}
            style={styles.image}
          />

          <Text style={styles.title}>Ops!</Text>
          <Text style={styles.message}>
            Você precisa preencher todos os campos obrigatórios.
          </Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Entendi</Text>
          </TouchableOpacity>
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
    backgroundColor: "#ffecce",
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
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderRadius: 8,
  },
  buttonText: {
    color: theme.colors.background,
    fontWeight: "600",
    fontSize: 16,
  },
});
