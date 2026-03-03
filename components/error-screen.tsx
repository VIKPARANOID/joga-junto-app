import { View, Text, Pressable } from "react-native";

interface ErrorScreenProps {
  title?: string;
  message?: string;
  errorCode?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  showRetry?: boolean;
  showDismiss?: boolean;
}

/**
 * Tela de erro com opções de retry e dismiss
 */
export function ErrorScreen({
  title = "Algo deu errado",
  message = "Ocorreu um erro ao carregar os dados. Tente novamente.",
  errorCode,
  onRetry,
  onDismiss,
  showRetry = true,
  showDismiss = false,
}: ErrorScreenProps) {
  return (
    <View className="flex-1 items-center justify-center bg-background gap-6 p-6">
      {/* Ícone de erro */}
      <View className="items-center gap-4">
        <Text className="text-6xl">⚠️</Text>
        <View className="items-center gap-2">
          <Text className="text-xl font-bold text-foreground text-center">{title}</Text>
          <Text className="text-sm text-muted text-center">{message}</Text>
          {errorCode && (
            <Text className="text-xs text-muted mt-2">Código: {errorCode}</Text>
          )}
        </View>
      </View>

      {/* Botões de ação */}
      <View className="w-full gap-3 max-w-xs">
        {showRetry && onRetry && (
          <Pressable
            onPress={onRetry}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            className="bg-primary py-3 px-6 rounded-lg items-center"
          >
            <Text className="text-white font-semibold">Tentar Novamente</Text>
          </Pressable>
        )}

        {showDismiss && onDismiss && (
          <Pressable
            onPress={onDismiss}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            className="bg-surface py-3 px-6 rounded-lg items-center border border-border"
          >
            <Text className="text-foreground font-semibold">Fechar</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

interface ErrorBannerProps {
  message: string;
  type?: "error" | "warning" | "info";
  onDismiss?: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
}

/**
 * Banner de erro/aviso para mostrar no topo da tela
 */
export function ErrorBanner({
  message,
  type = "error",
  onDismiss,
  action,
}: ErrorBannerProps) {
  const bgColorMap = {
    error: "bg-error/10",
    warning: "bg-warning/10",
    info: "bg-primary/10",
  };

  const borderColorMap = {
    error: "border-error",
    warning: "border-warning",
    info: "border-primary",
  };

  const textColorMap = {
    error: "text-error",
    warning: "text-warning",
    info: "text-primary",
  };

  const iconMap = {
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <View
      className={`${bgColorMap[type]} border ${borderColorMap[type]} rounded-lg p-4 flex-row items-center justify-between gap-3`}
    >
      <View className="flex-1 flex-row items-center gap-3">
        <Text className="text-lg">{iconMap[type]}</Text>
        <Text className={`flex-1 text-sm ${textColorMap[type]}`}>{message}</Text>
      </View>

      <View className="flex-row gap-2">
        {action && (
          <Pressable
            onPress={action.onPress}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Text className={`text-sm font-semibold ${textColorMap[type]}`}>
              {action.label}
            </Text>
          </Pressable>
        )}

        {onDismiss && (
          <Pressable
            onPress={onDismiss}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Text className={`text-lg ${textColorMap[type]}`}>✕</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

interface TimeoutErrorProps {
  onRetry?: () => void;
  onCancel?: () => void;
}

/**
 * Tela de timeout - carregamento demorou muito
 */
export function TimeoutError({ onRetry, onCancel }: TimeoutErrorProps) {
  return (
    <ErrorScreen
      title="Carregamento Demorado"
      message="A solicitação está demorando mais do que o esperado. Verifique sua conexão e tente novamente."
      errorCode="TIMEOUT"
      onRetry={onRetry}
      onDismiss={onCancel}
      showRetry={!!onRetry}
      showDismiss={!!onCancel}
    />
  );
}
