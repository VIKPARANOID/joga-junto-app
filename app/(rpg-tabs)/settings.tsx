import { ScrollView, Text, View, Pressable, Switch } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useState } from "react";

export default function SettingsScreen() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleToggleTheme = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Implementar toggle de tema
  };

  const handleToggleSound = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSoundEnabled(!soundEnabled);
  };

  const handleToggleHaptics = () => {
    setHapticsEnabled(!hapticsEnabled);
  };

  const handleToggleNotifications = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="p-6 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              ⚙️ Configurações
            </Text>
            <Text className="text-sm text-muted">
              Personalize sua experiência no Joga Junto
            </Text>
          </View>

          {/* Aparência */}
          <View className="gap-4">
            <Text className="text-lg font-bold text-foreground">
              🎨 Aparência
            </Text>

            <SettingItem
              icon="🌙"
              title="Modo Escuro"
              description={`Atualmente: ${colorScheme === "dark" ? "Ativado" : "Desativado"}`}
              action={
                <Pressable
                  onPress={handleToggleTheme}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.8 : 1,
                      backgroundColor: colors.primary,
                    },
                  ]}
                  className="px-4 py-2 rounded-lg"
                >
                  <Text className="text-white font-bold text-sm">
                    {colorScheme === "dark" ? "Desativar" : "Ativar"}
                  </Text>
                </Pressable>
              }
            />
          </View>

          {/* Som e Vibração */}
          <View className="gap-4">
            <Text className="text-lg font-bold text-foreground">
              🔊 Som e Vibração
            </Text>

            <SettingToggle
              icon="🔊"
              title="Som"
              description="Efeitos sonoros do jogo"
              value={soundEnabled}
              onToggle={handleToggleSound}
            />

            <SettingToggle
              icon="📳"
              title="Vibração (Haptics)"
              description="Feedback tátil ao interagir"
              value={hapticsEnabled}
              onToggle={handleToggleHaptics}
            />
          </View>

          {/* Notificações */}
          <View className="gap-4">
            <Text className="text-lg font-bold text-foreground">
              🔔 Notificações
            </Text>

            <SettingToggle
              icon="🔔"
              title="Notificações Push"
              description="Receba alertas de novos desafios"
              value={notificationsEnabled}
              onToggle={handleToggleNotifications}
            />
          </View>

          {/* Sobre */}
          <View className="gap-4">
            <Text className="text-lg font-bold text-foreground">
              ℹ️ Sobre
            </Text>

            <SettingItem
              icon="📱"
              title="Versão do App"
              description="1.0.0 (MVP)"
            />

            <SettingItem
              icon="🏢"
              title="Desenvolvido por"
              description="Manus AI"
            />

            <SettingItem
              icon="📧"
              title="Suporte"
              description="contato@jogajunto.com"
            />
          </View>

          {/* Dados */}
          <View className="gap-4">
            <Text className="text-lg font-bold text-foreground">
              💾 Dados
            </Text>

            <Pressable
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  backgroundColor: colors.surface,
                },
              ]}
              className="p-4 rounded-lg border border-border flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">🗑️</Text>
                <View>
                  <Text className="text-sm font-bold text-foreground">
                    Limpar Cache
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    Remove dados temporários
                  </Text>
                </View>
              </View>
              <Text className="text-lg">→</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  backgroundColor: colors.surface,
                },
              ]}
              className="p-4 rounded-lg border border-border flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">🔄</Text>
                <View>
                  <Text className="text-sm font-bold text-foreground">
                    Resetar Progresso
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    Volta ao início do jogo
                  </Text>
                </View>
              </View>
              <Text className="text-lg">→</Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View className="items-center gap-2 py-6">
            <Text className="text-xs text-muted text-center">
              Joga Junto © 2026
            </Text>
            <Text className="text-xs text-muted text-center">
              Análise de desempenho de atletas com IA
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function SettingItem({
  icon,
  title,
  description,
  action,
}: {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  const colors = useColors();

  return (
    <View
      className="p-4 rounded-lg flex-row items-center justify-between"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-row items-center gap-3 flex-1">
        <Text className="text-2xl">{icon}</Text>
        <View className="flex-1">
          <Text className="text-sm font-bold text-foreground">{title}</Text>
          <Text className="text-xs text-muted mt-1">{description}</Text>
        </View>
      </View>
      {action}
    </View>
  );
}

function SettingToggle({
  icon,
  title,
  description,
  value,
  onToggle,
}: {
  icon: string;
  title: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}) {
  const colors = useColors();

  return (
    <View
      className="p-4 rounded-lg flex-row items-center justify-between"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-row items-center gap-3 flex-1">
        <Text className="text-2xl">{icon}</Text>
        <View className="flex-1">
          <Text className="text-sm font-bold text-foreground">{title}</Text>
          <Text className="text-xs text-muted mt-1">{description}</Text>
        </View>
      </View>
      <Switch value={value} onValueChange={onToggle} />
    </View>
  );
}
