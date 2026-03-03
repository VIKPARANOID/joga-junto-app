import { ScrollView, Text, View, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();

  const handleAthleteDemo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/demo-athlete");
  };

  const handleScoutDemo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/demo-scout");
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center p-6 gap-8">
          {/* Logo & Header */}
          <View className="items-center gap-4">
            <Text className="text-6xl">⚽</Text>
            <Text className="text-4xl font-bold text-foreground text-center">
              Joga Junto
            </Text>
            <Text className="text-base text-muted text-center">
              Análise de desempenho de atletas com Inteligência Artificial
            </Text>
          </View>

          {/* Demo Cards */}
          <View className="gap-4">
            {/* Athlete Demo */}
            <Pressable
              onPress={handleAthleteDemo}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  backgroundColor: colors.primary,
                },
              ]}
              className="rounded-2xl p-6 gap-3"
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-4xl">🏃</Text>
                <View className="flex-1">
                  <Text className="text-xl font-bold text-white">
                    Demo do Atleta
                  </Text>
                  <Text className="text-sm text-white opacity-80">
                    Envie vídeos e receba análise
                  </Text>
                </View>
              </View>
              <Text className="text-xs text-white opacity-70 mt-2">
                Veja como funciona o upload de vídeo e análise de KPIs
              </Text>
            </Pressable>

            {/* Scout Demo */}
            <Pressable
              onPress={handleScoutDemo}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  backgroundColor: colors.success,
                },
              ]}
              className="rounded-2xl p-6 gap-3"
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-4xl">👁️</Text>
                <View className="flex-1">
                  <Text className="text-xl font-bold text-white">
                    Demo do Olheiro
                  </Text>
                  <Text className="text-sm text-white opacity-80">
                    Descubra talentos com dados
                  </Text>
                </View>
              </View>
              <Text className="text-xs text-white opacity-70 mt-2">
                Explore o dashboard com filtros e ranking de atletas
              </Text>
            </Pressable>
          </View>

          {/* Features */}
          <View className="gap-4 mt-4">
            <Text className="text-lg font-bold text-foreground">
              ✨ Funcionalidades
            </Text>

            <View className="gap-3">
              <FeatureItem
                icon="📹"
                title="Upload de Vídeo"
                description="Grave treinos e receba análise automática"
                color={colors.primary}
              />
              <FeatureItem
                icon="📊"
                title="KPIs de Desempenho"
                description="Velocidade, agilidade, intensidade e mais"
                color={colors.success}
              />
              <FeatureItem
                icon="🔍"
                title="Dashboard de Olheiros"
                description="Filtros avançados e ranking de atletas"
                color={colors.warning}
              />
              <FeatureItem
                icon="🤖"
                title="IA & Visão Computacional"
                description="MediaPipe para análise de movimento"
                color={colors.error}
              />
            </View>
          </View>

          {/* Footer */}
          <View className="items-center gap-2 mt-8">
            <Text className="text-xs text-muted">
              MVP - Versão de Demonstração
            </Text>
            <Text className="text-xs text-muted">
              Todos os dados são simulados
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function FeatureItem({
  icon,
  title,
  description,
  color,
}: {
  icon: string;
  title: string;
  description: string;
  color: string;
}) {
  const colors = useColors();
  return (
    <View
      className="flex-row gap-3 p-3 rounded-lg"
      style={{ backgroundColor: color + "20", borderLeftColor: color, borderLeftWidth: 3 }}
    >
      <Text className="text-2xl">{icon}</Text>
      <View className="flex-1">
        <Text className="font-semibold text-foreground text-sm">{title}</Text>
        <Text className="text-xs text-muted mt-1">{description}</Text>
      </View>
    </View>
  );
}
