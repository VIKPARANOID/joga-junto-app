import { ScrollView, Text, View, Pressable, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { PublicProfileHeader } from "@/components/athlete/public-profile-header";
import { ContactModal } from "@/components/athlete/contact-modal";
import { KPICard } from "@/components/athlete/kpi-card";
import { RadarChart } from "@/components/athlete/radar-chart";
import { ProgressBar } from "@/components/athlete/progress-bar";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function AthletePublicProfileScreen() {
  const { id } = useLocalSearchParams();
  const [contactModalVisible, setContactModalVisible] = useState(false);

  // Buscar dados públicos do atleta
  // TODO: Implementar endpoint tRPC para buscar perfil público
  const isLoading = false;

  // Dados mockados para demonstração
  const mockAthlete = {
    id: id as string,
    name: "João Silva",
    age: 17,
    position: "Meia",
    height: 175,
    email: "joao@exemplo.com",
    phone: "+55 11 99999-9999",
  };

  const mockKpis = {
    avgSpeedKmh: 26.5,
    maxSpeedKmh: 31.2,
    sprintsCount: 8,
    distanceCoveredM: 4200,
    agilityScore: 78,
    intensityScore: 82,
    passAccuracyPercent: 76,
  };

  const mockVideos = [
    {
      id: "1",
      date: "2026-03-02",
      maxSpeedKmh: 31.2,
      agilityScore: 78,
      intensityScore: 82,
      duration: 25,
    },
    {
      id: "2",
      date: "2026-02-28",
      maxSpeedKmh: 29.5,
      agilityScore: 75,
      intensityScore: 80,
      duration: 22,
    },
    {
      id: "3",
      date: "2026-02-25",
      maxSpeedKmh: 28.1,
      agilityScore: 72,
      intensityScore: 78,
      duration: 20,
    },
  ];

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ScreenContainer>
    );
  }

  const profileUrl = `https://jogajunto.app/athlete/${mockAthlete.id}`;

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header com Gradient */}
        <PublicProfileHeader
          athleteName={mockAthlete.name}
          age={mockAthlete.age}
          position={mockAthlete.position}
          height={mockAthlete.height}
          maxSpeedKmh={mockKpis.maxSpeedKmh}
          profileUrl={profileUrl}
        />

        {/* Conteúdo Principal */}
        <View className="p-6 gap-8">
          {/* KPIs Principais */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-4">
              Métricas de Desempenho
            </Text>

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

          {/* Gráfico Radar */}
          <View className="bg-white border border-border rounded-lg p-6">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Análise Completa
            </Text>
            <RadarChart
              data={[
                { label: "Velocidade", value: mockKpis.maxSpeedKmh, max: 40 },
                { label: "Agilidade", value: mockKpis.agilityScore, max: 100 },
                { label: "Intensidade", value: mockKpis.intensityScore, max: 100 },
              ]}
              size={220}
            />
          </View>

          {/* Barras de Progresso */}
          <View className="bg-white border border-border rounded-lg p-6">
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
            </View>
          </View>

          {/* Histórico de Vídeos */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-4">
              Últimos Vídeos Analisados
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
              {mockVideos.map((video) => (
                <View
                  key={video.id}
                  className="bg-white border border-border rounded-lg p-4 min-w-[160px]"
                >
                  <Text className="text-xs text-muted mb-2">
                    {new Date(video.date).toLocaleDateString("pt-BR")}
                  </Text>
                  <View className="mb-2">
                    <Text className="text-xs text-muted">Velocidade</Text>
                    <Text className="text-lg font-bold text-primary">
                      {video.maxSpeedKmh.toFixed(1)} km/h
                    </Text>
                  </View>
                  <View className="mb-2">
                    <Text className="text-xs text-muted">Agilidade</Text>
                    <Text className="text-sm font-semibold text-foreground">
                      {video.agilityScore}/100
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs text-muted">Duração</Text>
                    <Text className="text-sm font-semibold text-foreground">
                      {video.duration}s
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Botão de Contato */}
          <Pressable
            onPress={() => setContactModalVisible(true)}
            className="bg-primary py-4 px-6 rounded-lg flex-row items-center justify-center gap-2"
          >
            <Text className="text-lg">📞</Text>
            <Text className="text-white font-semibold text-lg">Entrar em Contato</Text>
          </Pressable>

          {/* Info Footer */}
          <View className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Text className="text-xs text-blue-900 text-center">
              Este é um perfil público. Os dados exibidos são baseados na análise de vídeos enviados pelo atleta.
            </Text>
          </View>

          <View className="h-8" />
        </View>
      </ScrollView>

      {/* Modal de Contato */}
      <ContactModal
        visible={contactModalVisible}
        athleteName={mockAthlete.name}
        athletePhone={mockAthlete.phone}
        athleteEmail={mockAthlete.email}
        onClose={() => setContactModalVisible(false)}
      />
    </ScreenContainer>
  );
}
