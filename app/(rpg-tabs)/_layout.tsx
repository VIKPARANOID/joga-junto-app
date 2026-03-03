import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Platform, Text, View } from "react-native";
import { useColors } from "@/hooks/use-colors";

export default function RPGTabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 64 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🏠</Text>
          ),
        }}
      />

      {/* RPG Profile */}
      <Tabs.Screen
        name="rpg-profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>⚽</Text>
          ),
        }}
      />

      {/* Customization */}
      <Tabs.Screen
        name="avatar-customization"
        options={{
          title: "Avatar",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🎨</Text>
          ),
        }}
      />

      {/* Leaderboard */}
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Ranking",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🏆</Text>
          ),
        }}
      />

      {/* Settings */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Config",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>⚙️</Text>
          ),
        }}
      />
    </Tabs>
  );
}
