import { View, Text, ScrollView, Pressable } from "react-native";

interface VideoHistoryItem {
  id: string;
  date: string;
  maxSpeedKmh: number;
  agilityScore: number;
  intensityScore: number;
  duration: number;
}

interface VideoHistoryProps {
  videos: VideoHistoryItem[];
  onSelectVideo?: (videoId: string) => void;
}

export function VideoHistory({ videos, onSelectVideo }: VideoHistoryProps) {
  if (videos.length === 0) {
    return (
      <View className="bg-surface rounded-lg p-6 items-center">
        <Text className="text-muted text-center">Nenhum vídeo analisado ainda</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
      {videos.map((video, index) => (
        <Pressable
          key={video.id}
          onPress={() => onSelectVideo?.(video.id)}
          className="bg-white border border-border rounded-lg p-4 min-w-[160px]"
        >
          {/* Data */}
          <Text className="text-xs text-muted mb-2">
            {new Date(video.date).toLocaleDateString("pt-BR")}
          </Text>

          {/* Velocidade Máxima */}
          <View className="mb-2">
            <Text className="text-xs text-muted">Velocidade</Text>
            <Text className="text-lg font-bold text-primary">
              {video.maxSpeedKmh.toFixed(1)} km/h
            </Text>
          </View>

          {/* Agilidade */}
          <View className="mb-2">
            <Text className="text-xs text-muted">Agilidade</Text>
            <Text className="text-sm font-semibold text-foreground">
              {video.agilityScore.toFixed(0)}/100
            </Text>
          </View>

          {/* Duração */}
          <View>
            <Text className="text-xs text-muted">Duração</Text>
            <Text className="text-sm font-semibold text-foreground">
              {video.duration}s
            </Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}
