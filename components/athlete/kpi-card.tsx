import { View, Text } from "react-native";

interface KPICardProps {
  label: string;
  value: number | string;
  unit?: string;
  icon?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
  color?: "primary" | "success" | "warning" | "error";
}

export function KPICard({
  label,
  value,
  unit = "",
  icon = "📊",
  trend,
  trendValue,
  color = "primary",
}: KPICardProps) {
  const colorMap = {
    primary: "bg-blue-50 border-blue-200 text-blue-900",
    success: "bg-green-50 border-green-200 text-green-900",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
    error: "bg-red-50 border-red-200 text-red-900",
  };

  const trendIcon = {
    up: "📈",
    down: "📉",
    neutral: "➡️",
  };

  return (
    <View className={`border rounded-lg p-4 ${colorMap[color]}`}>
      {/* Header com ícone e label */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-xs font-medium opacity-75">{label}</Text>
        <Text className="text-lg">{icon}</Text>
      </View>

      {/* Valor principal */}
      <View className="flex-row items-baseline gap-1 mb-2">
        <Text className="text-3xl font-bold">{value}</Text>
        {unit && <Text className="text-sm font-medium opacity-75">{unit}</Text>}
      </View>

      {/* Trend */}
      {trend && trendValue !== undefined && (
        <View className="flex-row items-center gap-1">
          <Text className="text-sm">{trendIcon[trend]}</Text>
          <Text className="text-xs opacity-75">
            {trend === "up" ? "+" : ""}{trendValue}% vs semana anterior
          </Text>
        </View>
      )}
    </View>
  );
}
