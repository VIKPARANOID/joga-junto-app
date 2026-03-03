export const mockAthletes = [
  {
    id: 1,
    name: "João Silva",
    position: "Meia",
    age: 18,
    height: 175,
    weight: 72,
    dominantFoot: "Destro",
    velocity: 28.5,
    agility: 82,
    intensity: 85,
    sprints: 12,
    distance: 450,
    passAccuracy: 87,
    level: "Ouro",
    avatar: "🏃",
  },
  {
    id: 2,
    name: "Maria Santos",
    position: "Atacante",
    age: 19,
    height: 168,
    weight: 65,
    dominantFoot: "Esquerda",
    velocity: 31.2,
    agility: 88,
    intensity: 90,
    sprints: 15,
    distance: 520,
    passAccuracy: 82,
    level: "Ouro",
    avatar: "⚽",
  },
  {
    id: 3,
    name: "Pedro Costa",
    position: "Lateral",
    age: 17,
    height: 180,
    weight: 75,
    dominantFoot: "Destro",
    velocity: 25.8,
    agility: 75,
    intensity: 78,
    sprints: 8,
    distance: 380,
    passAccuracy: 79,
    level: "Prata",
    avatar: "🛡️",
  },
  {
    id: 4,
    name: "Ana Oliveira",
    position: "Meia",
    age: 18,
    height: 172,
    weight: 68,
    dominantFoot: "Destro",
    velocity: 26.5,
    agility: 80,
    intensity: 82,
    sprints: 10,
    distance: 420,
    passAccuracy: 85,
    level: "Prata",
    avatar: "👩",
  },
];

export const mockVideoHistory = [
  {
    id: 1,
    date: "2024-03-01",
    duration: 15,
    velocity: 28.5,
    agility: 82,
    intensity: 85,
  },
  {
    id: 2,
    date: "2024-02-28",
    duration: 20,
    velocity: 27.2,
    agility: 79,
    intensity: 83,
  },
  {
    id: 3,
    date: "2024-02-25",
    duration: 18,
    velocity: 29.1,
    agility: 84,
    intensity: 86,
  },
];

export const getLevelColor = (level: string) => {
  switch (level) {
    case "Ouro":
      return "#F59E0B"; // warning
    case "Prata":
      return "#0a7ea4"; // primary
    case "Bronze":
      return "#22C55E"; // success
    default:
      return "#0a7ea4";
  }
};

export const getLevelBadge = (level: string) => {
  switch (level) {
    case "Ouro":
      return "⭐";
    case "Prata":
      return "🥈";
    case "Bronze":
      return "🥉";
    default:
      return "📊";
  }
};
