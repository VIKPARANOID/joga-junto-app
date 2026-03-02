import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { ActivityIndicator, View, Text } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

/**
 * Home Screen - Redirecionamento para Atleta ou Clube
 *
 * Esta tela verifica o tipo de usuário e redireciona para a área apropriada.
 */
export default function HomeScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // Se estiver autenticado, redirecionar para área do atleta
    // TODO: Verificar tipo de usuário (athlete vs club) no banco de dados
    if (user) {
      router.replace("/athlete/profile");
      return;
    }

    // Se não estiver autenticado, permanecer na home
  }, [user, loading, router]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ScreenContainer>
    );
  }

  // Se não estiver autenticado, mostrar mensagem de boas-vindas
  return (
    <ScreenContainer className="items-center justify-center p-6">
      <View className="items-center gap-4">
        <Text className="text-6xl">⚽</Text>
        <View>
          <Text className="text-2xl font-bold text-foreground text-center">
            Bem-vindo ao Joga Junto
          </Text>
          <Text className="text-muted text-center mt-2">
            Carregando...
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
