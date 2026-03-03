// ⚽ JOGA JUNTO - AVATAR SYSTEM ⚽
// Sistema de personagem 2D personalizável com equipamentos

export type AvatarPart = "body" | "shoes" | "uniform" | "accessory" | "aura";

export interface AvatarItem {
  id: string;
  name: string;
  part: AvatarPart;
  color: string;
  pattern?: "solid" | "gradient" | "striped";
  emoji: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  effect?: "glow" | "spin" | "bounce" | "wings";
  unlockedAt?: number;
}

export interface PlayerAvatar {
  id: string;
  playerId: string;
  body: AvatarItem;
  shoes: AvatarItem;
  uniform: AvatarItem;
  accessories: AvatarItem[];
  aura?: AvatarItem;
  skinColor: string;
  hairColor: string;
  hairStyle: "short" | "medium" | "long" | "curly";
}

// ============ AVATAR ITEMS PADRÃO ============

export const DEFAULT_AVATAR_ITEMS: Record<string, AvatarItem> = {
  // CORPOS
  body_default: {
    id: "body_default",
    name: "Corpo Padrão",
    part: "body",
    color: "#F5DEB3",
    emoji: "🧍",
    rarity: "common",
  },

  // UNIFORMES
  uniform_azul: {
    id: "uniform_azul",
    name: "Uniforme Azul",
    part: "uniform",
    color: "#0a7ea4",
    pattern: "solid",
    emoji: "👕",
    rarity: "common",
  },
  uniform_verde: {
    id: "uniform_verde",
    name: "Uniforme Verde",
    part: "uniform",
    color: "#10B981",
    pattern: "solid",
    emoji: "👕",
    rarity: "common",
  },
  uniform_lendario: {
    id: "uniform_lendario",
    name: "Uniforme Lendário",
    part: "uniform",
    color: "#FFD700",
    pattern: "gradient",
    emoji: "👑",
    rarity: "legendary",
    effect: "glow",
  },

  // CHUTEIRAS - PADRÃO OURO (VELOCIDADE)
  shoes_gold_velocity: {
    id: "shoes_gold_velocity",
    name: "Chuteira Ouro - Velocista",
    part: "shoes",
    color: "#FFD700",
    pattern: "solid",
    emoji: "👟",
    rarity: "legendary",
    effect: "wings",
    unlockedAt: 0,
  },

  // CHUTEIRAS - PADRÃO PRATA (RESISTÊNCIA)
  shoes_silver_stamina: {
    id: "shoes_silver_stamina",
    name: "Chuteira Prata - Resistência",
    part: "shoes",
    color: "#C0C0C0",
    pattern: "solid",
    emoji: "👞",
    rarity: "rare",
    effect: "glow",
    unlockedAt: 500,
  },

  // CHUTEIRAS - PADRÃO BRONZE (FORÇA)
  shoes_bronze_strength: {
    id: "shoes_bronze_strength",
    name: "Chuteira Bronze - Força",
    part: "shoes",
    color: "#CD7F32",
    pattern: "solid",
    emoji: "👞",
    rarity: "rare",
    effect: "bounce",
    unlockedAt: 300,
  },

  // CHUTEIRAS COMUNS
  shoes_red: {
    id: "shoes_red",
    name: "Chuteira Vermelha",
    part: "shoes",
    color: "#EF4444",
    pattern: "solid",
    emoji: "👟",
    rarity: "common",
  },
  shoes_black: {
    id: "shoes_black",
    name: "Chuteira Preta",
    part: "shoes",
    color: "#1F2937",
    pattern: "solid",
    emoji: "👟",
    rarity: "common",
  },

  // ACESSÓRIOS
  aura_speed: {
    id: "aura_speed",
    name: "Aura de Velocidade",
    part: "aura",
    color: "#FFD700",
    emoji: "⚡",
    rarity: "legendary",
    effect: "spin",
    unlockedAt: 1000,
  },
  aura_power: {
    id: "aura_power",
    name: "Aura de Poder",
    part: "aura",
    color: "#EF4444",
    emoji: "💥",
    rarity: "epic",
    effect: "bounce",
    unlockedAt: 800,
  },
  aura_shield: {
    id: "aura_shield",
    name: "Aura de Proteção",
    part: "aura",
    color: "#10B981",
    emoji: "🛡️",
    rarity: "epic",
    effect: "glow",
    unlockedAt: 600,
  },

  // ACESSÓRIOS ADICIONAIS
  headband_gold: {
    id: "headband_gold",
    name: "Fita Dourada",
    part: "accessory",
    color: "#FFD700",
    emoji: "🎀",
    rarity: "rare",
    unlockedAt: 400,
  },
  armband_silver: {
    id: "armband_silver",
    name: "Braçadeira Prata",
    part: "accessory",
    color: "#C0C0C0",
    emoji: "💍",
    rarity: "rare",
    unlockedAt: 350,
  },
};

