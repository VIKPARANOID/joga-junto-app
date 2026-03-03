import { useState } from "react";
import { ScrollView, Text, View, TextInput, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";

export default function AthleteProfileScreen() {
  const { user } = useAuth();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [position, setPosition] = useState("");
  const [preferredFoot, setPreferredFoot] = useState("");
  const [loading, setLoading] = useState(false);

  const updateAthleteProfile = trpc.athlete.updateProfile.useMutation();

  const positions = ["Goleiro", "Zagueiro", "Lateral", "Meia", "Atacante"];
  const feet = ["Destro", "Canhoto", "Ambidestro"];

  const handleSaveProfile = async () => {
    // CRÍTICO: Validação de altura (necessária para calibração de IA)
    if (!height || height.trim() === "") {
      Alert.alert("Erro", "Altura é obrigatória para calibração da IA");
      return;
    }

    const heightNum = parseFloat(height);
    if (isNaN(heightNum)) {
      Alert.alert("Erro", "Altura deve ser um número válido");
      return;
    }

    if (heightNum < 100 || heightNum > 250) {
      Alert.alert("Erro", "Altura deve estar entre 100cm e 250cm");
      return;
    }

    // Validação de peso (opcional mas recomendado)
    let weightNum: number | undefined;
    if (weight && weight.trim() !== "") {
      weightNum = parseFloat(weight);
      if (isNaN(weightNum)) {
        Alert.alert("Erro", "Peso deve ser um número válido");
        return;
      }
      if (weightNum < 30 || weightNum > 200) {
        Alert.alert("Erro", "Peso deve estar entre 30kg e 200kg");
        return;
      }
    }

    // Validação de posição e perna
    if (!position || position.trim() === "") {
      Alert.alert("Erro", "Posição é obrigatória");
      return;
    }

    if (!preferredFoot || preferredFoot.trim() === "") {
      Alert.alert("Erro", "Perna dominante é obrigatória");
      return;
    }

    setLoading(true);

    try {
      await updateAthleteProfile.mutateAsync({
        heightCm: heightNum,
        weightKg: weightNum,
        position,
        preferredFoot: preferredFoot === "Destro" ? "right" : preferredFoot === "Canhoto" ? "left" : "both",
      });

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Profile update error:", error);
      Alert.alert("Erro", "Falha ao atualizar perfil. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-foreground">Seu Perfil</Text>
          <Text className="text-muted mt-2">
            Preencha seus dados para calibrar a análise de IA
          </Text>
        </View>

        {/* Dados Biométricos */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Dados Biométricos
          </Text>

          {/* Altura - OBRIGATÓRIO */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-foreground mb-2">
              Altura (cm) <Text className="text-error">*</Text>
            </Text>
            <TextInput
              value={height}
              onChangeText={setHeight}
              placeholder="175"
              keyboardType="decimal-pad"
              editable={!loading}
              className="border border-border rounded-lg px-4 py-3 text-foreground bg-white"
              placeholderTextColor="#999"
            />
            <Text className="text-xs text-muted mt-1">
              Essencial para calibração da IA (100-250cm)
            </Text>
          </View>

          {/* Peso - Opcional */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-foreground mb-2">
              Peso (kg)
            </Text>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              placeholder="70"
              keyboardType="decimal-pad"
              editable={!loading}
              className="border border-border rounded-lg px-4 py-3 text-foreground bg-white"
              placeholderTextColor="#999"
            />
            <Text className="text-xs text-muted mt-1">
              Opcional (30-200kg)
            </Text>
          </View>
        </View>

        {/* Posição */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Posição <Text className="text-error">*</Text>
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {positions.map((pos) => (
              <Pressable
                key={pos}
                onPress={() => setPosition(pos)}
                disabled={loading}
                style={({ pressed }) => [
                  {
                    backgroundColor: position === pos ? "#0a7ea4" : "#f5f5f5",
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                className="px-4 py-2 rounded-lg border border-border"
              >
                <Text
                  className={`text-sm font-medium ${
                    position === pos ? "text-white" : "text-foreground"
                  }`}
                >
                  {pos}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Perna Dominante */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Perna Dominante <Text className="text-error">*</Text>
          </Text>
          <View className="flex-row gap-2">
            {feet.map((foot) => (
              <Pressable
                key={foot}
                onPress={() => setPreferredFoot(foot)}
                disabled={loading}
                style={({ pressed }) => [
                  {
                    backgroundColor: preferredFoot === foot ? "#0a7ea4" : "#f5f5f5",
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                className="flex-1 px-4 py-2 rounded-lg border border-border items-center"
              >
                <Text
                  className={`text-sm font-medium ${
                    preferredFoot === foot ? "text-white" : "text-foreground"
                  }`}
                >
                  {foot}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSaveProfile}
          disabled={loading}
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          className="bg-primary py-4 px-6 rounded-lg items-center mt-8"
        >
          <Text className="text-white font-semibold text-base">
            {loading ? "Salvando..." : "Salvar Perfil"}
          </Text>
        </Pressable>

        <Text className="text-xs text-muted text-center mt-4">
          * Campos obrigatórios
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}
