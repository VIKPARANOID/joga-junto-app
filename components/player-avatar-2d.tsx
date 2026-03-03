import React from "react";
import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface PlayerAvatar2DProps {
  class: "Atacante" | "Meia" | "Lateral" | "Goleiro";
  level: number;
  size?: "small" | "medium" | "large";
  equippedItems?: {
    shoes?: string;
    uniform?: string;
    aura?: string;
  };
}

export function PlayerAvatar2D({
  class: playerClass,
  level,
  size = "medium",
  equippedItems = {},
}: PlayerAvatar2DProps) {
  const sizeMap = {
    small: 80,
    medium: 120,
    large: 160,
  };

  const avatarSize = sizeMap[size];
  const scale = avatarSize / 120; // Base size is 120

  // Animação de aura
  const auraScale = useSharedValue(1);

  React.useEffect(() => {
    auraScale.value = withRepeat(
      withTiming(1.1, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [auraScale]);

  const auraAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: auraScale.value }],
  }));

  // Cores por classe
  const classColors: Record<string, { primary: string; secondary: string; emoji: string }> = {
    Atacante: { primary: "#EF4444", secondary: "#FCA5A5", emoji: "⚔️" },
    Meia: { primary: "#8B5CF6", secondary: "#DDD6FE", emoji: "🎭" },
    Lateral: { primary: "#3B82F6", secondary: "#BFDBFE", emoji: "🛡️" },
    Goleiro: { primary: "#10B981", secondary: "#A7F3D0", emoji: "🧤" },
  };

  const colors = classColors[playerClass];

  // Determinar equipamento
  const shoeEmoji = equippedItems.shoes === "gold-shoes" ? "👟✨" : equippedItems.shoes === "silver-shoes" ? "👟🌟" : "👟";
  const uniformEmoji = equippedItems.uniform === "gold-uniform" ? "🎽✨" : "🎽";
  const hasAura = equippedItems.aura && equippedItems.aura !== "none";

  return (
    <View
      style={{
        width: avatarSize,
        height: avatarSize,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Aura Background */}
      {hasAura && (
        <Animated.View
          style={[
            {
              position: "absolute",
              width: avatarSize * 1.2,
              height: avatarSize * 1.2,
              borderRadius: (avatarSize * 1.2) / 2,
              backgroundColor: colors.primary,
              opacity: 0.15,
            },
            auraAnimatedStyle,
          ]}
        />
      )}

      {/* Main Avatar Container */}
      <View
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor: colors.secondary,
          borderWidth: 3,
          borderColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Head */}
        <View
          style={{
            width: avatarSize * 0.35,
            height: avatarSize * 0.35,
            borderRadius: (avatarSize * 0.35) / 2,
            backgroundColor: "#F4A460",
            marginBottom: avatarSize * 0.05,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: avatarSize * 0.15 }}>😊</Text>
        </View>

        {/* Body */}
        <View
          style={{
            width: avatarSize * 0.4,
            height: avatarSize * 0.35,
            backgroundColor: colors.primary,
            borderRadius: avatarSize * 0.05,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: avatarSize * 0.02,
          }}
        >
          <Text style={{ fontSize: avatarSize * 0.18 }}>{uniformEmoji}</Text>
        </View>

        {/* Legs */}
        <View style={{ flexDirection: "row", gap: avatarSize * 0.05 }}>
          <View
            style={{
              width: avatarSize * 0.12,
              height: avatarSize * 0.2,
              backgroundColor: "#333",
              borderRadius: avatarSize * 0.02,
            }}
          />
          <View
            style={{
              width: avatarSize * 0.12,
              height: avatarSize * 0.2,
              backgroundColor: "#333",
              borderRadius: avatarSize * 0.02,
            }}
          />
        </View>

        {/* Shoes */}
        <View style={{ flexDirection: "row", gap: avatarSize * 0.05, marginTop: avatarSize * 0.02 }}>
          <Text style={{ fontSize: avatarSize * 0.12 }}>{shoeEmoji}</Text>
          <Text style={{ fontSize: avatarSize * 0.12 }}>{shoeEmoji}</Text>
        </View>
      </View>

      {/* Level Badge */}
      <View
        style={{
          position: "absolute",
          bottom: -5,
          right: -5,
          width: avatarSize * 0.3,
          height: avatarSize * 0.3,
          borderRadius: (avatarSize * 0.3) / 2,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2,
          borderColor: "#fff",
        }}
      >
        <Text style={{ fontSize: avatarSize * 0.12, fontWeight: "bold", color: "#fff" }}>
          {level}
        </Text>
      </View>

      {/* Class Icon */}
      <View
        style={{
          position: "absolute",
          top: -5,
          left: -5,
        }}
      >
        <Text style={{ fontSize: avatarSize * 0.25 }}>{colors.emoji}</Text>
      </View>
    </View>
  );
}
