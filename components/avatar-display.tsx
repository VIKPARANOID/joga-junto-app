import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PlayerAvatar, getEffectAnimation } from "@/lib/avatar-system";
import { useColors } from "@/hooks/use-colors";

interface AvatarDisplayProps {
  avatar: PlayerAvatar;
  size?: "small" | "medium" | "large";
  showDetails?: boolean;
}

export function AvatarDisplay({
  avatar,
  size = "medium",
  showDetails = false,
}: AvatarDisplayProps) {
  const colors = useColors();

  const sizeMap = {
    small: 120,
    medium: 180,
    large: 240,
  };

  const displaySize = sizeMap[size];

  return (
    <View className="items-center gap-4">
      {/* Avatar Container */}
      <View
        className="items-center justify-center rounded-3xl overflow-hidden"
        style={{
          width: displaySize,
          height: displaySize * 1.5,
          backgroundColor: colors.surface,
          borderWidth: 2,
          borderColor: colors.border,
        }}
      >
        <AvatarSVGRenderer avatar={avatar} size={displaySize} />
      </View>

      {/* Details */}
      {showDetails && (
        <View className="w-full gap-2">
          {/* Uniform */}
          <DetailRow
            label="Uniforme"
            value={avatar.uniform.name}
            color={avatar.uniform.color}
          />

          {/* Shoes */}
          <DetailRow
            label="Chuteira"
            value={avatar.shoes.name}
            color={avatar.shoes.color}
            effect={avatar.shoes.effect}
          />

          {/* Accessories */}
          {avatar.accessories.length > 0 && (
            <DetailRow
              label="Acessórios"
              value={avatar.accessories.map((a) => a.name).join(", ")}
              color={colors.primary}
            />
          )}

          {/* Aura */}
          {avatar.aura && (
            <DetailRow
              label="Aura"
              value={avatar.aura.name}
              color={avatar.aura.color}
              effect={avatar.aura.effect}
            />
          )}
        </View>
      )}
    </View>
  );
}

function AvatarSVGRenderer({
  avatar,
  size,
}: {
  avatar: PlayerAvatar;
  size: number;
}) {
  const skinColor = avatar.skinColor;
  const hairColor = avatar.hairColor;
  const shoesColor = avatar.shoes.color;
  const uniformColor = avatar.uniform.color;

  const headRadius = size * 0.175;
  const bodyWidth = size * 0.25;
  const bodyHeight = size * 0.3;

  return (
    <View
      style={{
        width: size,
        height: size * 1.5,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Aura Background */}
      {avatar.aura && (
        <View
          style={{
            position: "absolute",
            width: size * 0.6,
            height: size * 0.6,
            borderRadius: (size * 0.6) / 2,
            backgroundColor: avatar.aura.color,
            opacity: 0.15,
          }}
        />
      )}

      {/* Cabeça */}
      <View
        style={{
          width: headRadius * 2,
          height: headRadius * 2,
          borderRadius: headRadius,
          backgroundColor: skinColor,
          marginBottom: size * 0.05,
          zIndex: 10,
        }}
      >
        {/* Cabelo */}
        <View
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            height: "50%",
            backgroundColor: hairColor,
            borderTopLeftRadius: headRadius,
            borderTopRightRadius: headRadius,
          }}
        />

        {/* Olhos */}
        <View
          style={{
            position: "absolute",
            top: "40%",
            left: "30%",
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: "black",
          }}
        />
        <View
          style={{
            position: "absolute",
            top: "40%",
            right: "30%",
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: "black",
          }}
        />

        {/* Boca */}
        <View
          style={{
            position: "absolute",
            bottom: "20%",
            left: "50%",
            width: 8,
            height: 4,
            borderRadius: 2,
            backgroundColor: "black",
            marginLeft: -4,
          }}
        />
      </View>

      {/* Corpo (Uniforme) */}
      <View
        style={{
          width: bodyWidth,
          height: bodyHeight,
          backgroundColor: uniformColor,
          borderRadius: 8,
          marginBottom: size * 0.02,
          zIndex: 9,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: size * 0.05,
        }}
      >
        {/* Braço Esquerdo */}
        <View
          style={{
            width: size * 0.08,
            height: bodyHeight,
            backgroundColor: skinColor,
            borderRadius: 4,
          }}
        />

        {/* Braço Direito */}
        <View
          style={{
            width: size * 0.08,
            height: bodyHeight,
            backgroundColor: skinColor,
            borderRadius: 4,
          }}
        />
      </View>

      {/* Pernas */}
      <View style={{ flexDirection: "row", gap: size * 0.05 }}>
        <View
          style={{
            width: size * 0.08,
            height: bodyHeight * 0.8,
            backgroundColor: skinColor,
            borderRadius: 4,
          }}
        />
        <View
          style={{
            width: size * 0.08,
            height: bodyHeight * 0.8,
            backgroundColor: skinColor,
            borderRadius: 4,
          }}
        />
      </View>

      {/* Chuteiras */}
      <View style={{ flexDirection: "row", gap: size * 0.05, marginTop: size * 0.02 }}>
        <View
          style={{
            width: size * 0.12,
            height: size * 0.08,
            backgroundColor: shoesColor,
            borderRadius: 6,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: size * 0.06 }}>👟</Text>
        </View>
        <View
          style={{
            width: size * 0.12,
            height: size * 0.08,
            backgroundColor: shoesColor,
            borderRadius: 6,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: size * 0.06 }}>👟</Text>
        </View>
      </View>

      {/* Efeito de Asas */}
      {avatar.shoes.effect === "wings" && (
        <>
          <View
            style={{
              position: "absolute",
              left: size * 0.1,
              top: size * 0.6,
              width: 0,
              height: 0,
              borderLeftWidth: 8,
              borderRightWidth: 8,
              borderTopWidth: 12,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderTopColor: shoesColor,
              opacity: 0.7,
            }}
          />
          <View
            style={{
              position: "absolute",
              right: size * 0.1,
              top: size * 0.6,
              width: 0,
              height: 0,
              borderLeftWidth: 8,
              borderRightWidth: 8,
              borderTopWidth: 12,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderTopColor: shoesColor,
              opacity: 0.7,
            }}
          />
        </>
      )}
    </View>
  );
}

function DetailRow({
  label,
  value,
  color,
  effect,
}: {
  label: string;
  value: string;
  color: string;
  effect?: string;
}) {
  const colors = useColors();

  return (
    <View
      className="flex-row items-center justify-between p-3 rounded-lg"
      style={{ backgroundColor: colors.surface }}
    >
      <Text className="text-sm font-semibold text-muted">{label}</Text>
      <View className="flex-row items-center gap-2">
        <View
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            backgroundColor: color,
          }}
        />
        <Text className="text-sm font-bold text-foreground">{value}</Text>
        {effect && (
          <Text className="text-xs text-muted ml-2">
            ({getEffectAnimation(effect)})
          </Text>
        )}
      </View>
    </View>
  );
}
