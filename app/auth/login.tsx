import { View, Text, Pressable, ScrollView, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useState } from "react";
import { LoadingScreen } from "@/components/loading-spinner";
import { ErrorBanner } from "@/components/error-screen";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from "@/hooks/use-auth";

export default function LoginScreen() {
  const router = useRouter();
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

      // Abrir OAuth flow
      const result = await WebBrowser.openAuthSessionAsync(
        "https://api.manus.im/oauth/authorize?client_id=joga-junto&response_type=code&redirect_uri=exp://localhost:8081/oauth",
        "exp://localhost:8081/oauth"
      );

      if (result.type === "success") {
        // OAuth foi bem-sucedido, usuário será redirecionado automaticamente
        router.replace("/user-type-selection");
      } else if (result.type === "cancel") {
        setError("Login cancelado");
      }
    } catch (err) {
      setError("Erro ao fazer login com Google");
      console.error("Google Sign-In error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError("Preencha email e senha");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // TODO: Implementar autenticação por email
      // Por enquanto, mostrar mensagem
      setError("Autenticação por email em desenvolvimento");
    } catch (err) {
      setError("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <LoadingScreen message={isSignUp ? "Criando conta..." : "Fazendo login..."} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center gap-8">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-5xl">⚽</Text>
            <Text className="text-2xl font-bold text-foreground">Joga Junto</Text>
            <Text className="text-sm text-muted">
              {isSignUp ? "Crie sua conta" : "Faça login"}
            </Text>
          </View>

          {/* Error Banner */}
          {error && (
            <ErrorBanner
              message={error}
              type="error"
              onDismiss={() => setError(null)}
            />
          )}

          {/* Email/Password Form */}
          <View className="gap-4">
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Email</Text>
              <TextInput
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                editable={!isLoading}
                placeholderTextColor="#687076"
                className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Senha</Text>
              <TextInput
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
                placeholderTextColor="#687076"
                className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
              />
            </View>

            <Pressable
              onPress={handleEmailLogin}
              disabled={isLoading}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              className="bg-primary py-3 px-6 rounded-lg items-center mt-2"
            >
              <Text className="text-white font-semibold">
                {isSignUp ? "Criar Conta" : "Entrar"}
              </Text>
            </Pressable>
          </View>

          {/* Divider */}
          <View className="flex-row items-center gap-4">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-xs text-muted">OU</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Google Sign-In */}
          <Pressable
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            className="border border-border rounded-lg py-3 px-6 items-center flex-row justify-center gap-2"
          >
            <Text className="text-lg">🔐</Text>
            <Text className="text-foreground font-semibold">
              Continuar com Google
            </Text>
          </Pressable>

          {/* Toggle Sign Up / Login */}
          <View className="items-center gap-2 mt-4">
            <Text className="text-sm text-muted">
              {isSignUp ? "Já tem conta?" : "Não tem conta?"}
            </Text>
            <Pressable
              onPress={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              disabled={isLoading}
            >
              <Text className="text-sm font-semibold text-primary">
                {isSignUp ? "Faça login" : "Cadastre-se"}
              </Text>
            </Pressable>
          </View>

          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            disabled={isLoading}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            className="items-center mt-4"
          >
            <Text className="text-sm text-muted">← Voltar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
