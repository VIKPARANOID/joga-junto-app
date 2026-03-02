import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useJogaJuntoAuth } from "@/hooks/use-joga-junto-auth";
import { LoginForm } from "@/components/auth/login-form";

export default function HomeScreen() {
  const { isAuthenticated, isLoadingUserType, userType, user } = useJogaJuntoAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (isLoadingUserType) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color="#0A7EA4" />
      </ScreenContainer>
    );
  }

  if (!userType) {
    return (
      <ScreenContainer className="p-6 justify-center items-center">
        <Text className="text-lg text-foreground text-center">
          Selecione seu tipo de perfil
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-8">
          {/* Hero Section */}
          <View className="items-center gap-2">
            <Text className="text-4xl font-bold text-foreground">Bem-vindo!</Text>
            <Text className="text-base text-muted text-center">
              {user?.name || "Usuário"} - {userType === "athlete" ? "Atleta" : "Clube"}
            </Text>
          </View>

          {/* Status Card */}
          <View className="w-full bg-surface rounded-2xl p-6 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-2">Joga Junto</Text>
            <Text className="text-sm text-muted leading-relaxed">
              {userType === "athlete"
                ? "Envie vídeos de seus treinos e receba análise de desempenho com IA."
                : "Acompanhe atletas e veja análises de desempenho em tempo real."}
            </Text>
          </View>

          {/* Info */}
          <View className="items-center">
            <Text className="text-xs text-muted">Perfil: {userType}</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
