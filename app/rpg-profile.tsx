import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  RPG_CLASSES,
  type PositionClass,
  getLevel,
  getXPProgress,
  EQUIPMENT_SHOP,
} from "@/lib/rpg-system";
import { useState } from "react";

export default function RPGProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const { class: playerClass } = useLocalSearchParams();
  const [currentXP, setCurrentXP] = useState(500);
  const [selectedTab, setSelectedTab] = useState<"profile" | "abilities" | "equipment">("profile");

  if (!playerClass || typeof playerClass !== "string") {
    return (
      <ScreenContainer className="bg-background">
        <View className="flex-1 items-center justify-center">
          <Text className="text-foreground">Classe não encontrada</Text>
        </View>
      </ScreenContainer>
    );
  }

  const rpgClass = RPG_CLASSES[playerClass as PositionClass];
  const level = getLevel(currentXP);
  const progress = getXPProgress(currentXP);

  const handleAddXP = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentXP((prev) => prev + 100);
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="p-6 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Pressable onPress={handleBack} className="p-2">
              <Text className="text-2xl">←</Text>
            </Pressable>
            <Text className="text-2xl font-bold text-foreground text-center flex-1">
              {rpgClass.emoji} Meu Perfil
            </Text>
            <View className="w-8" />
          </View>

          {/* Profile Card */}
          <View
            className="rounded-2xl p-6 gap-4 items-center"
            style={{ backgroundColor: rpgClass.color + "20" }}
          >
            <Text className="text-7xl">{rpgClass.emoji}</Text>
            <View className="items-center gap-2">
              <Text className="text-3xl font-bold text-foreground">
                {rpgClass.name}
              </Text>
              <Text className="text-lg font-bold" style={{ color: rpgClass.color }}>
                ⭐ Nível {level}
              </Text>
            </View>

            {/* XP Progress */}
            <View className="w-full gap-2 mt-4">
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">Experiência</Text>
                <Text className="text-xs font-bold text-foreground">
                  {progress.current} / {progress.next}
                </Text>
              </View>
              <View
                className="h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: colors.border }}
              >
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${progress.percentage}%`,
                    backgroundColor: rpgClass.color,
                  }}
                />
              </View>
              <Text className="text-xs text-muted text-center mt-2">
                {Math.round(progress.percentage)}% para o próximo nível
              </Text>
            </View>
          </View>

          {/* Tabs */}
          <View className="flex-row gap-2">
            {["profile", "abilities", "equipment"].map((tab) => (
              <Pressable
                key={tab}
                onPress={() => setSelectedTab(tab as any)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.8 : 1,
                    backgroundColor:
                      selectedTab === tab ? rpgClass.color : colors.surface,
                    flex: 1,
                  },
                ]}
                className="rounded-lg py-3 items-center"
              >
                <Text
                  className="font-bold text-sm"
                  style={{
                    color: selectedTab === tab ? "white" : colors.foreground,
                  }}
                >
                  {tab === "profile"
                    ? "📊 Atributos"
                    : tab === "abilities"
                      ? "✨ Habilidades"
                      : "🎽 Equipamento"}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Tab Content */}
          {selectedTab === "profile" && (
            <View className="gap-4">
              <Text className="text-lg font-bold text-foreground">
                Seus Atributos
              </Text>
              {Object.entries(rpgClass.baseAttributes).map(([attr, value]) => (
                <AttributeCard
                  key={attr}
                  name={getAttributeName(attr)}
                  value={value}
                  emoji={getAttributeEmoji(attr)}
                  color={getAttributeColor(value)}
                />
              ))}
            </View>
          )}

          {selectedTab === "abilities" && (
            <View className="gap-4">
              <Text className="text-lg font-bold text-foreground">
                Habilidades Especiais
              </Text>
              {rpgClass.specialAbilities.map((ability) => (
                <View
                  key={ability.id}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: colors.surface }}
                >
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-2xl">{ability.emoji}</Text>
                        <Text className="text-lg font-bold text-foreground">
                          {ability.name}
                        </Text>
                      </View>
                      <Text className="text-xs text-muted mt-2">
                        {ability.description}
                      </Text>
                      <Text className="text-xs text-muted mt-2">
                        ⏱️ Recarga: {ability.cooldown}s
                      </Text>
                    </View>
                    <View
                      className="px-3 py-1 rounded-full"
                      style={{ backgroundColor: rpgClass.color }}
                    >
                      <Text className="text-xs font-bold text-white">
                        {ability.xpRequired === 0 ? "Desbloqueado" : `${ability.xpRequired} XP`}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {selectedTab === "equipment" && (
            <View className="gap-4">
              <Text className="text-lg font-bold text-foreground">
                Loja de Equipamentos
              </Text>
              {EQUIPMENT_SHOP.map((item) => (
                <EquipmentCard key={item.id} equipment={item} />
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View className="gap-3 mt-4">
            <Pressable
              onPress={handleAddXP}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  backgroundColor: rpgClass.color,
                },
              ]}
              className="rounded-lg py-4 items-center"
            >
              <Text className="text-white font-bold text-lg">
                📹 Enviar Vídeo (+100 XP)
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/avatar-customization")}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  backgroundColor: colors.primary,
                },
              ]}
              className="rounded-lg py-3 items-center"
            >
              <Text className="text-white font-bold">
                🎨 Customizar Avatar
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/class-selection")}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  backgroundColor: colors.surface,
                },
              ]}
              className="rounded-lg py-3 items-center border border-border"
            >
              <Text className="text-foreground font-bold">
                ⚽ Mudar de Classe
              </Text>
            </Pressable>
          </View>

          {/* Info */}
          <View className="items-center gap-2 py-4">
            <Text className="text-xs text-muted text-center">
              ℹ️ Ganhe XP enviando vídeos e desbloqueie novas habilidades
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function AttributeCard({
  name,
  value,
  emoji,
  color,
}: {
  name: string;
  value: number;
  emoji: string;
  color: string;
}) {
  const colors = useColors();
  const percentage = (value / 100) * 100;

  return (
    <View
      className="p-4 rounded-lg"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <Text className="text-2xl">{emoji}</Text>
          <Text className="text-sm font-bold text-foreground">{name}</Text>
        </View>
        <Text className="text-lg font-bold" style={{ color }}>
          {value}
        </Text>
      </View>
      <View
        className="h-3 rounded-full overflow-hidden"
        style={{ backgroundColor: colors.border }}
      >
        <View
          className="h-full rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}

function EquipmentCard({
  equipment,
}: {
  equipment: (typeof EQUIPMENT_SHOP)[0];
}) {
  const colors = useColors();

  const rarityColors: Record<string, string> = {
    common: "#6B7280",
    rare: "#3B82F6",
    epic: "#8B5CF6",
    legendary: "#F59E0B",
  };

  return (
    <View
      className="p-4 rounded-lg flex-row items-center justify-between"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-row items-center gap-3 flex-1">
        <Text className="text-3xl">{equipment.emoji}</Text>
        <View className="flex-1">
          <Text className="text-sm font-bold text-foreground">
            {equipment.name}
          </Text>
          <Text className="text-xs text-muted mt-1">
            +{equipment.bonus.value} {getAttributeName(equipment.bonus.attribute)}
          </Text>
        </View>
      </View>
      <View
        className="px-3 py-1 rounded-full"
        style={{ backgroundColor: rarityColors[equipment.rarity] }}
      >
        <Text className="text-xs font-bold text-white">
          {getRarityName(equipment.rarity)}
        </Text>
      </View>
    </View>
  );
}

function getAttributeName(attr: string): string {
  const names: Record<string, string> = {
    strength: "Força",
    agility: "Agilidade",
    intelligence: "Inteligência",
    defense: "Defesa",
    stamina: "Resistência",
    speed: "Velocidade",
  };
  return names[attr] || attr;
}

function getAttributeEmoji(attr: string): string {
  const emojis: Record<string, string> = {
    strength: "💪",
    agility: "🤸",
    intelligence: "🧠",
    defense: "🛡️",
    stamina: "⚡",
    speed: "🏃",
  };
  return emojis[attr] || "📊";
}

function getAttributeColor(value: number): string {
  if (value >= 90) return "#EF4444";
  if (value >= 80) return "#F59E0B";
  if (value >= 70) return "#3B82F6";
  return "#10B981";
}

function getRarityName(rarity: string): string {
  const names: Record<string, string> = {
    common: "Comum",
    rare: "Raro",
    epic: "Épico",
    legendary: "Lendário",
  };
  return names[rarity] || rarity;
}
