import React, { createContext, useContext, useEffect, useState } from "react";
import {
  PlayerData,
  getPlayerData,
  savePlayerData,
  createDefaultPlayerData,
  updatePlayerXP,
  updatePlayerClass,
  unlockItem,
  equipItem,
  unlockAchievement,
  updateSettings,
} from "./storage";

interface PlayerContextType {
  player: PlayerData | null;
  isLoading: boolean;
  addXP: (amount: number) => Promise<void>;
  changeClass: (newClass: string) => Promise<void>;
  unlockNewItem: (itemId: string) => Promise<void>;
  equipNewItem: (category: string, itemId: string) => Promise<void>;
  unlockNewAchievement: (achievementId: string) => Promise<void>;
  updatePlayerSettings: (
    sound: boolean,
    haptics: boolean,
    notifications: boolean
  ) => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do jogador ao iniciar
  useEffect(() => {
    const loadPlayer = async () => {
      try {
        let data = await getPlayerData();
        if (!data) {
          // Criar novo jogador se não existir
          data = createDefaultPlayerData();
          await savePlayerData(data);
        }
        setPlayer(data);
      } catch (error) {
        console.error("Erro ao carregar dados do jogador:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlayer();
  }, []);

  const addXP = async (amount: number) => {
    const updated = await updatePlayerXP(amount);
    if (updated) setPlayer(updated);
  };

  const changeClass = async (newClass: string) => {
    const updated = await updatePlayerClass(newClass);
    if (updated) setPlayer(updated);
  };

  const unlockNewItem = async (itemId: string) => {
    const updated = await unlockItem(itemId);
    if (updated) setPlayer(updated);
  };

  const equipNewItem = async (category: string, itemId: string) => {
    const updated = await equipItem(category, itemId);
    if (updated) setPlayer(updated);
  };

  const unlockNewAchievement = async (achievementId: string) => {
    const updated = await unlockAchievement(achievementId);
    if (updated) setPlayer(updated);
  };

  const updatePlayerSettings = async (
    sound: boolean,
    haptics: boolean,
    notifications: boolean
  ) => {
    const updated = await updateSettings(sound, haptics, notifications);
    if (updated) setPlayer(updated);
  };

  return (
    <PlayerContext.Provider
      value={{
        player,
        isLoading,
        addXP,
        changeClass,
        unlockNewItem,
        equipNewItem,
        unlockNewAchievement,
        updatePlayerSettings,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer deve ser usado dentro de PlayerProvider");
  }
  return context;
}
