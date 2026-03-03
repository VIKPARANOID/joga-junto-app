import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { View, Text, Pressable, ScrollView } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { LoadingScreen } from "@/components/loading-spinner";
import { ErrorScreen } from "@/components/error-screen";
import { useEffect } from "react";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

/**
 * Home Screen - Redirecionamento para Atleta ou Clube
 *
 * Esta tela verifica o tipo de usuário e redireciona para a área apropriada.
 * Se não estiver autenticado, mostra opções de login/cadastro.
 */
export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { user, loading, isAuthenticated, error, refresh } = useAuth();

  useEffect(() => {
    // Só redirecionar se estiver autenticado
    if (!loading && isAuthenticated && user) {
      console.log("[HomeScreen] User authenticated, redirecting to user type selection");
      router.replace("/user-type-selection");
    }
  }, [user, loading, isAuthenticated, router]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <LoadingScreen
          message="Verificando autenticação..."
          subMessage="Aguarde um momento"
        />
      </ScreenContainer>
    );
  }

  // Mostrar erro se houver
  if (error && !isAuthenticated) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ErrorScreen
          title="Erro de Conexão"
          message="Não conseguimos verificar sua sessão. Tente novamente."
          errorCode={error.message}
          onRetry={() => refresh()}
          showRetry={true}
        />
      </ScreenContainer>
    );
  }

  // Se estiver autenticado, mostrar loading enquanto redireciona
  if (isAuthenticated) {
    return (
      <ScreenContainer className="items-center justify-center">
        <LoadingScreen
          message="Redirecionando..."
          subMessage="Carregando seu perfil"
        />
      </ScreenContainer>
    );
  }

  // Se não estiver autenticado, mostrar tela de boas-vindas
  return (
    <ScreenContainer className="p-6 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-between py-8">
          {/* Hero Section */}
          <View className="items-center gap-6">
            {/* Logo */}
            <View 
              className="w-24 h-24 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-6xl">⚽</Text>
            </View>

            {/* Title */}
            <View className="items-center gap-3">
              <Text className="text-4xl font-bold text-foreground text-center">
                Joga Junto
              </Text>
              <Text className="text-base text-muted text-center max-w-xs leading-relaxed">
                Análise de desempenho de atletas com Inteligência Artificial
              </Text>
            </View>
          </View>

          {/* Features Cards */}
          <View className="w-full gap-3 my-8">
            {/* Atletas */}
            <View 
              className="flex-row items-start gap-4 p-4 rounded-xl border"
              style={{ 
                backgroundColor: colors.surface,
                borderColor: colors.border 
              }}
            >
              <Text className="text-3xl">🎯</Text>
              <View className="flex-1">
                <Text className="font-bold text-foreground text-base">Para Atletas</Text>
                <Text className="text-sm text-muted leading-relaxed">
                  Envie vídeos curtos e receba análise detalhada de desempenho
                </Text>
              </View>
            </View>

            {/* Olheiros */}
            <View 
              className="flex-row items-start gap-4 p-4 rounded-xl border"
              style={{ 
                backgroundColor: colors.surface,
                borderColor: colors.border 
              }}
            >
              <Text className="text-3xl">👁️</Text>
              <View className="flex-1">
                <Text className="font-bold text-foreground text-base">Para Olheiros</Text>
                <Text className="text-sm text-muted leading-relaxed">
                  Descubra talentos com dados reais de desempenho
                </Text>
              </View>
            </View>

            {/* Métricas */}
            <View 
              className="flex-row items-start gap-4 p-4 rounded-xl border"
              style={{ 
                backgroundColor: colors.surface,
                borderColor: colors.border 
              }}
            >
              <Text className="text-3xl">📊</Text>
              <View className="flex-1">
                <Text className="font-bold text-foreground text-base">Métricas IA</Text>
                <Text className="text-sm text-muted leading-relaxed">
                  Velocidade, agilidade, intensidade e muito mais
                </Text>
              </View>
            </View>
          </View>

          {/* CTA Section */}
          <View className="w-full gap-4">
            {/* Primary Button */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/auth/login");
              }}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              className="py-4 px-6 rounded-lg items-center"
            >
              <Text className="text-white font-bold text-base">
                Entrar / Cadastrar
              </Text>
            </Pressable>

            {/* Helper Text */}
            <Text className="text-xs text-muted text-center leading-relaxed">
              Faça login com sua conta ou crie uma nova para começar
            </Text>
          </View>

          {/* Footer */}
          <View className="items-center gap-1 mt-4">
            <Text className="text-xs text-muted">
              Desenvolvido com ❤️ para o futebol
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
