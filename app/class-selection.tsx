import { ScrollView, Text, View, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { RPG_CLASSES, type PositionClass } from "@/lib/rpg-system";
import { useState } from "react";

export default function ClassSelectionScreen() {
  const colors = useColors();
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState<PositionClass | null>(null);

  const handleSelectClass = (classId: PositionClass) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedClass(classId);
  };

  const handleConfirm = () => {
    if (!selectedClass) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push({
      pathname: "/rpg-profile",
      params: { class: selectedClass },
    });
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
              ⚽ Escolha sua Classe
            </Text>
            <View className="w-8" />
          </View>

          {/* Subtitle */}
          <View className="items-center gap-2">
            <Text className="text-sm text-muted text-center">
              Cada classe tem atributos únicos e habilidades especiais
            </Text>
          </View>

          {/* Classes Grid */}
          <View className="gap-4">
            {Object.values(RPG_CLASSES).map((rpgClass) => (
              <ClassCard
                key={rpgClass.id}
                rpgClass={rpgClass}
                isSelected={selectedClass === rpgClass.id}
                onPress={() => handleSelectClass(rpgClass.id)}
              />
            ))}
          </View>

          {/* Selected Class Details */}
          {selectedClass && (
            <View
              className="rounded-2xl p-6 gap-4"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-lg font-bold text-foreground">
                📊 Atributos de {RPG_CLASSES[selectedClass].name}
              </Text>

              <View className="gap-3">
                {Object.entries(RPG_CLASSES[selectedClass].baseAttributes).map(
                  ([attr, value]) => (
                    <AttributeBar
                      key={attr}
                      name={getAttributeName(attr)}
                      value={value}
                      emoji={getAttributeEmoji(attr)}
                    />
                  ),
                )}
              </View>

              {/* Abilities */}
              <View className="gap-3 mt-4">
                <Text className="text-lg font-bold text-foreground">
                  ✨ Habilidades Especiais
                </Text>
                {RPG_CLASSES[selectedClass].specialAbilities.map((ability) => (
                  <View
                    key={ability.id}
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: colors.primary + "20" }}
                  >
                    <View className="flex-row items-start gap-2">
                      <Text className="text-2xl">{ability.emoji}</Text>
                      <View className="flex-1">
                        <Text className="font-bold text-foreground">
                          {ability.name}
                        </Text>
                        <Text className="text-xs text-muted mt-1">
                          {ability.description}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Confirm Button */}
          <Pressable
            onPress={handleConfirm}
            disabled={!selectedClass}
            style={({ pressed }) => [
              {
                opacity: selectedClass ? (pressed ? 0.8 : 1) : 0.5,
                backgroundColor: selectedClass
                  ? RPG_CLASSES[selectedClass].color
                  : colors.muted,
              },
            ]}
            className="rounded-lg py-4 items-center mt-4"
          >
            <Text className="text-white font-bold text-lg">
              {selectedClass
                ? `Jogar como ${RPG_CLASSES[selectedClass].name}`
                : "Selecione uma Classe"}
            </Text>
          </Pressable>

          {/* Info */}
          <View className="items-center gap-2 py-4">
            <Text className="text-xs text-muted text-center">
              ℹ️ Você pode mudar de classe depois, mas perderá seu progresso
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function ClassCard({
  rpgClass,
  isSelected,
  onPress,
}: {
  rpgClass: (typeof RPG_CLASSES)[PositionClass];
  isSelected: boolean;
  onPress: () => void;
}) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
          borderColor: isSelected ? rpgClass.color : colors.border,
          borderWidth: isSelected ? 3 : 1,
          backgroundColor: isSelected ? rpgClass.color + "15" : colors.surface,
        },
      ]}
      className="rounded-2xl p-6 gap-3"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1">
          <Text className="text-5xl">{rpgClass.emoji}</Text>
          <View className="flex-1">
            <Text className="text-xl font-bold text-foreground">
              {rpgClass.name}
            </Text>
            <Text className="text-xs text-muted mt-1">
              {rpgClass.description}
            </Text>
          </View>
        </View>
        {isSelected && (
          <View className="ml-2">
            <Text className="text-2xl">✅</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

function AttributeBar({
  name,
  value,
  emoji,
}: {
  name: string;
  value: number;
  emoji: string;
}) {
  const colors = useColors();
  const percentage = (value / 100) * 100;

  return (
    <View className="gap-1">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg">{emoji}</Text>
          <Text className="text-sm font-semibold text-foreground">{name}</Text>
        </View>
        <Text className="text-sm font-bold text-foreground">{value}</Text>
      </View>
      <View
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: colors.border }}
      >
        <View
          className="h-full rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: getColorByValue(value),
          }}
        />
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

function getColorByValue(value: number): string {
  if (value >= 90) return "#EF4444";
  if (value >= 80) return "#F59E0B";
  if (value >= 70) return "#3B82F6";
  return "#10B981";
}
