// ⚽ JOGA JUNTO - RPG SYSTEM ⚽
// Sistema de classes, experiência e habilidades

export type PositionClass = "Atacante" | "Meia" | "Lateral" | "Goleiro";

export interface RPGClass {
  id: PositionClass;
  name: string;
  emoji: string;
  description: string;
  color: string;
  baseAttributes: {
    strength: number; // Força (Finalizações)
    agility: number; // Agilidade (Drible)
    intelligence: number; // Inteligência (Passe)
    defense: number; // Defesa (Marcação)
    stamina: number; // Resistência (Corrida)
    speed: number; // Velocidade (Sprint)
  };
  specialAbilities: Ability[];
}

export interface Ability {
  id: string;
  name: string;
  emoji: string;
  description: string;
  cooldown: number; // segundos
  xpRequired: number;
  effect: string;
}

export interface PlayerProfile {
  id: string;
  name: string;
  class: PositionClass;
  level: number;
  currentXP: number;
  totalXP: number;
  attributes: {
    strength: number;
    agility: number;
    intelligence: number;
    defense: number;
    stamina: number;
    speed: number;
  };
  unlockedAbilities: string[];
  equipment: Equipment[];
  achievements: Achievement[];
  stats: {
    videosUploaded: number;
    totalDistance: number;
    totalSprints: number;
    averageVelocity: number;
    passAccuracy: number;
  };
}

export interface Equipment {
  id: string;
  name: string;
  emoji: string;
  type: "shoes" | "uniform" | "accessory";
  bonus: {
    attribute: keyof PlayerProfile["attributes"];
    value: number;
  };
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlockedAt: number; // timestamp
  reward: number; // XP
}

// ============ CLASSES DO RPG ============

export const RPG_CLASSES: Record<PositionClass, RPGClass> = {
  Atacante: {
    id: "Atacante",
    name: "Atacante",
    emoji: "⚔️",
    description: "Especialista em finalizações e gols. Alto dano, baixa defesa.",
    color: "#EF4444",
    baseAttributes: {
      strength: 90,
      agility: 85,
      intelligence: 70,
      defense: 50,
      stamina: 80,
      speed: 95,
    },
    specialAbilities: [
      {
        id: "finalizador",
        name: "Finalizador",
        emoji: "🎯",
        description: "Aumenta precisão de chutes em 40%",
        cooldown: 30,
        xpRequired: 0,
        effect: "passAccuracy +40",
      },
      {
        id: "acelerador",
        name: "Acelerador",
        emoji: "⚡",
        description: "Aumenta velocidade em 25% por 10s",
        cooldown: 45,
        xpRequired: 500,
        effect: "speed +25",
      },
      {
        id: "goleador",
        name: "Goleador",
        emoji: "🏆",
        description: "Próximo chute tem 2x de dano",
        cooldown: 60,
        xpRequired: 1500,
        effect: "strength +100",
      },
    ],
  },
  Meia: {
    id: "Meia",
    name: "Meia",
    emoji: "🎭",
    description: "Maestro do jogo. Equilibrado em tudo, especialista em passes.",
    color: "#F59E0B",
    baseAttributes: {
      strength: 75,
      agility: 85,
      intelligence: 95,
      defense: 70,
      stamina: 90,
      speed: 80,
    },
    specialAbilities: [
      {
        id: "maestro",
        name: "Maestro",
        emoji: "🎼",
        description: "Aumenta precisão de passes em 35%",
        cooldown: 30,
        xpRequired: 0,
        effect: "intelligence +35",
      },
      {
        id: "visao_de_jogo",
        name: "Visão de Jogo",
        emoji: "👁️",
        description: "Vê todos os companheiros no mapa",
        cooldown: 40,
        xpRequired: 800,
        effect: "intelligence +50",
      },
      {
        id: "maestria_total",
        name: "Maestria Total",
        emoji: "✨",
        description: "Todos os passes são perfeitos por 15s",
        cooldown: 60,
        xpRequired: 2000,
        effect: "intelligence +100",
      },
    ],
  },
  Lateral: {
    id: "Lateral",
    name: "Lateral",
    emoji: "🛡️",
    description: "Defensor versátil. Bom em defesa e ataque, resistente.",
    color: "#3B82F6",
    baseAttributes: {
      strength: 80,
      agility: 80,
      intelligence: 75,
      defense: 90,
      stamina: 95,
      speed: 85,
    },
    specialAbilities: [
      {
        id: "bloqueador",
        name: "Bloqueador",
        emoji: "🚫",
        description: "Reduz dano recebido em 50%",
        cooldown: 35,
        xpRequired: 0,
        effect: "defense +50",
      },
      {
        id: "contra_ataque",
        name: "Contra-Ataque",
        emoji: "⚡",
        description: "Transforma defesa em ataque rápido",
        cooldown: 40,
        xpRequired: 700,
        effect: "speed +40",
      },
      {
        id: "muralha",
        name: "Muralha",
        emoji: "🧱",
        description: "Defesa impenetrável por 20s",
        cooldown: 60,
        xpRequired: 1800,
        effect: "defense +100",
      },
    ],
  },
  Goleiro: {
    id: "Goleiro",
    name: "Goleiro",
    emoji: "🧤",
    description: "Guardião da meta. Defesa suprema, baixo ataque.",
    color: "#10B981",
    baseAttributes: {
      strength: 85,
      agility: 75,
      intelligence: 70,
      defense: 100,
      stamina: 70,
      speed: 60,
    },
    specialAbilities: [
      {
        id: "defesa_impenetravel",
        name: "Defesa Impenetrável",
        emoji: "🛡️",
        description: "Bloqueia 100% dos ataques por 5s",
        cooldown: 45,
        xpRequired: 0,
        effect: "defense +100",
      },
      {
        id: "reflexo_felino",
        name: "Reflexo Felino",
        emoji: "🐱",
        description: "Aumenta agilidade em 50%",
        cooldown: 40,
        xpRequired: 600,
        effect: "agility +50",
      },
      {
        id: "mestre_da_defesa",
        name: "Mestre da Defesa",
        emoji: "👑",
        description: "Defesa máxima e contra-ataque automático",
        cooldown: 60,
        xpRequired: 2200,
        effect: "defense +150",
      },
    ],
  },
};

