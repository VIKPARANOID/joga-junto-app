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
    // Validações
    if (!height || !weight || !position || !preferredFoot) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (heightNum < 140 || heightNum > 220) {
      Alert.alert("Erro", "Altura deve estar entre 140 e 220 cm");
      return;
    }

    if (weightNum < 40 || weightNum > 150) {
      Alert.alert("Erro", "Peso deve estar entre 40 e 150 kg");
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
      Alert.alert("Erro", "Falha ao atualizar perfil");
      console.error(error);
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

          {/* Altura */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-foreground mb-2">
              Altura (cm) *
            </Text>
            <TextInput
              value={height}
              onChangeText={setHeight}
              placeholder="175"
              keyboardType="decimal-pad"
              className="border border-border rounded-lg px-4 py-3 text-foreground bg-white"
              placeholderTextColor="#999"
            />
            <Text className="text-xs text-muted mt-1">
              Essencial para calibração da IA
            </Text>
          </View>

          {/* Peso */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-foreground mb-2">
              Peso (kg)
            </Text>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              placeholder="75"
              keyboardType="decimal-pad"
              className="border border-border rounded-lg px-4 py-3 text-foreground bg-white"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Dados de Jogo */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Dados de Jogo
          </Text>

          {/* Posição */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-foreground mb-2">
              Posição *
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {positions.map((pos) => (
                <Pressable
                  key={pos}
                  onPress={() => setPosition(pos)}
                  className={`px-4 py-2 rounded-full border ${
                    position === pos
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={`font-medium ${
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
          <View className="mb-4">
            <Text className="text-sm font-medium text-foreground mb-2">
              Perna Dominante *
            </Text>
            <View className="flex-row gap-2">
              {feet.map((foot) => (
                <Pressable
                  key={foot}
                  onPress={() => setPreferredFoot(foot)}
                  className={`flex-1 px-4 py-3 rounded-lg border ${
                    preferredFoot === foot
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={`font-medium text-center ${
                      preferredFoot === foot ? "text-white" : "text-foreground"
                    }`}
                  >
                    {foot}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Info Box */}
        <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <Text className="text-sm text-blue-900 font-medium">
            💡 Por que esses dados importam?
          </Text>
          <Text className="text-xs text-blue-800 mt-2 leading-relaxed">
            A altura é essencial para converter pixels em metros. A posição e perna dominante ajudam a comparar seu desempenho com atletas similares.
          </Text>
        </View>

        {/* Botão Salvar */}
        <Pressable
          onPress={handleSaveProfile}
          disabled={loading}
          className={`py-4 px-6 rounded-lg ${
            loading ? "bg-gray-400" : "bg-primary"
          }`}
        >
          <Text className="text-white font-semibold text-center text-lg">
            {loading ? "Salvando..." : "Salvar Perfil"}
          </Text>
        </Pressable>

        {/* Espaço */}
        <View className="h-8" />
      </ScrollView>
    </ScreenContainer>
  );
}
