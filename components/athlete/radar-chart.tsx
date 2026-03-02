import { View, Text, Dimensions } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface RadarChartProps {
  data: {
    label: string;
    value: number;
    max?: number;
  }[];
  size?: number;
}

export function RadarChart({ data, size = 200 }: RadarChartProps) {
  const colors = useColors();
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 3;

  // Calcular ângulos para cada ponto
  const angleSlice = (Math.PI * 2) / data.length;

  // Normalizar valores (0-100)
  const normalizedData = data.map((item) => ({
    ...item,
    normalizedValue: Math.min((item.value / (item.max || 100)) * 100, 100),
  }));

  // Calcular coordenadas dos pontos
  const points = normalizedData.map((item, index) => {
    const angle = angleSlice * index - Math.PI / 2;
    const r = (item.normalizedValue / 100) * radius;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return { x, y, ...item };
  });

  // SVG-like visualization usando View
  return (
    <View className="items-center justify-center">
      {/* Container com background */}
      <View
        className="rounded-full border-2"
        style={{
          width: size,
          height: size,
          borderColor: colors.border,
          position: "relative",
        }}
      >
        {/* Grid circles */}
        {[1, 2, 3].map((level) => (
          <View
            key={level}
            className="absolute rounded-full border"
            style={{
              width: (size / 3) * level,
              height: (size / 3) * level,
              borderColor: colors.border,
              left: size / 2 - ((size / 3) * level) / 2,
              top: size / 2 - ((size / 3) * level) / 2,
              opacity: 0.3,
            }}
          />
        ))}

        {/* Linhas radiais */}
        {data.map((_, index) => {
          const angle = angleSlice * index - Math.PI / 2;
          const endX = centerX + radius * Math.cos(angle);
          const endY = centerY + radius * Math.sin(angle);
          return (
            <View
              key={`line-${index}`}
              style={{
                position: "absolute",
                width: 1,
                height: radius,
                backgroundColor: colors.border,
                left: centerX,
                top: centerY,
                transformOrigin: "0 0",
                transform: [
                  { rotate: `${(angle * 180) / Math.PI}deg` },
                  { translateY: -radius / 2 },
                ],
                opacity: 0.2,
              }}
            />
          );
        })}

        {/* Pontos de dados */}
        {points.map((point, index) => (
          <View
            key={`point-${index}`}
            style={{
              position: "absolute",
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: colors.primary,
              left: point.x - 6,
              top: point.y - 6,
            }}
          />
        ))}

        {/* Labels */}
        {points.map((point, index) => (
          <View
            key={`label-${index}`}
            style={{
              position: "absolute",
              left: point.x - 30,
              top: point.y - 30,
              width: 60,
              alignItems: "center",
            }}
          >
            <Text className="text-xs font-semibold text-foreground text-center">
              {point.label}
            </Text>
            <Text className="text-xs text-muted">
              {point.normalizedValue.toFixed(0)}
            </Text>
          </View>
        ))}
      </View>

      {/* Legenda */}
      <View className="mt-6 gap-2">
        {data.map((item, index) => (
          <View key={index} className="flex-row items-center gap-2">
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.primary, opacity: 0.7 - index * 0.2 }}
            />
            <Text className="text-xs text-foreground">
              {item.label}: {item.value.toFixed(1)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
