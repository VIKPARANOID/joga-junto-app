import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { AvatarDisplay } from "@/components/avatar-display";
import { useColors } from "@/hooks/use-colors";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  AVATAR_PRESETS,
  CUSTOMIZATION_SHOP,
  getItemsByPart,
  isItemUnlocked,
  getRarityColor,
  getRarityEmoji,
  type AvatarPart,
  type PlayerAvatar,
} from "@/lib/avatar-system";
import { useState } from "react";

export default function AvatarCustomizationScreen() {
  const colors = useColors();
  const router = useRouter();
  const { class: playerClass } = useLocalSearchParams();
  const [currentAvatar, setCurrentAvatar] = useState<PlayerAvatar>(
    AVATAR_PRESETS.default
  );
  const [selectedPart, setSelectedPart] = useState<AvatarPart>("shoes");
  const [playerXP] = useState(1500); // Demo XP

  const handleSelectPart = (part: AvatarPart) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPart(part);
  };

  const handleEquipItem = (itemId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const item = CUSTOMIZATION_SHOP.find((i) => i.id === itemId);
    if (!item) return;

    const updatedAvatar = { ...currentAvatar };

    if (item.part === "shoes") {
      updatedAvatar.shoes = item;
    } else if (item.part === "uniform") {
      updatedAvatar.uniform = item;
    } else if (item.part === "aura") {
      updatedAvatar.aura = item;
    } else if (item.part === "accessory") {
      const hasAccessory = updatedAvatar.accessories.find((a) => a.id === itemId);
      if (hasAccessory) {
        updatedAvatar.accessories = updatedAvatar.accessories.filter(
          (a) => a.id !== itemId
        );
      } else {
        updatedAvatar.accessories = [...updatedAvatar.accessories, item];
      }
    }

    setCurrentAvatar(updatedAvatar);
  };

  const handleLoadPreset = (presetId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCurrentAvatar(AVATAR_PRESETS[presetId]);
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const itemsForPart = getItemsByPart(selectedPart);

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
              🎨 Customizar Avatar
            </Text>
            <View className="w-8" />
          </View>

          {/* Avatar Preview */}
          <View
            className="rounded-2xl p-6 items-center"
            style={{ backgroundColor: colors.surface }}
          >
            <AvatarDisplay avatar={currentAvatar} size="large" showDetails={true} />
          </View>

          {/* Presets */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">
              ⭐ Presets Rápidos
            </Text>
            <View className="flex-row gap-2">
              <PresetButton
                name="Padrão"
                emoji="⚪"
                onPress={() => handleLoadPreset("default")}
              />
              <PresetButton
                name="Velocista"
                emoji="⚡"
                onPress={() => handleLoadPreset("velocista_ouro")}
              />
              <PresetButton
                name="Resistência"
                emoji="🛡️"
                onPress={() => handleLoadPreset("resistencia_prata")}
              />
              <PresetButton
                name="Força"
                emoji="💪"
                onPress={() => handleLoadPreset("forca_bronze")}
              />
            </View>
          </View>

          {/* Part Selection */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">
              🛍️ Personalizar
            </Text>
            <View className="flex-row gap-2 flex-wrap">
              {(["shoes", "uniform", "aura", "accessory"] as AvatarPart[]).map(
                (part) => (
                  <Pressable
                    key={part}
                    onPress={() => handleSelectPart(part)}
                    style={({ pressed }) => [
                      {
                        opacity: pressed ? 0.8 : 1,
                        backgroundColor:
                          selectedPart === part ? colors.primary : colors.surface,
                      },
                    ]}
                    className="px-4 py-2 rounded-full border border-border"
                  >
                    <Text
                      className="text-sm font-bold"
                      style={{
                        color:
                          selectedPart === part ? "white" : colors.foreground,
                      }}
                    >
                      {getPartEmoji(part)} {getPartName(part)}
                    </Text>
                  </Pressable>
                ),
              )}
            </View>
          </View>

          {/* Items Grid */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">
              {getPartName(selectedPart)}
            </Text>
            <View className="gap-2">
              {itemsForPart.map((item) => {
                const isUnlocked = isItemUnlocked(item, playerXP);
                const isEquipped =
                  (selectedPart === "shoes" && currentAvatar.shoes.id === item.id) ||
                  (selectedPart === "uniform" &&
                    currentAvatar.uniform.id === item.id) ||
                  (selectedPart === "aura" && currentAvatar.aura?.id === item.id) ||
                  (selectedPart === "accessory" &&
                    currentAvatar.accessories.some((a) => a.id === item.id));

                return (
                  <ItemCard
                    key={item.id}
                    item={item}
                    isUnlocked={isUnlocked}
                    isEquipped={isEquipped}
                    playerXP={playerXP}
                    onPress={() => {
                      if (isUnlocked) {
                        handleEquipItem(item.id);
                      }
                    }}
                  />
                );
              })}
            </View>
          </View>

          {/* Save Button */}
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
                backgroundColor: colors.primary,
              },
            ]}
            className="rounded-lg py-4 items-center mt-4"
          >
            <Text className="text-white font-bold text-lg">
              ✅ Salvar Customização
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function PresetButton({
  name,
  emoji,
  onPress,
}: {
  name: string;
  emoji: string;
  onPress: () => void;
}) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.8 : 1,
          backgroundColor: colors.surface,
          flex: 1,
        },
      ]}
      className="rounded-lg py-3 items-center border border-border"
    >
      <Text className="text-2xl mb-1">{emoji}</Text>
      <Text className="text-xs font-bold text-foreground">{name}</Text>
    </Pressable>
  );
}

