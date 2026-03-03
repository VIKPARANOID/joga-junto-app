import { useRouter } from "expo-router";
import { useState } from "react";
import { LoadingScreen } from "@/components/loading-spinner";
import { ErrorBanner } from "@/components/error-screen";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";
import * as Haptics from "expo-haptics";

export default function LoginScreen() {
  const router = useRouter();
  const colors = useColors();
  const { isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mutations tRPC
  const loginMutation = trpc.auth.login.useMutation();
  const signupMutation = trpc.auth.signup.useMutation();

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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailAuth = async () => {
    // Validações
    if (!email || !password) {
      setError("Preencha email e senha");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email inválido");
      return;
    }

    if (password.length < 6) {
      setError("Senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (isSignUp && !name) {
      setError("Preencha seu nome");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (isSignUp) {
        // Signup
        console.log("[LoginScreen] Attempting signup with:", { email, name });
        await signupMutation.mutateAsync({
          email,
          password,
          name,
        });
        console.log("[LoginScreen] Signup successful, redirecting to user-type-selection");
        router.replace("/user-type-selection");
      } else {
        // Login
        console.log("[LoginScreen] Attempting login with:", { email });
        await loginMutation.mutateAsync({
          email,
          password,
        });
        console.log("[LoginScreen] Login successful, redirecting to user-type-selection");
        router.replace("/user-type-selection");
      }
    } catch (err: any) {
      console.error("[LoginScreen] Auth error:", err);
      const errorMessage = err.message || (isSignUp ? "Erro ao criar conta" : "Erro ao fazer login");
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-between py-8 px-6">
          {/* Header */}
          <View className="items-center gap-4">
            <View className="w-20 h-20 rounded-full items-center justify-center mb-2" style={{ backgroundColor: colors.primary }}>
              <Text className="text-4xl">⚽</Text>
            </View>
            <Text className="text-3xl font-bold text-foreground">Joga Junto</Text>
            <Text className="text-base text-muted text-center">
              {isSignUp ? "Crie sua conta" : "Análise de desempenho com IA para atletas"}
            </Text>
          </View>

          {/* Error Banner */}
          {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

          {/* Form */}
          <View className="gap-4">
            {/* Name Input (only for signup) */}
            {isSignUp && (
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Nome Completo</Text>
                <TextInput
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                  placeholder="Seu nome"
                  placeholderTextColor={colors.muted}
                  value={name}
                  onChangeText={setName}
                  editable={!isLoading}
                />
              </View>
            )}

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
                autoCapitalize="none"
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

            {/* Auth Button */}
            <TouchableOpacity
              className="rounded-lg py-4 items-center mt-2 active:opacity-80"
              onPress={handleEmailAuth}
              disabled={isLoading}
              style={{ backgroundColor: colors.primary }}
            >
              {isLoading ? (
                <Text className="text-white font-semibold text-base">Aguarde...</Text>
              ) : (
                <Text className="text-white font-semibold text-base">
                  {isSignUp ? "Criar Conta" : "Entrar"}
                </Text>
              )}
            </TouchableOpacity>

            {/* Toggle Signup/Login */}
            <TouchableOpacity
              onPress={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setName("");
                setEmail("");
                setPassword("");
              }}
              disabled={isLoading}
            >
              <Text className="text-center text-muted text-sm">
                {isSignUp ? "Já tem conta? " : "Não tem conta? "}
                <Text style={{ color: colors.primary }} className="font-semibold">
                  {isSignUp ? "Entrar" : "Cadastrar"}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

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
