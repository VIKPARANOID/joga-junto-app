import { View, Text } from "react-native";

interface LevelBadgeProps {
  maxSpeedKmh: number;
}

export function LevelBadge({ maxSpeedKmh }: LevelBadgeProps) {
  let level: "Bronze" | "Prata" | "Ouro";
  let color: string;
  let bgColor: string;
  let emoji: string;

  if (maxSpeedKmh >= 28) {
    level = "Ouro";
    color = "#D97706";
    bgColor = "#FEF3C7";
    emoji = "🥇";
  } else if (maxSpeedKmh >= 24) {
    level = "Prata";
    color = "#6B7280";
    bgColor = "#F3F4F6";
    emoji = "🥈";
  } else {
    level = "Bronze";
    color = "#92400E";
    bgColor = "#FEF3C7";
    emoji = "🥉";
  }

  return (
    <View
      className="rounded-full px-6 py-3 items-center justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <Text className="text-3xl mb-2">{emoji}</Text>
      <Text className="text-lg font-bold" style={{ color }}>
        {level}
      </Text>
      <Text className="text-xs" style={{ color }}>
        {maxSpeedKmh.toFixed(1)} km/h
      </Text>
    </View>
  );
}
