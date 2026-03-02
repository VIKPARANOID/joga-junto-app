import { View, Text, Pressable, Modal, Alert } from "react-native";
import { useState } from "react";

interface ContactModalProps {
  visible: boolean;
  athleteName: string;
  athletePhone?: string;
  athleteEmail?: string;
  onClose: () => void;
}

export function ContactModal({
  visible,
  athleteName,
  athletePhone,
  athleteEmail,
  onClose,
}: ContactModalProps) {
  const [contactMethod, setContactMethod] = useState<"whatsapp" | "email" | "form" | null>(null);

  const handleWhatsApp = () => {
    if (!athletePhone) {
      Alert.alert("Indisponível", "Número de WhatsApp não configurado");
      return;
    }
    // TODO: Implementar abertura de WhatsApp
    Alert.alert("WhatsApp", `Abrindo conversa com ${athleteName}`);
  };

  const handleEmail = () => {
    if (!athleteEmail) {
      Alert.alert("Indisponível", "Email não configurado");
      return;
    }
    // TODO: Implementar abertura de email
    Alert.alert("Email", `Abrindo email para ${athleteName}`);
  };

  const handleForm = () => {
    setContactMethod("form");
  };

  const handleSendForm = () => {
    Alert.alert("Sucesso", "Mensagem enviada! O atleta receberá seu contato em breve.");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6 gap-4">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-foreground">
              Entrar em Contato
            </Text>
            <Pressable onPress={onClose} className="p-2">
              <Text className="text-2xl">✕</Text>
            </Pressable>
          </View>

          {/* Descrição */}
          <Text className="text-muted text-sm">
            Escolha como deseja entrar em contato com {athleteName}
          </Text>

          {/* Opções de Contato */}
          {contactMethod === null && (
            <View className="gap-3">
              {/* WhatsApp */}
              <Pressable
                onPress={handleWhatsApp}
                className="flex-row items-center gap-4 bg-green-50 border border-green-200 rounded-lg p-4"
              >
                <Text className="text-3xl">💬</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">WhatsApp</Text>
                  <Text className="text-xs text-muted">Envie uma mensagem direto</Text>
                </View>
                <Text className="text-lg">→</Text>
              </Pressable>

              {/* Email */}
              <Pressable
                onPress={handleEmail}
                className="flex-row items-center gap-4 bg-blue-50 border border-blue-200 rounded-lg p-4"
              >
                <Text className="text-3xl">📧</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">Email</Text>
                  <Text className="text-xs text-muted">Envie um email</Text>
                </View>
                <Text className="text-lg">→</Text>
              </Pressable>

              {/* Formulário */}
              <Pressable
                onPress={handleForm}
                className="flex-row items-center gap-4 bg-purple-50 border border-purple-200 rounded-lg p-4"
              >
                <Text className="text-3xl">📝</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">Formulário</Text>
                  <Text className="text-xs text-muted">Deixe uma mensagem</Text>
                </View>
                <Text className="text-lg">→</Text>
              </Pressable>
            </View>
          )}

          {/* Formulário de Contato */}
          {contactMethod === "form" && (
            <View className="gap-4">
              <Pressable
                onPress={() => setContactMethod(null)}
                className="flex-row items-center gap-2 mb-2"
              >
                <Text className="text-lg">←</Text>
                <Text className="text-foreground font-semibold">Voltar</Text>
              </Pressable>

              {/* Campos do Formulário */}
              <View className="bg-surface rounded-lg p-4 gap-3">
                <Text className="text-sm font-semibold text-foreground">
                  Seu Nome *
                </Text>
                <View className="border border-border rounded-lg px-4 py-3 bg-white">
                  <Text className="text-muted">João Silva</Text>
                </View>

                <Text className="text-sm font-semibold text-foreground">
                  Seu Email *
                </Text>
                <View className="border border-border rounded-lg px-4 py-3 bg-white">
                  <Text className="text-muted">joao@exemplo.com</Text>
                </View>

                <Text className="text-sm font-semibold text-foreground">
                  Mensagem *
                </Text>
                <View className="border border-border rounded-lg px-4 py-3 bg-white min-h-[100px]">
                  <Text className="text-muted">Gostei muito do seu desempenho...</Text>
                </View>

                <Pressable
                  onPress={handleSendForm}
                  className="bg-primary py-3 px-4 rounded-lg mt-2"
                >
                  <Text className="text-white font-semibold text-center">
                    Enviar Mensagem
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Botão Fechar */}
          {contactMethod === null && (
            <Pressable
              onPress={onClose}
              className="bg-surface py-3 px-4 rounded-lg border border-border"
            >
              <Text className="text-foreground font-semibold text-center">Cancelar</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}
