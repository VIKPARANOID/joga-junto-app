import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import * as Haptics from "expo-haptics";
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { LoadingScreen } from "@/components/loading-spinner";

export default function UserTypeSelectionScreen() {
  const router = useRouter();
  const colors = useColors();
  const [selectedType, setSelectedType] = useState<"athlete" | "club" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAthleteMutation = trpc.userType.createAthlete.useMutation();
  const createClubMutation = trpc.userType.createClub.useMutation();

  const handleSelectAthlete = async () => {
    try {
      setIsLoading(true);
      setSelectedType("athlete");
      setError(null);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      await createAthleteMutation.mutateAsync({});
      router.replace("/athlete/profile");
    } catch (error: any) {
      console.error("Error creating athlete profile:", error);
      setError(error.message || "Erro ao criar perfil de atleta");
      setSelectedType(null);
      setIsLoading(false);
    }
  };

  const handleSelectClub = async () => {
    try {
      setIsLoading(true);
      setSelectedType("club");
      setError(null);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      await createClubMutation.mutateAsync({
        clubName: "Meu Clube",
      });

      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Error creating club profile:", error);
      setError(error.message || "Erro ao criar perfil de clube");
      setSelectedType(null);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <LoadingScreen message="Criando seu perfil..." subMessage="Aguarde um momento" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center gap-8">
          {/* Header */}
          <View className="gap-2 mb-4">
            <Text className="text-4xl font-bold text-foreground">Qual é seu perfil?</Text>
            <Text className="text-base text-muted leading-relaxed">
              Escolha como você quer usar o Joga Junto
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View 
              className="p-4 rounded-lg border-l-4"
              style={{ 
                backgroundColor: colors.error + "20",
                borderLeftColor: colors.error 
              }}
            >
              <Text className="text-sm text-error font-semibold">{error}</Text>
            </View>
          )}

          {/* Athlete Option */}
          <TouchableOpacity
            onPress={handleSelectAthlete}
            disabled={isLoading}
            className="rounded-2xl p-6 gap-4 border active:opacity-80"
            activeOpacity={0.8}
          >
            <View 
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-3xl">⚽</Text>
            </View>
            <View className="gap-2">
              <Text className="text-2xl font-bold text-foreground">Atleta</Text>
              <Text className="text-sm text-muted leading-relaxed">
                Envie vídeos de seus treinos e receba análise de desempenho com KPIs em tempo real
              </Text>
            </View>
            <View className="flex-row gap-2 mt-2">
              <Text className="text-xs bg-primary px-3 py-1 rounded-full text-white font-semibold">
                Upload de vídeo
              </Text>
              <Text className="text-xs bg-primary px-3 py-1 rounded-full text-white font-semibold">
                Análise IA
              </Text>
            </View>
          </TouchableOpacity>

          {/* Club Option */}
          <TouchableOpacity
            onPress={handleSelectClub}
            disabled={isLoading}
            className="rounded-2xl p-6 gap-4 border active:opacity-80"
            activeOpacity={0.8}
          >
            <View 
            className="w-16 h-16 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-3xl">👁️</Text>
          </View>
            <View className="gap-2">
              <Text className="text-2xl font-bold text-foreground">Clube / Olheiro</Text>
              <Text className="text-sm text-muted leading-relaxed">
                Descubra talentos com dados reais de desempenho e crie seu ranking de atletas
              </Text>
            </View>
            <View className="flex-row gap-2 mt-2">
              <Text className="text-xs px-3 py-1 rounded-full text-white font-semibold" style={{ backgroundColor: colors.primary }}>
                Dashboard
              </Text>
              <Text className="text-xs px-3 py-1 rounded-full text-white font-semibold" style={{ backgroundColor: colors.primary }}>
                Ranking
              </Text>
            </View>
          </TouchableOpacity>

          {/* Footer */}
          <View className="items-center gap-2 mt-4">
            <Text className="text-xs text-muted">
              Você pode mudar seu tipo de perfil depois
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
