import { usePlayer } from "@/lib/player-context";
import { RPG_CLASSES, type PositionClass } from "@/lib/rpg-system";

export function useAthleteRPG() {
  const { player, isLoading } = usePlayer();

  if (isLoading || !player) {
    return {
      isLoading: true,
      player: null,
      athleteClass: null,
      athleteLevel: 1,
      athleteXP: 0,
      athleteStats: null,
      athleteAbilities: [],
      athleteEquipment: {},
    };
  }

  const athleteClass = player.class as PositionClass;
  const rpgClass = RPG_CLASSES[athleteClass];
  const athleteLevel = player.level;
  const athleteXP = player.currentXP;

  // Calcular estatísticas baseadas no nível
  const baseStats = rpgClass.baseAttributes;
  const levelBonus = (athleteLevel - 1) * 5; // 5 pontos por nível

  const athleteStats = {
    strength: baseStats.strength + levelBonus,
    agility: baseStats.agility + levelBonus,
    intelligence: baseStats.intelligence + levelBonus,
    defense: baseStats.defense + levelBonus,
    stamina: baseStats.stamina + levelBonus,
    speed: baseStats.speed + levelBonus,
  };

  // Habilidades desbloqueadas por XP
  const athleteAbilities = rpgClass.specialAbilities.filter(
    (ability) => ability.xpRequired <= player.totalXP
  );

  return {
    isLoading: false,
    player,
    athleteClass,
    athleteLevel,
    athleteXP,
    athleteStats,
    athleteAbilities,
    athleteEquipment: player.equippedItems,
  };
}
