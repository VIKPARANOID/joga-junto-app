import { View, Text } from "react-native";

interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  color?: "primary" | "success" | "warning" | "error";
  showPercentage?: boolean;
}

export function ProgressBar({
  label,
  value,
  max = 100,
  color = "primary",
  showPercentage = true,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const colorMap = {
    primary: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
  };

  return (
    <View className="gap-2">
      {/* Header com label e percentagem */}
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-medium text-foreground">{label}</Text>
        {showPercentage && (
          <Text className="text-sm font-semibold text-primary">
            {percentage.toFixed(0)}%
          </Text>
        )}
      </View>

      {/* Barra de progresso */}
      <View className="h-2 bg-surface rounded-full overflow-hidden">
        <View
          className={`h-full rounded-full ${colorMap[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );
}
