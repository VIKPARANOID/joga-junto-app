import { View, Text, Pressable, Share, Alert } from "react-native";
import { LevelBadge } from "./level-badge";

interface PublicProfileHeaderProps {
  athleteName: string;
  age: number;
  position: string;
  height: number;
  maxSpeedKmh: number;
  profileUrl: string;
  onShare?: () => void;
}

export function PublicProfileHeader({
  athleteName,
  age,
  position,
  height,
  maxSpeedKmh,
  profileUrl,
  onShare,
}: PublicProfileHeaderProps) {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Confira o perfil de ${athleteName} no Joga Junto!\n${profileUrl}`,
        title: `Perfil de ${athleteName}`,
        url: profileUrl,
      });
      onShare?.();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível compartilhar o perfil");
    }
  };

  const handleCopyLink = async () => {
    // TODO: Implementar cópia para clipboard
    Alert.alert("Link copiado", "URL do perfil copiada para a área de transferência");
  };

  return (
    <View className="bg-gradient-to-b from-primary to-blue-600 px-6 py-8 rounded-b-3xl">
      {/* Avatar e Info Básica */}
      <View className="items-center mb-6">
        {/* Avatar Placeholder */}
        <View className="w-24 h-24 rounded-full bg-white/20 items-center justify-center mb-4">
          <Text className="text-5xl">⚽</Text>
        </View>

        {/* Nome */}
        <Text className="text-3xl font-bold text-white text-center mb-2">
          {athleteName}
        </Text>

        {/* Dados Básicos */}
        <View className="flex-row gap-4 mb-4">
          <View className="items-center">
            <Text className="text-white/80 text-xs">Idade</Text>
            <Text className="text-white font-semibold">{age} anos</Text>
          </View>
          <View className="w-px bg-white/30" />
          <View className="items-center">
            <Text className="text-white/80 text-xs">Posição</Text>
            <Text className="text-white font-semibold">{position}</Text>
          </View>
          <View className="w-px bg-white/30" />
          <View className="items-center">
            <Text className="text-white/80 text-xs">Altura</Text>
            <Text className="text-white font-semibold">{height} cm</Text>
          </View>
        </View>

        {/* Badge de Nível */}
        <View className="mb-4">
          <LevelBadge maxSpeedKmh={maxSpeedKmh} />
        </View>
      </View>

      {/* Botões de Ação */}
      <View className="flex-row gap-3">
        {/* Compartilhar */}
        <Pressable
          onPress={handleShare}
          className="flex-1 bg-white/20 py-3 px-4 rounded-lg flex-row items-center justify-center gap-2"
        >
          <Text className="text-lg">📤</Text>
          <Text className="text-white font-semibold">Compartilhar</Text>
        </Pressable>

        {/* Copiar Link */}
        <Pressable
          onPress={handleCopyLink}
          className="flex-1 bg-white/20 py-3 px-4 rounded-lg flex-row items-center justify-center gap-2"
        >
          <Text className="text-lg">🔗</Text>
          <Text className="text-white font-semibold">Copiar Link</Text>
        </Pressable>
      </View>

      {/* Indicador de Perfil Público */}
      <View className="mt-4 bg-white/10 rounded-lg p-2 flex-row items-center gap-2">
        <Text className="text-lg">🔓</Text>
        <Text className="text-white text-xs">Perfil Público - Visível para Olheiros</Text>
      </View>
    </View>
  );
}
