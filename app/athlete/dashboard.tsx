import { ScrollView, Text, View, Pressable, ActivityIndicator, RefreshControl } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { KPICard } from "@/components/athlete/kpi-card";
import { ProgressBar } from "@/components/athlete/progress-bar";
import { RadarChart } from "@/components/athlete/radar-chart";
import { LevelBadge } from "@/components/athlete/level-badge";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function AthleteDashboardScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  // Buscar vídeos do atleta
  const { data: videos, isLoading, refetch } = trpc.video.getAthleteVideos.useQuery();

  // Dados mockados para demonstração (em produção, viriam do backend)
  const lastVideo = videos?.[0];
  const mockKpis = {
    avgSpeedKmh: 26.5,
    maxSpeedKmh: 31.2,
    sprintsCount: 8,
    distanceCoveredM: 4200,
    agilityScore: 78,
    intensityScore: 82,
    passAccuracyPercent: 76,
  };

  const categoryAverage = 27.1;
  const speedDifference = ((mockKpis.maxSpeedKmh - categoryAverage) / categoryAverage) * 100;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="p-6"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-foreground">Seu Desempenho</Text>
          <Text className="text-muted mt-2">
            {lastVideo ? "Análise do seu último vídeo" : "Nenhum vídeo analisado ainda"}
          </Text>
        </View>

        {/* Se não houver vídeos */}
        {!lastVideo && (
          <View className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8 items-center">
            <Text className="text-4xl mb-3">📹</Text>
            <Text className="text-lg font-semibold text-amber-900 text-center mb-2">
              Comece Gravando um Vídeo
            </Text>
            <Text className="text-sm text-amber-800 text-center">
              Vá para a aba "Upload" para gravar seu primeiro vídeo de teste e receber análise de desempenho.
            </Text>
          </View>
        )}

        {/* Badge de Nível */}
        {lastVideo && (
          <View className="items-center mb-8">
            <LevelBadge maxSpeedKmh={mockKpis.maxSpeedKmh} />
          </View>
        )}

        {/* Comparativo com Categoria */}
        {lastVideo && (
          <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <Text className="text-sm font-semibold text-blue-900 mb-2">📊 Seu Desempenho</Text>
            <Text className="text-xs text-blue-800 leading-relaxed">
              Você foi {speedDifference > 0 ? "+" : ""}{speedDifference.toFixed(1)}% {speedDifference > 0 ? "mais rápido" : "mais lento"} que a média da sua categoria (Sub-17).
            </Text>
            <Text className="text-xs text-blue-800 mt-2">
              Média da categoria: {categoryAverage.toFixed(1)} km/h
            </Text>
          </View>
        )}

        {/* KPIs Principais */}
        {lastVideo && (
          <View className="mb-8">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Métricas de Desempenho
            </Text>

            {/* Grid 2x2 */}
            <View className="gap-4">
              {/* Linha 1 */}
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <KPICard
                    label="Velocidade Máxima"
                    value={mockKpis.maxSpeedKmh.toFixed(1)}
                    unit="km/h"
                    icon="⚡"
                    color="primary"
                    trend="up"
                    trendValue={5}
                  />
                </View>
                <View className="flex-1">
                  <KPICard
                    label="Velocidade Média"
                    value={mockKpis.avgSpeedKmh.toFixed(1)}
                    unit="km/h"
                    icon="🏃"
                    color="success"
                  />
                </View>
              </View>

              {/* Linha 2 */}
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <KPICard
                    label="Sprints"
                    value={mockKpis.sprintsCount}
                    unit="acelerações"
                    icon="🚀"
                    color="warning"
                  />
                </View>
                <View className="flex-1">
                  <KPICard
                    label="Distância"
                    value={(mockKpis.distanceCoveredM / 1000).toFixed(2)}
                    unit="km"
                    icon="📍"
                    color="primary"
                  />
                </View>
              </View>

              {/* Linha 3 */}
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <KPICard
                    label="Agilidade"
                    value={mockKpis.agilityScore.toFixed(0)}
                    unit="/100"
                    icon="🔄"
                    color="success"
                  />
                </View>
                <View className="flex-1">
                  <KPICard
                    label="Intensidade"
                    value={mockKpis.intensityScore.toFixed(0)}
                    unit="/100"
                    icon="🔥"
                    color="warning"
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Gráfico Radar */}
        {lastVideo && (
          <View className="bg-white border border-border rounded-lg p-6 mb-8">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Análise Completa
            </Text>
            <RadarChart
              data={[
                { label: "Velocidade", value: mockKpis.maxSpeedKmh, max: 40 },
                { label: "Agilidade", value: mockKpis.agilityScore, max: 100 },
                { label: "Intensidade", value: mockKpis.intensityScore, max: 100 },
              ]}
              size={240}
            />
          </View>
        )}

        {/* Barras de Progresso */}
        {lastVideo && (
          <View className="bg-white border border-border rounded-lg p-6 mb-8">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Progresso por Métrica
            </Text>
            <View className="gap-6">
              <ProgressBar
                label="Velocidade Máxima"
                value={mockKpis.maxSpeedKmh}
                max={40}
                color="primary"
              />
              <ProgressBar
                label="Agilidade"
                value={mockKpis.agilityScore}
                max={100}
                color="success"
              />
              <ProgressBar
                label="Intensidade"
                value={mockKpis.intensityScore}
                max={100}
                color="warning"
              />
              <ProgressBar
                label="Precisão de Passes"
                value={mockKpis.passAccuracyPercent}
                max={100}
                color="primary"
              />
            </View>
          </View>
        )}

        {/* Status do Vídeo */}
        {lastVideo && (
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
        )}

        {/* Dica de Gamificação */}
        {lastVideo && (
          <View className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-8">
            <Text className="text-sm font-semibold text-purple-900 mb-2">
              💡 Melhore Seu Score
            </Text>
            <Text className="text-xs text-purple-800">
              Grave novos vídeos para tentar melhorar sua velocidade máxima e agilidade. Quanto melhor seu desempenho, mais visível você fica para os olheiros.
            </Text>
          </View>
        )}

        {/* Botão para Novo Vídeo */}
        {lastVideo && (
          <Pressable className="bg-primary py-4 px-6 rounded-lg mb-8">
            <Text className="text-white font-semibold text-center text-lg">
              Gravar Novo Vídeo
            </Text>
          </Pressable>
        )}

        <View className="h-8" />
      </ScrollView>
    </ScreenContainer>
  );
}
