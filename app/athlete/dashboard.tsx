import { ScrollView, Text, View, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { LevelBadge } from "@/components/athlete/level-badge";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";

export default function AthleteDashboardScreen() {
  const { user } = useAuth();
  const { data: videos } = trpc.video.getAthleteVideos.useQuery();

  // Dados mockados para demonstração
  const mockKpis = {
    avgSpeedKmh: 26.5,
    maxSpeedKmh: 31.2,
    sprintsCount: 8,
    distanceCoveredM: 4200,
    agilityScore: 78,
    intensityScore: 82,
    passAccuracyPercent: 76,
  };

  const categoryAverage = 27.1; // Velocidade média da categoria
  const speedDifference = ((mockKpis.maxSpeedKmh - categoryAverage) / categoryAverage) * 100;

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-foreground">
            Seu Desempenho
          </Text>
          <Text className="text-muted mt-2">
            Análise do seu último vídeo
          </Text>
        </View>

        {/* Badge de Nível */}
        <View className="items-center mb-8">
          <LevelBadge maxSpeedKmh={mockKpis.maxSpeedKmh} />
        </View>

        {/* Comparativo com Categoria */}
        <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <Text className="text-sm font-semibold text-blue-900 mb-2">
            📊 Seu Desempenho na Categoria
          </Text>
          <Text className="text-xs text-blue-800 leading-relaxed">
            Você foi {speedDifference > 0 ? "+" : ""}{speedDifference.toFixed(1)}% {speedDifference > 0 ? "mais rápido" : "mais lento"} que a média da sua categoria (Sub-17).
          </Text>
          <Text className="text-xs text-blue-800 mt-2">
            Média da categoria: {categoryAverage.toFixed(1)} km/h
          </Text>
        </View>

        {/* KPIs Principais */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Métricas de Desempenho
          </Text>

          <View className="grid grid-cols-2 gap-4">
            {/* Velocidade Máxima */}
            <View className="bg-white border border-border rounded-lg p-4">
              <Text className="text-xs text-muted mb-2">Velocidade Máxima</Text>
              <Text className="text-2xl font-bold text-primary">
                {mockKpis.maxSpeedKmh.toFixed(1)}
              </Text>
              <Text className="text-xs text-muted">km/h</Text>
            </View>

            {/* Velocidade Média */}
            <View className="bg-white border border-border rounded-lg p-4">
              <Text className="text-xs text-muted mb-2">Velocidade Média</Text>
              <Text className="text-2xl font-bold text-primary">
                {mockKpis.avgSpeedKmh.toFixed(1)}
              </Text>
              <Text className="text-xs text-muted">km/h</Text>
            </View>

            {/* Sprints */}
            <View className="bg-white border border-border rounded-lg p-4">
              <Text className="text-xs text-muted mb-2">Sprints</Text>
              <Text className="text-2xl font-bold text-primary">
                {mockKpis.sprintsCount}
              </Text>
              <Text className="text-xs text-muted">acelerações</Text>
            </View>

            {/* Distância */}
            <View className="bg-white border border-border rounded-lg p-4">
              <Text className="text-xs text-muted mb-2">Distância</Text>
              <Text className="text-2xl font-bold text-primary">
                {(mockKpis.distanceCoveredM / 1000).toFixed(2)}
              </Text>
              <Text className="text-xs text-muted">km</Text>
            </View>

            {/* Agilidade */}
            <View className="bg-white border border-border rounded-lg p-4">
              <Text className="text-xs text-muted mb-2">Agilidade</Text>
              <Text className="text-2xl font-bold text-primary">
                {mockKpis.agilityScore.toFixed(0)}
              </Text>
              <Text className="text-xs text-muted">/100</Text>
            </View>

            {/* Intensidade */}
            <View className="bg-white border border-border rounded-lg p-4">
              <Text className="text-xs text-muted mb-2">Intensidade</Text>
              <Text className="text-2xl font-bold text-primary">
                {mockKpis.intensityScore.toFixed(0)}
              </Text>
              <Text className="text-xs text-muted">/100</Text>
            </View>
          </View>
        </View>

        {/* Status do Vídeo */}
        <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <View className="flex-row items-center gap-3">
            <Text className="text-2xl">🔓</Text>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-green-900">
                Disponível para Olheiros
              </Text>
              <Text className="text-xs text-green-800 mt-1">
                Seu vídeo foi analisado e está visível no dashboard dos clubes.
              </Text>
            </View>
          </View>
        </View>

        {/* Dica de Gamificação */}
        <View className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-8">
          <Text className="text-sm font-semibold text-purple-900 mb-2">
            💡 Melhore Seu Score
          </Text>
          <Text className="text-xs text-purple-800">
            Grave novos vídeos para tentar melhorar sua velocidade máxima e agilidade. Quanto melhor seu desempenho, mais visível você fica para os olheiros.
          </Text>
        </View>

        {/* Botão para Novo Vídeo */}
        <Pressable className="bg-primary py-4 px-6 rounded-lg mb-8">
          <Text className="text-white font-semibold text-center text-lg">
            Gravar Novo Vídeo
          </Text>
        </Pressable>

        <View className="h-8" />
      </ScrollView>
    </ScreenContainer>
  );
}
