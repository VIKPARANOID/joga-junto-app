// ⚽ JOGA JUNTO - STORAGE SYSTEM ⚽
// Sistema de persistência com AsyncStorage

import AsyncStorage from "@react-native-async-storage/async-storage";

export interface PlayerData {
  id: string;
  name: string;
  class: string;
  currentXP: number;
  level: number;
  totalXP: number;
  equippedItems: Record<string, string>;
  unlockedItems: string[];
  achievements: string[];
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  notificationsEnabled: boolean;
  createdAt: string;
  lastPlayedAt: string;
}

const STORAGE_KEYS = {
  PLAYER_DATA: "joga_junto_player_data",
  SETTINGS: "joga_junto_settings",
  ACHIEVEMENTS: "joga_junto_achievements",
};

// ============ PLAYER DATA ============

export const savePlayerData = async (data: PlayerData): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.PLAYER_DATA,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error("Erro ao salvar dados do jogador:", error);
  }
};

export const getPlayerData = async (): Promise<PlayerData | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PLAYER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Erro ao carregar dados do jogador:", error);
    return null;
  }
};

export const createDefaultPlayerData = (): PlayerData => {
  return {
    id: `player_${Date.now()}`,
    name: "João Silva",
    class: "Atacante",
    currentXP: 0,
    level: 1,
    totalXP: 0,
    equippedItems: {
      shoes: "default-shoes",
      uniforms: "default-uniform",
      auras: "none",
      accessories: "none",
    },
    unlockedItems: ["default-shoes", "default-uniform"],
    achievements: [],
    soundEnabled: true,
    hapticsEnabled: true,
    notificationsEnabled: true,
    createdAt: new Date().toISOString(),
    lastPlayedAt: new Date().toISOString(),
  };
};

// ============ UPDATE PLAYER XP ============

export const updatePlayerXP = async (xpToAdd: number): Promise<PlayerData | null> => {
  try {
    const currentData = await getPlayerData();
    if (!currentData) return null;

    const newXP = currentData.currentXP + xpToAdd;
    const newTotalXP = currentData.totalXP + xpToAdd;

    // Calcular novo nível (100 XP por nível)
    const newLevel = Math.floor(newTotalXP / 100) + 1;

    const updatedData: PlayerData = {
      ...currentData,
      currentXP: newXP % 100, // Reset XP para próximo nível
      level: newLevel,
      totalXP: newTotalXP,
      lastPlayedAt: new Date().toISOString(),
    };

    await savePlayerData(updatedData);
    return updatedData;
  } catch (error) {
    console.error("Erro ao atualizar XP:", error);
    return null;
  }
};

// ============ UPDATE PLAYER CLASS ============

export const updatePlayerClass = async (newClass: string): Promise<PlayerData | null> => {
  try {
    const currentData = await getPlayerData();
    if (!currentData) return null;

    const updatedData: PlayerData = {
      ...currentData,
      class: newClass,
      lastPlayedAt: new Date().toISOString(),
    };

    await savePlayerData(updatedData);
    return updatedData;
  } catch (error) {
    console.error("Erro ao atualizar classe:", error);
    return null;
  }
};

// ============ UNLOCK ITEM ============

export const unlockItem = async (itemId: string): Promise<PlayerData | null> => {
  try {
    const currentData = await getPlayerData();
    if (!currentData) return null;

    if (currentData.unlockedItems.includes(itemId)) {
      return currentData; // Já desbloqueado
    }

    const updatedData: PlayerData = {
      ...currentData,
      unlockedItems: [...currentData.unlockedItems, itemId],
      lastPlayedAt: new Date().toISOString(),
    };

    await savePlayerData(updatedData);
    return updatedData;
  } catch (error) {
    console.error("Erro ao desbloquear item:", error);
    return null;
  }
};

// ============ EQUIP ITEM ============

export const equipItem = async (
  category: string,
  itemId: string
): Promise<PlayerData | null> => {
  try {
    const currentData = await getPlayerData();
    if (!currentData) return null;

    const updatedData: PlayerData = {
      ...currentData,
      equippedItems: {
        ...currentData.equippedItems,
        [category]: itemId,
      },
      lastPlayedAt: new Date().toISOString(),
    };

    await savePlayerData(updatedData);
    return updatedData;
  } catch (error) {
    console.error("Erro ao equipar item:", error);
    return null;
  }
};

// ============ UNLOCK ACHIEVEMENT ============

export const unlockAchievement = async (achievementId: string): Promise<PlayerData | null> => {
  try {
    const currentData = await getPlayerData();
    if (!currentData) return null;

    if (currentData.achievements.includes(achievementId)) {
      return currentData; // Já desbloqueado
    }

    const updatedData: PlayerData = {
      ...currentData,
      achievements: [...currentData.achievements, achievementId],
      lastPlayedAt: new Date().toISOString(),
    };

    await savePlayerData(updatedData);
    return updatedData;
  } catch (error) {
    console.error("Erro ao desbloquear achievement:", error);
    return null;
  }
};

// ============ UPDATE SETTINGS ============

export const updateSettings = async (
  soundEnabled: boolean,
  hapticsEnabled: boolean,
  notificationsEnabled: boolean
): Promise<PlayerData | null> => {
  try {
    const currentData = await getPlayerData();
    if (!currentData) return null;

    const updatedData: PlayerData = {
      ...currentData,
      soundEnabled,
      hapticsEnabled,
      notificationsEnabled,
      lastPlayedAt: new Date().toISOString(),
    };

    await savePlayerData(updatedData);
    return updatedData;
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error);
    return null;
  }
};

// ============ RESET PLAYER DATA ============

export const resetPlayerData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.PLAYER_DATA);
  } catch (error) {
    console.error("Erro ao resetar dados do jogador:", error);
  }
};

// ============ CLEAR ALL DATA ============

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.PLAYER_DATA,
      STORAGE_KEYS.SETTINGS,
      STORAGE_KEYS.ACHIEVEMENTS,
    ]);
  } catch (error) {
    console.error("Erro ao limpar todos os dados:", error);
  }
};