// ============ PRESETS DE AVATAR ============

export const AVATAR_PRESETS: Record<string, PlayerAvatar> = {
  default: {
    id: "default",
    playerId: "demo",
    body: DEFAULT_AVATAR_ITEMS.body_default,
    shoes: DEFAULT_AVATAR_ITEMS.shoes_red,
    uniform: DEFAULT_AVATAR_ITEMS.uniform_azul,
    accessories: [],
    skinColor: "#F5DEB3",
    hairColor: "#3B2F2F",
    hairStyle: "short",
  },

  velocista_ouro: {
    id: "velocista_ouro",
    playerId: "demo",
    body: DEFAULT_AVATAR_ITEMS.body_default,
    shoes: DEFAULT_AVATAR_ITEMS.shoes_gold_velocity,
    uniform: DEFAULT_AVATAR_ITEMS.uniform_azul,
    accessories: [DEFAULT_AVATAR_ITEMS.headband_gold],
    aura: DEFAULT_AVATAR_ITEMS.aura_speed,
    skinColor: "#F5DEB3",
    hairColor: "#3B2F2F",
    hairStyle: "short",
  },

  resistencia_prata: {
    id: "resistencia_prata",
    playerId: "demo",
    body: DEFAULT_AVATAR_ITEMS.body_default,
    shoes: DEFAULT_AVATAR_ITEMS.shoes_silver_stamina,
    uniform: DEFAULT_AVATAR_ITEMS.uniform_verde,
    accessories: [DEFAULT_AVATAR_ITEMS.armband_silver],
    aura: DEFAULT_AVATAR_ITEMS.aura_shield,
    skinColor: "#F5DEB3",
    hairColor: "#3B2F2F",
    hairStyle: "medium",
  },

  forca_bronze: {
    id: "forca_bronze",
    playerId: "demo",
    body: DEFAULT_AVATAR_ITEMS.body_default,
    shoes: DEFAULT_AVATAR_ITEMS.shoes_bronze_strength,
    uniform: DEFAULT_AVATAR_ITEMS.uniform_azul,
    accessories: [],
    aura: DEFAULT_AVATAR_ITEMS.aura_power,
    skinColor: "#F5DEB3",
    hairColor: "#3B2F2F",
    hairStyle: "curly",
  },
};

// ============ LOJA DE CUSTOMIZAÇÃO ============

export const CUSTOMIZATION_SHOP: AvatarItem[] = [
  // Chuteiras
  DEFAULT_AVATAR_ITEMS.shoes_gold_velocity,
  DEFAULT_AVATAR_ITEMS.shoes_silver_stamina,
  DEFAULT_AVATAR_ITEMS.shoes_bronze_strength,
  DEFAULT_AVATAR_ITEMS.shoes_red,
  DEFAULT_AVATAR_ITEMS.shoes_black,

  // Uniformes
  DEFAULT_AVATAR_ITEMS.uniform_azul,
  DEFAULT_AVATAR_ITEMS.uniform_verde,
  DEFAULT_AVATAR_ITEMS.uniform_lendario,

  // Auras
  DEFAULT_AVATAR_ITEMS.aura_speed,
  DEFAULT_AVATAR_ITEMS.aura_power,
  DEFAULT_AVATAR_ITEMS.aura_shield,

  // Acessórios
  DEFAULT_AVATAR_ITEMS.headband_gold,
  DEFAULT_AVATAR_ITEMS.armband_silver,
];

// ============ FUNÇÕES AUXILIARES ============

export const getItemsByPart = (part: AvatarPart): AvatarItem[] => {
  return CUSTOMIZATION_SHOP.filter((item) => item.part === part);
};