function ItemCard({
  item,
  isUnlocked,
  isEquipped,
  playerXP,
  onPress,
}: {
  item: (typeof CUSTOMIZATION_SHOP)[0];
  isUnlocked: boolean;
  isEquipped: boolean;
  playerXP: number;
  onPress: () => void;
}) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      disabled={!isUnlocked}
      style={({ pressed }) => [
        {
          opacity: isUnlocked ? (pressed ? 0.8 : 1) : 0.5,
          borderColor: isEquipped ? item.color : colors.border,
          borderWidth: isEquipped ? 3 : 1,
          backgroundColor: isEquipped ? item.color + "20" : colors.surface,
        },
      ]}
      className="rounded-lg p-4 flex-row items-center justify-between"
    >
      <View className="flex-row items-center gap-3 flex-1">
        <Text className="text-3xl">{item.emoji}</Text>
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-sm font-bold text-foreground">
              {item.name}
            </Text>
            <Text className="text-xs">{getRarityEmoji(item.rarity)}</Text>
          </View>
          {!isUnlocked && (
            <Text className="text-xs text-muted mt-1">
              Desbloqueável em {item.unlockedAt} XP (Você tem {playerXP})
            </Text>
          )}
          {item.effect && (
            <Text className="text-xs text-muted mt-1">
              Efeito: {getEffectName(item.effect)}
            </Text>
          )}
        </View>
      </View>

      {isEquipped && (
        <View className="ml-2">
          <Text className="text-2xl">✅</Text>
        </View>
      )}
    </Pressable>
  );
}

function getPartName(part: AvatarPart): string {
  const names: Record<AvatarPart, string> = {
    shoes: "Chuteiras",
    uniform: "Uniformes",
    accessory: "Acessórios",
    aura: "Auras",
    body: "Corpo",
  };
  return names[part];
}

function getPartEmoji(part: AvatarPart): string {
  const emojis: Record<AvatarPart, string> = {
    shoes: "👟",
    uniform: "👕",
    accessory: "💍",
    aura: "✨",
    body: "🧍",
  };
  return emojis[part];
}

function getEffectName(effect: string): string {
  const names: Record<string, string> = {
    glow: "Brilho",
    spin: "Rotação",
    bounce: "Pulo",
    wings: "Asas",
  };
  return names[effect] || effect;
}
