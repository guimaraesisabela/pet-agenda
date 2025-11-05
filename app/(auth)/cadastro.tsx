import { theme } from "@/components/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../services/firebase";
import { userService } from "../../services/userService";

export default function CadastroScreen() {
  console.log('📝 [Cadastro] Tela renderizada');
  
  const [role, setRole] = useState<"tutor" | "gestor">("tutor");
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [nomePet, setNomePet] = useState("");
  const [especie, setEspecie] = useState("");

  const [petshop, setPetshop] = useState("");
  const [unidade, setUnidade] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"error" | "warning">("error");
  const [isLoading, setIsLoading] = useState(false);

  const handleCadastro = async () => {
    console.log('📝 [Cadastro] handleCadastro iniciado');
    console.log('📝 [Cadastro] Role selecionado:', role);
    console.log('📝 [Cadastro] Dados do formulário:', {
      nome,
      email,
      hasPassword: !!senha,
      nomePet: role === 'tutor' ? nomePet : 'N/A',
      petshop: role === 'gestor' ? petshop : 'N/A'
    });
    
    if (!nome || !email || !senha || !confirmarSenha) {
      console.log('⚠️ [Cadastro] Campos obrigatórios não preenchidos');
      setModalMessage("Por favor, preencha todos os campos obrigatórios!");
      setModalType("warning");
      setModalVisible(true);
      return;
    }

    if (senha !== confirmarSenha) {
      console.log('⚠️ [Cadastro] Senhas não coincidem');
      setModalMessage("As senhas não coincidem!");
      setModalType("warning");
      setModalVisible(true);
      return;
    }

    if (senha.length < 6) {
      console.log('⚠️ [Cadastro] Senha muito curta');
      setModalMessage("A senha deve ter pelo menos 6 caracteres!");
      setModalType("warning");
      setModalVisible(true);
      return;
    }

    if (role === "tutor" && (!nomePet || !especie)) {
      console.log('⚠️ [Cadastro] Dados do pet não preenchidos');
      setModalMessage("Por favor, preencha os dados do seu pet!");
      setModalType("warning");
      setModalVisible(true);
      return;
    }

    if (role === "gestor" && (!petshop || !unidade)) {
      console.log('⚠️ [Cadastro] Dados do petshop não preenchidos');
      setModalMessage("Por favor, preencha os dados do petshop!");
      setModalType("warning");
      setModalVisible(true);
      return;
    }

    console.log('📝 [Cadastro] Todas as validações passaram, iniciando processo de cadastro...');
    setIsLoading(true);
    
    try {
      console.log('📝 [Cadastro] Criando usuário no Firebase Auth...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      console.log('✅ [Cadastro] Usuário criado no Auth com sucesso!', {
        uid: userCredential.user.uid,
        email: userCredential.user.email
      });
      
      console.log('📝 [Cadastro] Atualizando displayName...');
      await updateProfile(userCredential.user, {
        displayName: nome,
      });
      console.log('✅ [Cadastro] DisplayName atualizado');

      console.log('📝 [Cadastro] Salvando dados no Firestore...');
      const userData = {
        uid: userCredential.user.uid,
        email: email,
        displayName: nome,
        role: role,
      };
      console.log('📝 [Cadastro] Dados a serem salvos:', userData);
      
      await userService.createUser(userData);
      console.log('✅ [Cadastro] Dados salvos no Firestore com sucesso!');

      console.log('📝 [Cadastro] Cadastro completo! Redirecionando baseado no role:', role);

      if (role === "gestor") {
        console.log('📝 [Cadastro] Redirecionando para /agendamento-gestor');
        router.replace("/(app)/agendamento-gestor");
      } else {
        console.log('📝 [Cadastro] Redirecionando para /agendamento');
        router.replace("/(app)/agendamento");
      }
    } catch (error: any) {
      console.error('❌ [Cadastro] Erro no processo de cadastro:', error);
      console.error('❌ [Cadastro] Código do erro:', error.code);
      console.error('❌ [Cadastro] Mensagem:', error.message);
      
      let errorMessage = "Erro ao cadastrar. Tente novamente.";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este e-mail já está em uso!";
        console.log('⚠️ [Cadastro] E-mail já em uso');
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "E-mail inválido!";
        console.log('⚠️ [Cadastro] E-mail inválido');
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Senha muito fraca!";
        console.log('⚠️ [Cadastro] Senha fraca');
      }
      
      setModalMessage(errorMessage);
      setModalType("error");
      setModalVisible(true);
    } finally {
      console.log('📝 [Cadastro] Finalizando processo (setIsLoading false)');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "" }} />
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            console.log('📝 [Cadastro] Botão voltar pressionado');
            router.back();
          }}
          disabled={isLoading}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Image
          source={
            role === "gestor"
              ? require("@/assets/macaquinho.png")
              : require("@/assets/hello-cat.jpg")
          }
          style={[styles.image, role === "gestor" && styles.imageGestor]}
        />

        <Text style={styles.title}>Crie sua Conta</Text>
        <Text style={styles.subtitle}>
          Para começar, selecione seu tipo de perfil:
        </Text>

        <View style={styles.roleSelector}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "tutor" && styles.roleButtonActiveUsuario,
              role !== "tutor" && styles.roleButtonInactive,
            ]}
            onPress={() => {
              console.log('📝 [Cadastro] Role alterado para: tutor');
              setRole("tutor");
            }}
            disabled={isLoading}
          >
            <Text
              style={[
                styles.roleButtonText,
                role === "tutor" && styles.roleButtonTextActive,
              ]}
            >
              Sou Tutor
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "gestor" && styles.roleButtonActiveGestor,
              role !== "gestor" && styles.roleButtonInactive,
            ]}
            onPress={() => {
              console.log('📝 [Cadastro] Role alterado para: gestor');
              setRole("gestor");
            }}
            disabled={isLoading}
          >
            <Text
              style={[
                styles.roleButtonText,
                role === "gestor" && styles.roleButtonTextActive,
              ]}
            >
              Sou Gestor
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          value={nome}
          onChangeText={setNome}
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha (mínimo 6 caracteres)"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
          editable={!isLoading}
        />

        {role === "gestor" ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nome do Petshop"
              value={petshop}
              onChangeText={setPetshop}
              editable={!isLoading}
            />
            <TextInput
              style={styles.input}
              placeholder="Unidade"
              value={unidade}
              onChangeText={setUnidade}
              editable={!isLoading}
            />
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nome do pet"
              value={nomePet}
              onChangeText={setNomePet}
              editable={!isLoading}
            />
            <TextInput
              style={styles.input}
              placeholder="Espécie (gato, cachorro...)"
              value={especie}
              onChangeText={setEspecie}
              editable={!isLoading}
            />
          </>
        )}

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleCadastro}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Já tem uma conta?</Text>
          <TouchableOpacity 
            onPress={() => {
              console.log('📝 [Cadastro] Navegando para login');
              router.push("/(auth)/login");
            }}
            disabled={isLoading}
          >
            <Text style={styles.loginLink}> Fazer Login</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContainer,
                modalType === "warning" && styles.modalContainerWarning,
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  modalType === "warning" && styles.iconContainerWarning,
                ]}
              >
                <Text style={styles.iconText}>
                  {modalType === "warning" ? "⚠️" : "❌"}
                </Text>
              </View>

              <Text style={styles.modalTitle}>
                {modalType === "warning" ? "Atenção!" : "Erro!"}
              </Text>
              <Text style={styles.modalMessage}>{modalMessage}</Text>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  console.log('📝 [Cadastro] Modal fechado');
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 24,
    textAlign: "center",
    color: theme.colors.text,
  },
  roleSelector: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 12,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  roleButtonInactive: {
    backgroundColor: "rgba(255, 192, 203, 0.3)",
  },
  roleButtonActiveUsuario: {
    borderColor: theme.colors.pink,
    backgroundColor: theme.colors.pink,
  },
  roleButtonActiveGestor: {
    borderColor: theme.colors.pink,
    backgroundColor: theme.colors.pink,
  },
  roleButtonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  roleButtonTextActive: {
    color: theme.colors.background,
  },
  input: {
    width: "100%",
    borderColor: theme.colors.grey,
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    width: "85%",
    alignSelf: "center",
    marginBottom: 8,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "400",
    color: theme.colors.text,
  },
  loginLink: {
    fontSize: 16,
    color: theme.colors.pink,
    fontWeight: "700",
    fontStyle: "italic",
  },
  image: {
    width: 180,
    height: 180,
    alignSelf: "center",
    marginBottom: -40,
  },
  imageGestor: {
    width: 140,
    height: 130,
    marginBottom: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  modalContainerWarning: {
    backgroundColor: "#FFF4E6",
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFE8E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  iconContainerWarning: {
    backgroundColor: "#FFF4E6",
  },
  iconText: {
    fontSize: 32,
  },
  modalTitle: {
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    color: "black",
    marginBottom: 20,
    lineHeight: 23,
  },
  modalButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 13,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: "100%",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});