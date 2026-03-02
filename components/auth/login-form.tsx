import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

if (typeof window !== "undefined") {
  WebBrowser.maybeCompleteAuthSession();
}

export function LoginForm() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, user]);

  const handleLogin = async () => {
    try {
      // The useAuth hook handles OAuth login
      // This is a placeholder - actual OAuth is handled by the auth system
      // For now, we'll use a simple redirect
      router.push("/(tabs)");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#0A7EA4" />
      </View>
    );
  }

  if (isAuthenticated) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#0A7EA4" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background p-6 justify-center">
      <View className="gap-6">
        {/* Logo / Header */}
        <View className="items-center gap-4 mb-8">
          <View className="w-24 h-24 bg-primary rounded-full items-center justify-center">
            <Text className="text-4xl">⚽</Text>
          </View>
          <Text className="text-3xl font-bold text-foreground">Joga Junto</Text>
          <Text className="text-base text-muted text-center">
            Análise de Desempenho de Atletas com IA
          </Text>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          className="bg-primary rounded-lg py-4 items-center"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-base">Entrar com OAuth</Text>
        </TouchableOpacity>

        {/* Info Text */}
        <View className="bg-surface rounded-lg p-4 gap-2">
          <Text className="text-sm font-semibold text-foreground">Como funciona?</Text>
          <Text className="text-xs text-muted leading-relaxed">
            1. Faça login com sua conta{"\n"}
            2. Escolha seu tipo de perfil (Atleta ou Clube){"\n"}
            3. Complete seu perfil{"\n"}
            4. Comece a usar o Joga Junto!
          </Text>
        </View>
      </View>
    </View>
  );
}
