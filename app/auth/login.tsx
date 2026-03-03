import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useState } from "react";
import { LoadingScreen } from "@/components/loading-spinner";
import { ErrorBanner } from "@/components/error-screen";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from "@/hooks/use-auth";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

export default function LoginScreen() {
  const router = useRouter();
  const colors = useColors();
  const { isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Se já está autenticado, redirecionar
  if (isAuthenticated && !loading) {
    router.replace("/user-type-selection");
    return null;
  }

  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <LoadingScreen message="Carregando..." />
      </ScreenContainer>
    );
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // CRITICO: Usar scheme dinamico em vez de hardcoded localhost
      const redirectUri = "exp://localhost:8081/oauth";
      const authUrl = `https://api.manus.im/oauth/authorize?client_id=joga-junto&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (result.type === "success") {
        router.replace("/user-type-selection");
      } else if (result.type === "cancel") {
        setError("Login cancelado");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login com Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError("Preencha email e senha");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email inválido");
      return;
    }

    if (password.length < 6) {
      setError("Senha deve ter no mínimo 6 caracteres");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (isSignUp) {
        setError("Signup por email em desenvolvimento. Use Google Sign-In por enquanto.");
      } else {
        setError("Login por email em desenvolvimento. Use Google Sign-In por enquanto.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-between py-8 px-6">
          {/* Header */}
          <View className="items-center gap-4">
            <View className="w-20 h-20 rounded-full bg-primary items-center justify-center mb-2">
              <Text className="text-4xl">⚽</Text>
            </View>
            <Text className="text-3xl font-bold text-foreground">Joga Junto</Text>
            <Text className="text-base text-muted text-center">
              Análise de desempenho com IA para atletas
            </Text>
          </View>

          {/* Error Banner */}
          {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

          {/* Form */}
          <View className="gap-4">
            {/* Email Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Email</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                placeholder="seu@email.com"
                placeholderTextColor={colors.muted}
                value={email}
                onChangeText={setEmail}
                editable={!isLoading}
                keyboardType="email-address"
              />
            </View>

            {/* Password Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Senha</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={colors.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="bg-primary rounded-lg py-4 items-center mt-2 active:opacity-80"
              onPress={handleEmailLogin}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold text-base">
                {isSignUp ? "Criar Conta" : "Entrar"}
              </Text>
            </TouchableOpacity>

            {/* Toggle Signup/Login */}
            <TouchableOpacity
              onPress={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              disabled={isLoading}
            >
              <Text className="text-center text-muted text-sm">
                {isSignUp ? "Já tem conta? " : "Não tem conta? "}
                <Text className="text-primary font-semibold">
                  {isSignUp ? "Entrar" : "Cadastrar"}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="flex-row items-center gap-3 my-2">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-muted text-xs">OU</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Google Sign-In */}
          <TouchableOpacity
            className="border border-border rounded-lg py-4 items-center flex-row justify-center gap-2 active:opacity-80"
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Text className="text-2xl">🔵</Text>
            <Text className="text-foreground font-semibold">Continuar com Google</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View className="items-center gap-2">
            <Text className="text-xs text-muted text-center">
              Ao entrar, você concorda com nossos Termos de Serviço
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
