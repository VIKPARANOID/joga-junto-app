import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { mockAthletes, mockVideoHistory, getLevelBadge } from "@/lib/mock-data";

export default function DemoAthleteScreen() {
  const colors = useColors();
  const router = useRouter();
  const athleteData = mockAthletes[0]; // João Silva

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const renderVideoCard = ({ item }: { item: (typeof mockVideoHistory)[0] }) => (
    <View
      className="p-4 rounded-lg mb-2"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-sm font-semibold text-foreground">
            📹 {item.date}
          </Text>
          <Text className="text-xs text-muted mt-1">Duração: {item.duration}s</Text>
        </View>
        <View className="flex-row gap-2">
          <StatTag label="Vel." value={`${item.velocity}`} color={colors.primary} />
          <StatTag label="Agil." value={`${item.agility}`} color={colors.success} />
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="p-6 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Pressable onPress={handleBack} className="p-2">
              <Text className="text-2xl">←</Text>
            </Pressable>
            <Text className="text-2xl font-bold text-foreground">
              Demo do Atleta
            </Text>
            <View className="w-8" />
          </View>

          {/* Profile Card */}
          <View
            className="rounded-2xl p-6 gap-4"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="items-center gap-3">
              <Text className="text-6xl">{athleteData.avatar}</Text>
              <Text className="text-2xl font-bold text-foreground">
                {athleteData.name}
              </Text>
              <View className="flex-row gap-4 justify-center">
                <View className="items-center">
                  <Text className="text-xs text-muted">Posição</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {athleteData.position}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-xs text-muted">Idade</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {athleteData.age}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-xs text-muted">Altura</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {athleteData.height}cm
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Level Badge */}
          <View className="items-center">
            <View
              className="px-6 py-3 rounded-full"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-white font-bold">
                {getLevelBadge(athleteData.level)} Nível {athleteData.level}
              </Text>
            </View>
          </View>

          {/* KPIs Grid */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">
              📊 Últimas Métricas
            </Text>

            <View className="gap-3">
              <KPICard
                icon="⚡"
                label="Velocidade Máxima"
                value={`${athleteData.velocity} km/h`}
                color={colors.primary}
              />
              <KPICard
                icon="🎯"
                label="Agilidade"
                value={`${athleteData.agility}/100`}
                color={colors.success}
              />
              <KPICard
                icon="💪"
                label="Intensidade"
                value={`${athleteData.intensity}/100`}
                color={colors.warning}
              />
              <KPICard
                icon="🏃"
                label="Sprints Detectados"
                value={`${athleteData.sprints}`}
                color={colors.error}
              />
              <KPICard
                icon="📏"
                label="Distância Percorrida"
                value={`${athleteData.distance}m`}
                color={colors.primary}
              />
              <KPICard
                icon="🎯"
                label="Precisão de Passes"
                value={`${athleteData.passAccuracy}%`}
                color={colors.success}
              />
            </View>
          </View>

          {/* Video History */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">
              📹 Histórico de Vídeos
            </Text>
            <FlatList
              data={mockVideoHistory}
              renderItem={renderVideoCard}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </View>

          {/* Upload Section */}
          <View
            className="rounded-2xl p-6 gap-4 items-center"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-4xl">📹</Text>
            <Text className="text-lg font-bold text-foreground text-center">
              Envie seu vídeo
            </Text>
            <Text className="text-sm text-muted text-center">
              Grave um vídeo de até 30 segundos e receba análise automática de
              desempenho
            </Text>
            <Pressable
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  backgroundColor: colors.primary,
                },
              ]}
              className="rounded-lg px-8 py-3 w-full items-center mt-2"
            >
              <Text className="text-white font-bold">Selecionar Vídeo</Text>
            </Pressable>
          </View>

          {/* Info */}
          <View className="items-center gap-2 py-4">
            <Text className="text-xs text-muted">
              ℹ️ Esta é uma demonstração com dados simulados
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function KPICard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View
      className="flex-row items-center justify-between p-4 rounded-lg"
      style={{
        backgroundColor: color + "15",
        borderLeftColor: color,
        borderLeftWidth: 3,
      }}
    >
      <View className="flex-row items-center gap-3 flex-1">
        <Text className="text-2xl">{icon}</Text>
        <View>
          <Text className="text-xs text-muted">{label}</Text>
          <Text className="text-lg font-bold text-foreground mt-1">
            {value}
          </Text>
        </View>
      </View>
    </View>
  );
}

function StatTag({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View
      className="px-2 py-1 rounded"
      style={{ backgroundColor: color + "20" }}
    >
      <Text className="text-xs font-semibold" style={{ color }}>
        {label}: {value}
      </Text>
    </View>
  );
}
