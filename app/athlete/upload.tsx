import { ScrollView, Text, View, Pressable, Alert, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface VideoValidation {
  format: boolean;
  duration: boolean;
  size: boolean;
  lighting: boolean;
  movement: boolean;
}

export default function AthleteUploadScreen() {
  const colors = useColors();
  const [selectedVideo, setSelectedVideo] = useState<{
    name: string;
    size: number;
    uri: string;
    duration?: number;
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validation, setValidation] = useState<VideoValidation>({
    format: false,
    duration: false,
    size: false,
    lighting: false,
    movement: false,
  });

  const uploadVideoMutation = trpc.video.uploadAndAnalyze.useMutation();

  const pickVideo = async () => {
    Alert.alert(
      "Selecionar Vídeo",
      "Escolha um vídeo de seus treinos",
      [
        {
          text: "Simular Upload",
          onPress: () => {
            // Simular seleção de vídeo com validações
            const mockVideo = {
              name: "treino_velocidade.mp4",
              size: 45 * 1024 * 1024,
              uri: "file:///mock/video.mp4",
              duration: 25, // segundos
            };
            setSelectedVideo(mockVideo);
            validateVideo(mockVideo);
          },
        },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  const validateVideo = (video: typeof selectedVideo) => {
    if (!video) return;

    // Validar formato
    const isValidFormat = video.name.endsWith(".mp4") || video.name.endsWith(".mov");

    // Validar duração (máx 30s)
    const isValidDuration = (video.duration || 0) <= 30 && (video.duration || 0) > 3;

    // Validar tamanho (máx 100MB)
    const isValidSize = video.size <= 100 * 1024 * 1024;

    // Simular validações de iluminação e movimento
    // Em produção, usar análise de frame
    const isValidLighting = Math.random() > 0.3; // 70% chance
    const isValidMovement = Math.random() > 0.2; // 80% chance

    setValidation({
      format: isValidFormat,
      duration: isValidDuration,
      size: isValidSize,
      lighting: isValidLighting,
      movement: isValidMovement,
    });
  };

  const allValidationsPass = Object.values(validation).every((v) => v);

  const handleUpload = async () => {
    if (!selectedVideo) {
      Alert.alert("Erro", "Selecione um vídeo primeiro");
      return;
    }

    if (!allValidationsPass) {
      Alert.alert(
        "Vídeo não atende aos critérios",
        "Por favor, revise as recomendações abaixo e tente novamente"
      );
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 30;
        });
      }, 500);

      // Upload do vídeo
      await uploadVideoMutation.mutateAsync({
        videoUrl: selectedVideo.uri,
        fileName: selectedVideo.name,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      Alert.alert(
        "Sucesso! 🎉",
        "Vídeo enviado! Nossa IA está analisando seus movimentos...\n\nVocê receberá os resultados em breve."
      );

      // Limpar seleção
      setSelectedVideo(null);
      setUploadProgress(0);
      setValidation({
        format: false,
        duration: false,
        size: false,
        lighting: false,
        movement: false,
      });
    } catch (error) {
      Alert.alert("Erro", "Falha ao fazer upload do vídeo. Tente novamente.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="p-6 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Enviar Vídeo</Text>
            <Text className="text-base text-muted">
              Grave um vídeo de seus treinos e receba análise de desempenho
            </Text>
          </View>

          {/* Instructions Card */}
          <View 
            className="rounded-2xl p-4 gap-3 border"
            style={{ backgroundColor: colors.surface, borderColor: colors.border }}
          >
            <Text className="font-bold text-foreground text-base">📹 Como Gravar</Text>
            
            <View className="gap-2">
              <View className="flex-row gap-2">
                <Text className="text-base">💡</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground text-sm">Iluminação</Text>
                  <Text className="text-xs text-muted">Ambiente bem iluminado, sem sombras</Text>
                </View>
              </View>

              <View className="flex-row gap-2">
                <Text className="text-base">📍</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground text-sm">Posicionamento</Text>
                  <Text className="text-xs text-muted">Câmera lateral, corpo inteiro visível</Text>
                </View>
              </View>

              <View className="flex-row gap-2">
                <Text className="text-base">⏱️</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground text-sm">Duração</Text>
                  <Text className="text-xs text-muted">Máximo 30 segundos</Text>
                </View>
              </View>

              <View className="flex-row gap-2">
                <Text className="text-base">🏃</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground text-sm">Movimento</Text>
                  <Text className="text-xs text-muted">Sprint, drible ou passe</Text>
                </View>
              </View>

              <View className="flex-row gap-2">
                <Text className="text-base">🎬</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground text-sm">Fundo</Text>
                  <Text className="text-xs text-muted">Fundo neutro e sem obstáculos</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Video Selection */}
          {!selectedVideo ? (
            <Pressable
              onPress={pickVideo}
              disabled={uploading}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  borderColor: colors.primary,
                },
              ]}
              className="rounded-2xl p-8 items-center justify-center border-2 border-dashed"
            >
              <Text className="text-5xl mb-3">📱</Text>
              <Text className="text-base font-semibold text-foreground text-center">
                Selecionar Vídeo
              </Text>
              <Text className="text-xs text-muted text-center mt-2">
                MP4 ou MOV, máx 100MB
              </Text>
            </Pressable>
          ) : (
            <View className="gap-3">
              {/* Selected Video Info */}
              <View 
                className="rounded-2xl p-4 gap-2 border"
                style={{ backgroundColor: colors.surface, borderColor: colors.border }}
              >
                <View className="flex-row items-center gap-2">
                  <Text className="text-2xl">✅</Text>
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground text-sm">
                      {selectedVideo.name}
                    </Text>
                    <Text className="text-xs text-muted">
                      {(selectedVideo.size / (1024 * 1024)).toFixed(1)} MB • {selectedVideo.duration}s
                    </Text>
                  </View>
                </View>
              </View>

              {/* Validation Checklist */}
              <View 
                className="rounded-2xl p-4 gap-3 border"
                style={{ backgroundColor: colors.surface, borderColor: colors.border }}
              >
                <Text className="font-bold text-foreground text-base">✓ Validação</Text>
                
                <ValidationItem 
                  label="Formato (MP4/MOV)"
                  valid={validation.format}
                />
                <ValidationItem 
                  label="Duração (3-30s)"
                  valid={validation.duration}
                />
                <ValidationItem 
                  label="Tamanho (<100MB)"
                  valid={validation.size}
                />
                <ValidationItem 
                  label="Iluminação adequada"
                  valid={validation.lighting}
                />
                <ValidationItem 
                  label="Movimento detectado"
                  valid={validation.movement}
                />
              </View>

              {/* Recommendations */}
              {!allValidationsPass && (
                <View 
                  className="rounded-2xl p-4 gap-2 border-l-4"
                  style={{ 
                    backgroundColor: colors.error + "20",
                    borderLeftColor: colors.error 
                  }}
                >
                  <Text className="font-semibold text-error text-sm">⚠️ Recomendações</Text>
                  {!validation.lighting && (
                    <Text className="text-xs text-error">• Melhor iluminação necessária</Text>
                  )}
                  {!validation.movement && (
                    <Text className="text-xs text-error">• Mais movimento detectado</Text>
                  )}
                  {!validation.format && (
                    <Text className="text-xs text-error">• Formato de vídeo inválido</Text>
                  )}
                  {!validation.duration && (
                    <Text className="text-xs text-error">• Duração fora do intervalo (3-30s)</Text>
                  )}
                  {!validation.size && (
                    <Text className="text-xs text-error">• Arquivo muito grande</Text>
                  )}
                </View>
              )}

              {/* Upload Progress */}
              {uploading && (
                <View className="gap-2">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-foreground">
                      Enviando...
                    </Text>
                    <Text className="text-sm text-muted">
                      {Math.round(uploadProgress)}%
                    </Text>
                  </View>
                  <View 
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: colors.border }}
                  >
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${uploadProgress}%`,
                        backgroundColor: colors.primary,
                      }}
                    />
                  </View>
                </View>
              )}

              {/* Action Buttons */}
              <View className="gap-2">
                <Pressable
                  onPress={handleUpload}
                  disabled={uploading || !allValidationsPass}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.8 : 1,
                      backgroundColor: allValidationsPass ? colors.primary : colors.border,
                    },
                  ]}
                  className="rounded-lg py-4 items-center"
                >
                  {uploading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-semibold text-base">
                      {allValidationsPass ? "Enviar Vídeo" : "Vídeo não atende critérios"}
                    </Text>
                  )}
                </Pressable>

                <Pressable
                  onPress={() => {
                    setSelectedVideo(null);
                    setValidation({
                      format: false,
                      duration: false,
                      size: false,
                      lighting: false,
                      movement: false,
                    });
                  }}
                  disabled={uploading}
                  className="rounded-lg py-3 items-center border"
                  style={{ borderColor: colors.border }}
                >
                  <Text className="text-foreground font-semibold">Escolher Outro</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

// Componente de validação
function ValidationItem({ label, valid }: { label: string; valid: boolean }) {
  const colors = useColors();
  return (
    <View className="flex-row items-center gap-2">
      <Text className="text-lg">{valid ? "✅" : "❌"}</Text>
      <Text className={`text-sm ${valid ? "text-foreground" : "text-error"}`}>
        {label}
      </Text>
    </View>
  );
}