// ============ SISTEMA DE EXPERIÊNCIA ============

export const XP_LEVELS = [
  0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500, 6600, 7800, 9100,
  10500, 12000, 13600, 15300, 17100, 19000,
];

export const getLevel = (totalXP: number): number => {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= XP_LEVELS[i]) {
      return i + 1;
    }
  }
  return 1;
};

export const getXPForNextLevel = (currentLevel: number): number => {
  if (currentLevel >= XP_LEVELS.length) return XP_LEVELS[XP_LEVELS.length - 1];
  return XP_LEVELS[currentLevel];
};

export const getXPProgress = (totalXP: number): { current: number; next: number; percentage: number } => {
  const level = getLevel(totalXP);
  const currentLevelXP = level === 1 ? 0 : XP_LEVELS[level - 2];
  const nextLevelXP = XP_LEVELS[level - 1];
  const current = totalXP - currentLevelXP;
  const next = nextLevelXP - currentLevelXP;
  return {
    current,
    next,
    percentage: (current / next) * 100,
  };
};

// ============ EQUIPAMENTOS ============

export const EQUIPMENT_SHOP: Equipment[] = [
  {
    id: "chuteira_velocidade",
    name: "Chuteira da Velocidade",
    emoji: "👟",
    type: "shoes",
    bonus: { attribute: "speed", value: 10 },
    rarity: "common",
  },
  {
    id: "chuteira_força",
    name: "Chuteira da Força",
    emoji: "👞",
    type: "shoes",
    bonus: { attribute: "strength", value: 15 },
    rarity: "rare",
  },
  {
    id: "uniforme_lendario",
    name: "Uniforme Lendário",
    emoji: "👕",
    type: "uniform",
    bonus: { attribute: "defense", value: 20 },
    rarity: "legendary",
  },
  {
    id: "fita_agilidade",
    name: "Fita da Agilidade",
    emoji: "🎀",
    type: "accessory",
    bonus: { attribute: "agility", value: 12 },
    rarity: "rare",
  },
];

// ============ ACHIEVEMENTS ============

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "primeiro_video",
    name: "Primeiro Passo",
    emoji: "🎬",
    description: "Envie seu primeiro vídeo",
    unlockedAt: 0,
    reward: 50,
  },
  {
    id: "velocista",
    name: "Velocista",
    emoji: "⚡",
    description: "Atinja 30 km/h de velocidade",
    unlockedAt: 0,
    reward: 100,
  },
  {
    id: "maestro",
    name: "Maestro",
    emoji: "🎼",
    description: "Atinja 90% de precisão de passes",
    unlockedAt: 0,
    reward: 150,
  },
  {
    id: "level_10",
    name: "Veterano",
    emoji: "🏆",
    description: "Alcance o nível 10",
    unlockedAt: 0,
    reward: 200,
  },
];

// ============ FUNÇÕES AUXILIARES ============

export const calculateAttributeBonus = (equipment: Equipment[]): Record<string, number> => {
  const bonus: Record<string, number> = {};
  equipment.forEach((item) => {
    bonus[item.bonus.attribute] = (bonus[item.bonus.attribute] || 0) + item.bonus.value;
  });
  return bonus;
};

export const getAttributeColor = (attribute: keyof PlayerProfile["attributes"]): string => {
  const colors: Record<string, string> = {
    strength: "#EF4444",
    agility: "#F59E0B",
    intelligence: "#3B82F6",
    defense: "#10B981",
    stamina: "#8B5CF6",
    speed: "#EC4899",
  };
  return colors[attribute] || "#6B7280";
};

export const getAttributeName = (attribute: keyof PlayerProfile["attributes"]): string => {
  const names: Record<string, string> = {
    strength: "Força",
    agility: "Agilidade",
    intelligence: "Inteligência",
    defense: "Defesa",
    stamina: "Resistência",
    speed: "Velocidade",
  };
  return names[attribute] || attribute;
};
