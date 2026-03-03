import { View, Text, ActivityIndicator } from "react-native";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  message?: string;
  subMessage?: string;
}

/**
 * Componente de spinner de carregamento animado
 */
export function LoadingSpinner({
  size = "medium",
  color = "#0a7ea4",
  message,
  subMessage,
}: LoadingSpinnerProps) {
  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64,
  };

  return (
    <View className="items-center gap-3">
      <ActivityIndicator size={sizeMap[size]} color={color} />
      {message && (
        <Text className="text-foreground font-semibold text-center">{message}</Text>
      )}
      {subMessage && <Text className="text-muted text-sm text-center">{subMessage}</Text>}
    </View>
  );
}

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
  progress?: number;
  showProgress?: boolean;
}

/**
 * Tela de carregamento com fundo completo
 */
export function LoadingScreen({
  message = "Carregando...",
  subMessage,
  progress,
  showProgress = false,
}: LoadingScreenProps) {
  return (
    <View className="flex-1 items-center justify-center bg-background gap-6 p-6">
      <LoadingSpinner size="large" message={message} subMessage={subMessage} />

      {showProgress && progress !== undefined && (
        <View className="w-full max-w-xs gap-2">
          <View className="h-2 bg-surface rounded-full overflow-hidden">
            <View
              className="h-full bg-primary"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </View>
          <Text className="text-xs text-muted text-center">{Math.round(progress)}%</Text>
        </View>
      )}
    </View>
  );
}

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

/**
 * Componente de skeleton loading (placeholder)
 */
export function SkeletonLoader({
  width = "100%",
  height = 16,
  borderRadius = 4,
  className = "",
}: SkeletonLoaderProps) {
  return (
    <View
      className={`bg-surface animate-pulse ${className}`}
      style={{
        width: typeof width === "number" ? width : "100%",
        height,
        borderRadius,
        opacity: 0.5,
      }}
    />
  );
}

/**
 * Grid de skeletons para lista de itens
 */
export function SkeletonGrid({ count = 3, height = 200 }: { count?: number; height?: number }) {
  return (
    <View className="gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} className="gap-3">
          <SkeletonLoader height={height} borderRadius={8} />
          <View className="gap-2">
            <SkeletonLoader height={16} width={200} />
            <SkeletonLoader height={12} width={150} />
          </View>
        </View>
      ))}
    </View>
  );
}
