import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { useState } from "react";

interface LeaderboardPlayer {
  rank: number;
  id: string;
  name: string;
  class: string;
  level: number;
  totalXP: number;
  avatar: string;
  achievements: number;
  isCurrentPlayer?: boolean;
}

const MOCK_LEADERBOARD: LeaderboardPlayer[] = [
  {
    rank: 1,
    id: "player1",
    name: "Cristiano",
    class: "Atacante",
    level: 25,
    totalXP: 15000,
    avatar: "⚔️",
    achievements: 12,
  },
  {
    rank: 2,
    id: "player2",
    name: "Messi",
    class: "Meia",
    level: 24,
    totalXP: 14500,
    avatar: "🎭",
    achievements: 11,
  },
  {
    rank: 3,
    id: "player3",
    name: "Neymar",
    class: "Lateral",
    level: 23,
    totalXP: 14000,
    avatar: "🛡️",
    achievements: 10,
  },
  {
    rank: 4,
    id: "player4",
    name: "João Silva",
    class: "Atacante",
    level: 18,
    totalXP: 5000,
    avatar: "⚔️",
    achievements: 5,
    isCurrentPlayer: true,
  },
  {
    rank: 5,
    id: "player5",
    name: "Pedro Santos",
    class: "Goleiro",
    level: 16,
    totalXP: 4200,
    avatar: "🧤",
    achievements: 4,
  },
];

export default function LeaderboardScreen() {
  const colors = useColors();
  const [selectedFilter, setSelectedFilter] = useState<"all" | string>("all");

  const filteredPlayers =
    selectedFilter === "all"
      ? MOCK_LEADERBOARD
      : MOCK_LEADERBOARD.filter((p) => p.class === selectedFilter);

  const renderPlayerCard = ({ item }: { item: LeaderboardPlayer }) => (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.8 : 1,
          backgroundColor: item.isCurrentPlayer
            ? colors.primary + "20"
            : colors.surface,
          borderColor: item.isCurrentPlayer ? colors.primary : colors.border,
          borderWidth: item.isCurrentPlayer ? 2 : 1,
        },
      ]}
      className="rounded-xl p-4 mb-3 flex-row items-center gap-4"
    >
      {/* Rank Badge */}
      <View
        className="w-12 h-12 rounded-full items-center justify-center"
        style={{
          backgroundColor:
            item.rank === 1
              ? "#FFD700"
              : item.rank === 2
                ? "#C0C0C0"
                : item.rank === 3
                  ? "#CD7F32"
                  : colors.primary,
        }}
      >
        <Text className="text-lg font-bold text-white">
          {item.rank === 1 ? "🥇" : item.rank === 2 ? "🥈" : item.rank === 3 ? "🥉" : item.rank}
        </Text>
      </View>

      {/* Player Info */}
      <View className="flex-1 gap-1">
        <View className="flex-row items-center gap-2">
          <Text className="text-2xl">{item.avatar}</Text>
          <View className="flex-1">
            <Text className="text-sm font-bold text-foreground">
              {item.name}
              {item.isCurrentPlayer && (
                <Text className="text-xs text-primary"> (Você)</Text>
              )}
            </Text>
            <Text className="text-xs text-muted">{item.class}</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View className="items-end gap-1">
        <View className="flex-row items-center gap-1">
          <Text className="text-lg font-bold text-foreground">
            Nível {item.level}
          </Text>
          <Text className="text-lg">⭐</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Text className="text-xs text-muted">{item.achievements}</Text>
          <Text className="text-sm">🏆</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="p-6 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              🏆 Ranking Global
            </Text>
            <Text className="text-sm text-muted">
              Compita com outros atletas e suba no ranking
            </Text>
          </View>

          {/* Top 3 Podium */}
          <View className="gap-4">
            <Text className="text-lg font-bold text-foreground">
              🥇 Top 3 Atletas
            </Text>

            <View className="flex-row items-flex-end justify-center gap-2">
              {/* 2nd Place */}
              <PodiumCard
                player={MOCK_LEADERBOARD[1]}
                position={2}
                height={120}
              />

              {/* 1st Place */}
              <PodiumCard
                player={MOCK_LEADERBOARD[0]}
                position={1}
                height={160}
              />

              {/* 3rd Place */}
              <PodiumCard
                player={MOCK_LEADERBOARD[2]}
                position={3}
                height={80}
              />
            </View>
          </View>

          {/* Filter */}
          <View className="gap-3">
            <Text className="text-sm font-bold text-foreground">
              🔍 Filtrar por Classe
            </Text>
            <View className="flex-row gap-2 flex-wrap">
              <FilterButton
                label="Todos"
                active={selectedFilter === "all"}
                onPress={() => setSelectedFilter("all")}
              />
              {["Atacante", "Meia", "Lateral", "Goleiro"].map((pos) => (
                <FilterButton
                  key={pos}
                  label={pos === "Atacante" ? "⚔️" : pos === "Meia" ? "🎭" : pos === "Lateral" ? "🛡️" : "🧤"}
                  active={selectedFilter === pos}
                  onPress={() => setSelectedFilter(pos)}
                />
              ))}
            </View>
          </View>

          {/* Leaderboard List */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-foreground">
                📊 Ranking Completo
              </Text>
              <Text className="text-xs text-muted">
                {filteredPlayers.length} atletas
              </Text>
            </View>

            <FlatList
              data={filteredPlayers}
              renderItem={renderPlayerCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              nestedScrollEnabled={false}
            />
          </View>

          {/* Stats */}
          <View
            className="rounded-xl p-4 gap-3"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-sm font-bold text-foreground">
              📈 Suas Estatísticas
            </Text>

            <View className="gap-2">
              <StatRow label="Posição" value="#4" />
              <StatRow label="Nível" value="18" />
              <StatRow label="XP Total" value="5.000" />
              <StatRow label="Conquistas" value="5" />
            </View>
          </View>

          {/* Info */}
          <View className="items-center gap-2 py-4">
            <Text className="text-xs text-muted text-center">
              ℹ️ Ganhe XP enviando vídeos para subir no ranking
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function PodiumCard({
  player,
  position,
  height,
}: {
  player: LeaderboardPlayer;
  position: number;
  height: number;
}) {
  return (
    <View className="items-center gap-2 flex-1">
      {/* Medal */}
      <View className="items-center">
        <Text className="text-4xl">
          {position === 1 ? "🥇" : position === 2 ? "🥈" : "🥉"}
        </Text>
      </View>

      {/* Card */}
      <View
        className="rounded-t-xl p-3 items-center w-full"
        style={{
          backgroundColor:
            position === 1 ? "#FFD700" : position === 2 ? "#C0C0C0" : "#CD7F32",
          height,
        }}
      >
        <Text className="text-3xl mb-1">{player.avatar}</Text>
        <Text className="text-xs font-bold text-white text-center">
          {player.name}
        </Text>
        <Text className="text-xs text-white opacity-80">
          Nível {player.level}
        </Text>
      </View>
    </View>
  );
}

function FilterButton({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  const colors = useColors();

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.8 : 1,
          backgroundColor: active ? colors.primary : colors.surface,
        },
      ]}
      className="px-4 py-2 rounded-full border border-border"
    >
      <Text
        className="text-sm font-bold"
        style={{ color: active ? "white" : colors.foreground }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  const colors = useColors();

  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-xs text-muted">{label}</Text>
      <Text className="text-sm font-bold text-foreground">{value}</Text>
    </View>
  );
}