export const isItemUnlocked = (item: AvatarItem, playerXP: number): boolean => {
  if (!item.unlockedAt) return true;
  return playerXP >= item.unlockedAt;
};

export const getUnlockProgress = (item: AvatarItem, playerXP: number): number => {
  if (!item.unlockedAt) return 100;
  if (playerXP >= item.unlockedAt) return 100;
  return (playerXP / item.unlockedAt) * 100;
};

export const getRarityColor = (rarity: string): string => {
  const colors: Record<string, string> = {
    common: "#6B7280",
    rare: "#3B82F6",
    epic: "#8B5CF6",
    legendary: "#F59E0B",
  };
  return colors[rarity] || "#6B7280";
};

export const getRarityEmoji = (rarity: string): string => {
  const emojis: Record<string, string> = {
    common: "⚪",
    rare: "🔵",
    epic: "🟣",
    legendary: "⭐",
  };
  return emojis[rarity] || "⚪";
};

export const getEffectAnimation = (effect?: string): string => {
  if (!effect) return "Nenhum";
  const animations: Record<string, string> = {
    glow: "Brilho",
    spin: "Rotação",
    bounce: "Pulo",
    wings: "Asas",
  };
  return animations[effect] || "Nenhum"
};

// ============ GERADOR DE SVG PARA AVATAR ============

export const generateAvatarSVG = (avatar: PlayerAvatar): string => {
  const width = 200;
  const height = 300;

  // Cores
  const skinColor = avatar.skinColor;
  const hairColor = avatar.hairColor;
  const shoesColor = avatar.shoes.color;
  const uniformColor = avatar.uniform.color;

  // SVG básico
  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;

  // Fundo
  svg += `<rect width="${width}" height="${height}" fill="#f0f0f0" rx="20"/>`;

  // Aura (se existir)
  if (avatar.aura) {
    svg += `<circle cx="100" cy="150" r="110" fill="${avatar.aura.color}" opacity="0.1" stroke="${avatar.aura.color}" stroke-width="2" stroke-dasharray="5,5"/>`;
  }

  // Cabeça
  svg += `<circle cx="100" cy="60" r="35" fill="${skinColor}"/>`;

  // Cabelo
  svg += `<path d="M 65 60 Q 65 25 100 25 Q 135 25 135 60" fill="${hairColor}"/>`;

  // Olhos
  svg += `<circle cx="90" cy="55" r="3" fill="black"/>`;
  svg += `<circle cx="110" cy="55" r="3" fill="black"/>`;

  // Boca
  svg += `<path d="M 90 70 Q 100 75 110 70" stroke="black" stroke-width="2" fill="none"/>`;

  // Corpo (Uniforme)
  svg += `<rect x="75" y="100" width="50" height="60" fill="${uniformColor}" rx="5"/>`;

  // Braços
  svg += `<rect x="50" y="105" width="25" height="45" fill="${skinColor}" rx="5"/>`;
  svg += `<rect x="125" y="105" width="25" height="45" fill="${skinColor}" rx="5"/>`;

  // Pernas
  svg += `<rect x="80" y="165" width="15" height="50" fill="${skinColor}" rx="3"/>`;
  svg += `<rect x="105" y="165" width="15" height="50" fill="${skinColor}" rx="3"/>`;

  // Chuteiras
  svg += `<ellipse cx="87" cy="220" rx="12" ry="8" fill="${shoesColor}"/>`;
  svg += `<ellipse cx="112" cy="220" rx="12" ry="8" fill="${shoesColor}"/>`;

  // Efeito de asas (se tiver chuteira ouro)
  if (avatar.shoes.effect === "wings") {
    svg += `<path d="M 75 210 L 70 200 L 75 205" fill="${shoesColor}" opacity="0.7"/>`;
    svg += `<path d="M 125 210 L 130 200 L 125 205" fill="${shoesColor}" opacity="0.7"/>`;
  }

  // Acessórios
  avatar.accessories.forEach((accessory, index) => {
    if (accessory && accessory.part === "accessory") {
      const offsetX = index === 0 ? -15 : 15;
      svg += `<circle cx="${100 + offsetX}" cy="100" r="8" fill="${accessory.color}" stroke="black" stroke-width="1"/>`;
    }
  });

  svg += `</svg>`;

  return svg;
};
