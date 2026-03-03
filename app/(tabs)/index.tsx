import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { View, Text, Pressable, ScrollView } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { LoadingScreen } from "@/components/loading-spinner";
import { ErrorScreen } from "@/components/error-screen";

/**
 * Home Screen - Redirecionamento para Atleta ou Clube
 *
 * Esta tela verifica o tipo de usuário e redireciona para a área apropriada.
 * Se não estiver autenticado, mostra opções de login/cadastro.
 */
export default function HomeScreen() {
  const router = useRouter();
  const { user, loading, isAuthenticated, error, refresh } = useAuth();

  useEffect(() => {
    // Só redirecionar se estiver autenticado
    if (!loading && isAuthenticated && user) {
      console.log("[HomeScreen] User authenticated, redirecting to athlete profile");
      router.replace("/athlete/profile");
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

  // Se não estiver autenticado, mostrar tela de login
  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center items-center gap-8">
          {/* Hero */}
          <View className="items-center gap-4">
            <Text className="text-6xl">⚽</Text>
            <View className="items-center gap-2">
              <Text className="text-3xl font-bold text-foreground text-center">
                Joga Junto
              </Text>
              <Text className="text-base text-muted text-center max-w-xs">
                Análise de desempenho de atletas com Inteligência Artificial
              </Text>
            </View>
          </View>

          {/* Features */}
          <View className="w-full gap-3">
            <View className="flex-row items-start gap-3">
              <Text className="text-2xl">🎯</Text>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">Para Atletas</Text>
                <Text className="text-sm text-muted">
                  Envie vídeos e receba análise de desempenho
                </Text>
              </View>
            </View>

            <View className="flex-row items-start gap-3">
              <Text className="text-2xl">👁️</Text>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">Para Olheiros</Text>
                <Text className="text-sm text-muted">
                  Descubra talentos com dados de desempenho
                </Text>
              </View>
            </View>

            <View className="flex-row items-start gap-3">
              <Text className="text-2xl">📊</Text>
              <View className="flex-1">
                <Text className="font-semibold text-foreground">Métricas IA</Text>
                <Text className="text-sm text-muted">
                  Velocidade, agilidade, intensidade e mais
                </Text>
              </View>
            </View>
          </View>

          {/* CTA Buttons */}
          <View className="w-full gap-3 mt-4">
            <Pressable
              onPress={() => router.push("/user-type-selection")}
              style={({ pressed }) => [
                {
                  backgroundColor: "#0a7ea4",
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              className="py-4 px-6 rounded-lg items-center"
            >
              <Text className="text-white font-semibold text-base">
                Começar
              </Text>
            </Pressable>

            <Text className="text-xs text-muted text-center mt-2">
              Você será redirecionado para login/cadastro
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
