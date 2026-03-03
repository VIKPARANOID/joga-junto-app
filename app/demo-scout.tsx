import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { mockAthletes, getLevelBadge } from "@/lib/mock-data";
import { useState } from "react";

export default function DemoScoutScreen() {
  const colors = useColors();
  const router = useRouter();
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const filteredAthletes = selectedPosition
    ? mockAthletes.filter((a) => a.position === selectedPosition)
    : mockAthletes;

  const positions = ["Todos", "Meia", "Atacante", "Lateral"];

  const renderAthleteCard = ({ item }: { item: (typeof mockAthletes)[0] }) => (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
        },
      ]}
    >
      <View className="gap-3">
        {/* Header */}
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl">{item.avatar}</Text>
              <View>
                <Text className="text-lg font-bold text-foreground">
                  {item.name}
                </Text>
                <Text className="text-sm text-muted">{item.position}</Text>
              </View>
            </View>
          </View>
          <View
            className="px-3 py-1 rounded-full"
            style={{
              backgroundColor:
                item.level === "Ouro"
                  ? colors.warning
                  : item.level === "Prata"
                    ? colors.primary
                    : colors.success,
            }}
          >
            <Text className="text-xs font-bold text-white">
              {getLevelBadge(item.level)} {item.level}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row justify-between gap-2">
          <StatBadge label="Vel." value={`${item.velocity}`} />
          <StatBadge label="Agil." value={`${item.agility}`} />
          <StatBadge label="Int." value={`${item.intensity}`} />
          <StatBadge label="Pass." value={`${item.passAccuracy}%`} />
        </View>

        {/* Age */}
        <Text className="text-xs text-muted">
          Idade: {item.age} anos | Altura: {item.height}cm
        </Text>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 pb-4">
          <Pressable onPress={handleBack} className="p-2">
            <Text className="text-2xl">←</Text>
          </Pressable>
          <Text className="text-2xl font-bold text-foreground">
            Demo do Olheiro
          </Text>
          <View className="w-8" />
        </View>

        {/* Filters */}
        <View className="px-6 pb-4 gap-3">
          <Text className="text-sm font-semibold text-foreground">
            🔍 Filtrar por Posição
          </Text>
          <View className="flex-row gap-2 flex-wrap">
            {positions.map((pos) => (
              <FilterChip
                key={pos}
                label={pos}
                active={selectedPosition === null ? pos === "Todos" : selectedPosition === pos}
                color={colors.primary}
                onPress={() => setSelectedPosition(pos === "Todos" ? null : pos)}
              />
            ))}
          </View>
        </View>

        {/* Athletes List */}
        <View className="flex-1 px-6">
          <Text className="text-sm font-semibold text-foreground mb-3">
            👥 Atletas Disponíveis ({filteredAthletes.length})
          </Text>
          <FlatList
            data={filteredAthletes}
            renderItem={renderAthleteCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          />
        </View>

        {/* Info */}
        <View className="items-center gap-2 p-6 pt-4">
          <Text className="text-xs text-muted">
            ℹ️ Esta é uma demonstração com dados simulados
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

function StatBadge({ label, value }: { label: string; value: string }) {
  const colors = useColors();
  return (
    <View
      className="flex-1 items-center py-2 rounded-lg"
      style={{ backgroundColor: colors.primary + "20" }}
    >
      <Text className="text-xs text-muted">{label}</Text>
      <Text className="text-sm font-bold text-foreground mt-1">{value}</Text>
    </View>
  );
}

function FilterChip({
  label,
  active = false,
  color,
  onPress,
}: {
  label: string;
  active?: boolean;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.8 : 1,
          backgroundColor: active ? color : color + "20",
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 20,
        },
      ]}
    >
      <Text
        className="text-sm font-semibold"
        style={{ color: active ? "white" : color }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
