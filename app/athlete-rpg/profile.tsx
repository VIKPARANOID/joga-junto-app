import { ScrollView, Text, View, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAthleteRPG } from "@/hooks/use-athlete-rpg";
import { PlayerAvatar2D } from "@/components/player-avatar-2d";
import * as Haptics from "expo-haptics";
import { useState } from "react";

export default function AthleteRPGProfileScreen() {
  const colors = useColors();
  const { athleteClass, athleteLevel, athleteStats, athleteAbilities, athleteEquipment } = useAthleteRPG();
  const [selectedTab, setSelectedTab] = useState<"stats" | "abilities" | "equipment">("stats");

  if (!athleteClass || !athleteStats) {
    return (
      <ScreenContainer className="bg-background items-center justify-center">
        <Text className="text-foreground">Carregando perfil...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="p-6 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              ⚽ Perfil do Atleta
            </Text>
            <Text className="text-sm text-muted">
              Dados integrados com RPG
            </Text>
          </View>

          {/* Avatar 2D */}
          <View className="items-center gap-3">
            <PlayerAvatar2D
              class={athleteClass}
              level={athleteLevel}
              size="large"
              equippedItems={athleteEquipment}
            />
            <Text className="text-lg font-bold text-foreground">
              Nível {athleteLevel}
            </Text>
          </View>

          {/* Tab Navigation */}
          <View className="flex-row gap-2">
            {(["stats", "abilities", "equipment"] as const).map((tab) => (
              <Pressable
                key={tab}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedTab(tab);
                }}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.8 : 1,
                    backgroundColor:
                      selectedTab === tab ? colors.primary : colors.surface,
                    flex: 1,
                  },
                ]}
                className="rounded-lg py-3 items-center"
              >
                <Text
                  className="text-sm font-bold"
                  style={{
                    color: selectedTab === tab ? "white" : colors.foreground,
                  }}
                >
                  {tab === "stats"
                    ? "📊 Atributos"
                    : tab === "abilities"
                      ? "⚡ Habilidades"
                      : "🎽 Equipamento"}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Content */}
          {selectedTab === "stats" && (
            <View className="gap-4">
              <Text className="text-lg font-bold text-foreground">
                📊 Atributos (Nível {athleteLevel})
              </Text>

              <StatBar
                label="Força"
                value={athleteStats.strength}
                max={150}
                color="#EF4444"
              />
              <StatBar
                label="Agilidade"
                value={athleteStats.agility}
                max={150}
                color="#8B5CF6"
              />
              <StatBar
                label="Inteligência"
                value={athleteStats.intelligence}
                max={150}
                color="#3B82F6"
              />
              <StatBar
                label="Defesa"
                value={athleteStats.defense}
                max={150}
                color="#10B981"
              />
              <StatBar
                label="Resistência"
                value={athleteStats.stamina}
                max={150}
                color="#F59E0B"
              />
              <StatBar
                label="Velocidade"
                value={athleteStats.speed}
                max={150}
                color="#EC4899"
              />
            </View>
          )}

          {selectedTab === "abilities" && (
            <View className="gap-3">
              <Text className="text-lg font-bold text-foreground">
                ⚡ Habilidades Desbloqueadas ({athleteAbilities.length})
              </Text>

              {athleteAbilities.length === 0 ? (
                <View className="p-4 rounded-lg bg-surface items-center">
                  <Text className="text-sm text-muted">
                    Suba de nível para desbloquear habilidades
                  </Text>
                </View>
              ) : (
                athleteAbilities.map((ability) => (
                  <View
                    key={ability.id}
                    className="p-4 rounded-lg bg-surface gap-2"
                  >
                    <View className="flex-row items-center gap-2">
                      <Text className="text-2xl">{ability.emoji}</Text>
                      <View className="flex-1">
                        <Text className="text-sm font-bold text-foreground">
                          {ability.name}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-xs text-muted">
                      {ability.description}
                    </Text>
                    <Text className="text-xs text-primary font-bold">
                      Recarga: {ability.cooldown}s
                    </Text>
                  </View>
                ))
              )}
            </View>
          )}

          {selectedTab === "equipment" && (
            <View className="gap-3">
              <Text className="text-lg font-bold text-foreground">
                🎽 Equipamento Equipado
              </Text>

              <EquipmentSlot
                label="Chuteiras"
                emoji="👟"
                equipped={athleteEquipment.shoes}
              />
              <EquipmentSlot
                label="Uniforme"
                emoji="🎽"
                equipped={athleteEquipment.uniforms}
              />
              <EquipmentSlot
                label="Aura"
                emoji="✨"
                equipped={athleteEquipment.auras}
              />
              <EquipmentSlot
                label="Acessório"
                emoji="💎"
                equipped={athleteEquipment.accessories}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function StatBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-bold text-foreground">{label}</Text>
        <Text className="text-sm font-bold text-foreground">{value}</Text>
      </View>
      <View className="h-3 bg-surface rounded-full overflow-hidden">
        <View
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            height: "100%",
          }}
        />
      </View>
    </View>
  );
}

function EquipmentSlot({
  label,
  emoji,
  equipped,
}: {
  label: string;
  emoji: string;
  equipped?: string;
}) {
  const colors = useColors();

  return (
    <View
      className="p-4 rounded-lg flex-row items-center gap-3"
      style={{ backgroundColor: colors.surface }}
    >
      <Text className="text-2xl">{emoji}</Text>
      <View className="flex-1">
        <Text className="text-sm font-bold text-foreground">{label}</Text>
        <Text className="text-xs text-muted">
          {equipped && equipped !== "none" ? equipped : "Nenhum equipado"}
        </Text>
      </View>
    </View>
  );
}
