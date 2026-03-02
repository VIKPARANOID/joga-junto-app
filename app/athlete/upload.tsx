import { useState } from "react";
import { ScrollView, Text, View, Pressable, Alert, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";

export default function AthleteUploadScreen() {
  const [selectedVideo, setSelectedVideo] = useState<{
    name: string;
    size: number;
    uri: string;
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadVideoMutation = trpc.video.uploadAndAnalyze.useMutation();

  const pickVideo = async () => {
    // Simular seleção de vídeo
    // Em produção, usar expo-document-picker ou expo-image-picker
    Alert.alert(
      "Selecionar Vídeo",
      "Em produção, isso abrirá o seletor de arquivos do dispositivo",
      [
        {
          text: "Simular Upload",
          onPress: () => {
            setSelectedVideo({
              name: "treino_velocidade.mp4",
              size: 45 * 1024 * 1024,
              uri: "file:///mock/video.mp4",
            });
          },
        },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  const handleUpload = async () => {
    if (!selectedVideo) {
      Alert.alert("Erro", "Selecione um vídeo primeiro");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
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
        "Sucesso",
        "Vídeo enviado! Nossa IA está analisando seus movimentos..."
      );

      // Limpar seleção
      setSelectedVideo(null);
      setUploadProgress(0);
    } catch (error) {
      Alert.alert("Erro", "Falha ao fazer upload do vídeo");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-foreground">
            Desafio de Velocidade
          </Text>
          <Text className="text-muted mt-2">
            Grave um vídeo e veja sua análise de desempenho
          </Text>
        </View>

        {/* Card Explicativo */}
        <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <Text className="text-sm font-semibold text-blue-900 mb-3">
            📹 Como Gravar o Vídeo
          </Text>
          <View className="space-y-2">
            <Text className="text-xs text-blue-800">
              • Grave um vídeo de 10 metros de lado para a câmera
            </Text>
            <Text className="text-xs text-blue-800">
              • Certifique-se de que seu corpo inteiro apareça no quadro
            </Text>
            <Text className="text-xs text-blue-800">
              • Boa iluminação é importante para a IA funcionar bem
            </Text>
            <Text className="text-xs text-blue-800">
              • Máximo 30 segundos e 100MB
            </Text>
          </View>
        </View>

        {/* Seleção de Vídeo */}
        <View className="mb-8">
          {selectedVideo ? (
            <View className="bg-green-50 border border-green-200 rounded-lg p-4">
              <Text className="text-sm font-semibold text-green-900 mb-2">
                ✓ Vídeo Selecionado
              </Text>
              <Text className="text-xs text-green-800 mb-1">
                Nome: {selectedVideo.name}
              </Text>
              <Text className="text-xs text-green-800">
                Tamanho: {(selectedVideo.size / 1024 / 1024).toFixed(2)} MB
              </Text>
            </View>
          ) : (
            <Pressable
              onPress={pickVideo}
              disabled={uploading}
              className="border-2 border-dashed border-primary rounded-lg p-8 items-center justify-center"
            >
              <Text className="text-4xl mb-3">📱</Text>
              <Text className="text-lg font-semibold text-primary text-center">
                Selecionar Vídeo
              </Text>
              <Text className="text-xs text-muted text-center mt-2">
                MP4, MOV, AVI ou MKV
              </Text>
            </Pressable>
          )}
        </View>

        {/* Barra de Progresso */}
        {uploading && (
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-medium text-foreground">
                Analisando...
              </Text>
              <Text className="text-sm font-medium text-primary">
                {Math.round(uploadProgress)}%
              </Text>
            </View>
            <View className="h-2 bg-surface rounded-full overflow-hidden">
              <View
                className="h-full bg-primary rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </View>
            <Text className="text-xs text-muted mt-3 text-center">
              Nossa IA está analisando seus movimentos... Aguarde.
            </Text>
          </View>
        )}

        {/* Botões */}
        <View className="gap-3">
          {selectedVideo && !uploading && (
            <Pressable
              onPress={handleUpload}
              className="bg-primary py-4 px-6 rounded-lg"
            >
              <Text className="text-white font-semibold text-center text-lg">
                Enviar e Analisar
              </Text>
            </Pressable>
          )}

          {selectedVideo && !uploading && (
            <Pressable
              onPress={() => setSelectedVideo(null)}
              className="bg-surface py-4 px-6 rounded-lg border border-border"
            >
              <Text className="text-foreground font-semibold text-center">
                Selecionar Outro Vídeo
              </Text>
            </Pressable>
          )}

          {!selectedVideo && !uploading && (
            <Pressable
              onPress={pickVideo}
              className="bg-primary py-4 px-6 rounded-lg"
            >
              <Text className="text-white font-semibold text-center text-lg">
                Escolher Vídeo
              </Text>
            </Pressable>
          )}
        </View>

        {/* Info */}
        <View className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-8">
          <Text className="text-xs text-amber-900">
            ⚠️ Dica: Quanto melhor a qualidade do vídeo, mais precisa será a análise da IA.
          </Text>
        </View>

        <View className="h-8" />
      </ScrollView>
    </ScreenContainer>
  );
}
