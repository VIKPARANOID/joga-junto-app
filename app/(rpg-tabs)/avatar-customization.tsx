import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { useState } from "react";

export default function AvatarCustomizationScreen() {
  const colors = useColors();
  const [selectedCategory, setSelectedCategory] = useState<
    "shoes" | "uniforms" | "auras" | "accessories"
  >("shoes");

  const ITEMS = [
    { id: "gold-shoes", name: "Chuteira Ouro", category: "shoes", emoji: "👟", rarity: "legendary" },
    { id: "silver-shoes", name: "Chuteira Prata", category: "shoes", emoji: "👟", rarity: "rare" },
    { id: "bronze-shoes", name: "Chuteira Bronze", category: "shoes", emoji: "👟", rarity: "common" },
    { id: "blue-uniform", name: "Uniforme Azul", category: "uniforms", emoji: "🎽", rarity: "common" },
    { id: "red-uniform", name: "Uniforme Vermelho", category: "uniforms", emoji: "🎽", rarity: "rare" },
    { id: "gold-uniform", name: "Uniforme Ouro", category: "uniforms", emoji: "🎽", rarity: "epic" },
    { id: "aura-gold", name: "Aura Dourada", category: "auras", emoji: "✨", rarity: "epic" },
    { id: "aura-blue", name: "Aura Azul", category: "auras", emoji: "✨", rarity: "rare" },
    { id: "crown", name: "Coroa", category: "accessories", emoji: "👑", rarity: "legendary" },
    { id: "medal", name: "Medalha", category: "accessories", emoji: "🏅", rarity: "rare" },
  ];

  const categoryItems = ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="p-6 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              🎨 Customizar Avatar
            </Text>
            <Text className="text-sm text-muted">
              Personalize seu personagem com itens desbloqueáveis
            </Text>
          </View>

          {/* Avatar Preview */}
          <View className="items-center gap-4">
            <View className="w-32 h-32 bg-surface rounded-lg items-center justify-center border-2 border-primary">
              <Text className="text-6xl">⚽</Text>
            </View>
            <Text className="text-lg font-bold text-foreground">
              Seu Avatar
            </Text>
          </View>

          {/* Category Tabs */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">
              🛍️ Loja de Itens
            </Text>
            <View className="flex-row gap-2">
              {(["shoes", "uniforms", "auras", "accessories"] as const).map(
                (category) => (
                  <Pressable
                    key={category}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedCategory(category);
                    }}
                    style={({ pressed }) => [
                      {
                        opacity: pressed ? 0.8 : 1,
                        backgroundColor:
                          selectedCategory === category
                            ? colors.primary
                            : colors.surface,
                        flex: 1,
                      },
                    ]}
                    className="rounded-lg py-2 items-center"
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{
                        color:
                          selectedCategory === category
                            ? "white"
                            : colors.foreground,
                      }}
                    >
                      {category === "shoes"
                        ? "👟"
                        : category === "uniforms"
                          ? "🎽"
                          : category === "auras"
                            ? "✨"
                            : "💎"}
                    </Text>
                  </Pressable>
                )
              )}
            </View>
          </View>

          {/* Items List */}
          <View className="gap-3">
            <FlatList
              data={categoryItems}
              renderItem={({ item }) => (
                <ItemCard item={item} />
              )}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              nestedScrollEnabled={false}
            />
          </View>

          {/* Info */}
          <View className="items-center gap-2 py-4">
            <Text className="text-xs text-muted text-center">
              💡 Desbloqueie novos itens subindo de nível
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function ItemCard({
  item,
}: {
  item: { id: string; name: string; emoji: string; rarity: string };
}) {
  const colors = useColors();

  const rarityColors: Record<string, string> = {
    common: "#6B7280",
    rare: "#3B82F6",
    epic: "#8B5CF6",
    legendary: "#F59E0B",
  };

  const rarityNames: Record<string, string> = {
    common: "Comum",
    rare: "Raro",
    epic: "Épico",
    legendary: "Lendário",
  };

  return (
    <Pressable
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.8 : 1,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
        },
      ]}
      className="rounded-lg p-4 flex-row items-center justify-between gap-3"
    >
      <View className="flex-row items-center gap-3 flex-1">
        <Text className="text-3xl">{item.emoji}</Text>
        <View className="flex-1">
          <Text className="text-sm font-bold text-foreground">
            {item.name}
          </Text>
        </View>
      </View>

      <View
        className="px-3 py-1 rounded-full"
        style={{ backgroundColor: rarityColors[item.rarity] }}
      >
        <Text className="text-xs font-bold text-white">
          {rarityNames[item.rarity]}
        </Text>
      </View>
    </Pressable>
  );
}
