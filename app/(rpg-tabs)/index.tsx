import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useScreenTransition } from "@/lib/animations";

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { animatedStyle, startAnimation } = useScreenTransition();
  const [isLoaded, setIsLoaded] = useState(false);

  // Iniciar animação ao montar
  React.useEffect(() => {
    if (!isLoaded) {
      startAnimation();
      setIsLoaded(true);
    }
  }, []);

  const handleStartGame = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/class-selection");
  };

  const handleDemoAthlete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/demo-athlete");
  };

  const handleDemoScout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/demo-scout");
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <Animated.View style={animatedStyle} className="flex-1 p-6 gap-6">
          {/* Header */}
          <View className="items-center gap-2 py-4">
            <Text className="text-6xl">⚽</Text>
            <Text className="text-4xl font-bold text-foreground">
              Joga Junto
            </Text>
            <Text className="text-sm text-muted text-center">
              Análise de desempenho de atletas com IA
            </Text>
          </View>

          {/* CTA Buttons */}
          <View className="gap-3">
            <Pressable
              onPress={handleStartGame}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
              className="bg-blue-500 rounded-2xl p-6 gap-2"
            >
              <Text className="text-2xl">⚔️</Text>
              <Text className="text-lg font-bold text-white">
                Começar Jogo RPG
              </Text>
              <Text className="text-sm text-white opacity-90">
                Escolha sua classe e comece sua jornada
              </Text>
            </Pressable>

            <Pressable
              onPress={handleDemoAthlete}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
              className="bg-orange-500 rounded-2xl p-6 gap-2"
            >
              <Text className="text-2xl">📹</Text>
              <Text className="text-lg font-bold text-white">
                Demo do Atleta
              </Text>
              <Text className="text-sm text-white opacity-90">
                Veja como funciona o upload de vídeo e análise de KPIs
              </Text>
            </Pressable>

            <Pressable
              onPress={handleDemoScout}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
              className="bg-green-500 rounded-2xl p-6 gap-2"
            >
              <Text className="text-2xl">👁️</Text>
              <Text className="text-lg font-bold text-white">
                Demo do Olheiro
              </Text>
              <Text className="text-sm text-white opacity-90">
                Explore o dashboard com filtros e ranking de atletas
              </Text>
            </Pressable>
          </View>

          {/* Features */}
          <View className="gap-4">
            <Text className="text-xl font-bold text-foreground">
              ✨ Funcionalidades
            </Text>

            <View className="gap-3">
              <FeatureItem
                icon="📹"
                title="Upload de Vídeo"
                description="Grave treinos e receba análise automática"
              />
              <FeatureItem
                icon="📊"
                title="KPIs de Desempenho"
                description="Velocidade, agilidade, intensidade e mais"
              />
              <FeatureItem
                icon="🔍"
                title="Dashboard de Olheiros"
                description="Filtros avançados e ranking de atletas"
              />
              <FeatureItem
                icon="🤖"
                title="IA & Visão Computacional"
                description="MediaPipe para análise de movimento"
              />
              <FeatureItem
                icon="🏆"
                title="Sistema RPG"
                description="Ganhe XP, suba de nível e customize seu avatar"
              />
            </View>
          </View>

          {/* Footer */}
          <View className="items-center gap-2 py-4">
            <Text className="text-xs text-muted">
              MVP - Versão de Demonstração
            </Text>
            <Text className="text-xs text-muted">
              Todos os dados são simulados
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  const colors = useColors();

  return (
    <View
      className="flex-row gap-3 p-4 rounded-lg"
      style={{ backgroundColor: colors.surface }}
    >
      <Text className="text-2xl">{icon}</Text>
      <View className="flex-1">
        <Text className="text-sm font-bold text-foreground">{title}</Text>
        <Text className="text-xs text-muted mt-1">{description}</Text>
      </View>
    </View>
  );
}
