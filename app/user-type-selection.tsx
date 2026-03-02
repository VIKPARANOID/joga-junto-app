import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import * as Haptics from "expo-haptics";

export default function UserTypeSelectionScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<"athlete" | "club" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createAthleteMutation = trpc.userType.createAthlete.useMutation();
  const createClubMutation = trpc.userType.createClub.useMutation();

  const handleSelectAthlete = async () => {
    try {
      setIsLoading(true);
      setSelectedType("athlete");
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      await createAthleteMutation.mutateAsync({});

      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error creating athlete profile:", error);
      setSelectedType(null);
      setIsLoading(false);
    }
  };

  const handleSelectClub = async () => {
    try {
      setIsLoading(true);
      setSelectedType("club");
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      await createClubMutation.mutateAsync({
        clubName: "Meu Clube",
      });

      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error creating club profile:", error);
      setSelectedType(null);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color="#0A7EA4" />
        <Text className="mt-4 text-foreground">Criando seu perfil...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6 justify-center gap-8">
      <View className="gap-2 mb-4">
        <Text className="text-3xl font-bold text-foreground">Qual é seu perfil?</Text>
        <Text className="text-base text-muted">Escolha como você quer usar o Joga Junto</Text>
      </View>

      {/* Athlete Option */}
      <TouchableOpacity
        onPress={handleSelectAthlete}
        disabled={isLoading}
        className="bg-surface border border-border rounded-2xl p-6 gap-4 active:opacity-80"
      >
        <View className="w-16 h-16 bg-primary rounded-full items-center justify-center">
          <Text className="text-3xl">⚽</Text>
        </View>
        <View className="gap-1">
          <Text className="text-xl font-semibold text-foreground">Atleta</Text>
          <Text className="text-sm text-muted leading-relaxed">
            Envie vídeos de seus treinos e receba análise de desempenho com KPIs em tempo real
          </Text>
        </View>
        <View className="flex-row gap-2 mt-2">
          <View className="bg-primary px-3 py-1 rounded-full">
            <Text className="text-xs text-white font-semibold">Upload de vídeo</Text>
          </View>
          <View className="bg-primary px-3 py-1 rounded-full">
            <Text className="text-xs text-white font-semibold">Análise IA</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Club Option */}
      <TouchableOpacity
        onPress={handleSelectClub}
        disabled={isLoading}
        className="bg-surface border border-border rounded-2xl p-6 gap-4 active:opacity-80"
      >
        <View className="w-16 h-16 bg-primary rounded-full items-center justify-center">
          <Text className="text-3xl">🏟️</Text>
        </View>
        <View className="gap-1">
          <Text className="text-xl font-semibold text-foreground">Clube / Olheiro</Text>
          <Text className="text-sm text-muted leading-relaxed">
            Acompanhe atletas, veja rankings e análises de desempenho de jogadores de base
          </Text>
        </View>
        <View className="flex-row gap-2 mt-2">
          <View className="bg-primary px-3 py-1 rounded-full">
            <Text className="text-xs text-white font-semibold">Feed de atletas</Text>
          </View>
          <View className="bg-primary px-3 py-1 rounded-full">
            <Text className="text-xs text-white font-semibold">Ranking</Text>
          </View>
        </View>
      </TouchableOpacity>
    </ScreenContainer>
  );
}
