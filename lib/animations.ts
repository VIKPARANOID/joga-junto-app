// ⚽ JOGA JUNTO - ANIMATION SYSTEM ⚽
// Sistema de animações RPG com react-native-reanimated

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  Easing,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

// ============ ANIMAÇÃO DE LEVEL UP ============

export const useLevelUpAnimation = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const rotateZ = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotateZ: `${rotateZ.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  const startAnimation = () => {
    scale.value = 0.5;
    opacity.value = 1;
    rotateZ.value = 0;

    scale.value = withSequence(
      withSpring(1.3, { damping: 5, mass: 1, overshootClamping: false }),
      withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) })
    );

    rotateZ.value = withTiming(360, {
      duration: 800,
      easing: Easing.out(Easing.quad),
    });

    setTimeout(() => {
      opacity.value = withTiming(0, { duration: 500 });
    }, 1500);
  };

  return { animatedStyle, startAnimation };
};

// ============ ANIMAÇÃO DE AURA BRILHANDO ============

export const useAuraAnimation = () => {
  const opacity = useSharedValue(0.3);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const startAnimation = () => {
    opacity.value = withSequence(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.sin) })
    );
  };

  return { animatedStyle, startAnimation };
};

// ============ ANIMAÇÃO DE PRESSÃO (BOUNCE) ============

export const usePressAnimation = () => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const onPressIn = () => {
    scale.value = withTiming(0.95, {
      duration: 100,
      easing: Easing.out(Easing.quad),
    });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, {
      damping: 8,
      mass: 1,
      overshootClamping: false,
    });
  };

  return { animatedStyle, onPressIn, onPressOut };
};

// ============ ANIMAÇÃO DE TRANSIÇÃO DE TELA ============

export const useScreenTransition = () => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  const startAnimation = () => {
    opacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });

    translateY.value = withTiming(0, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
  };

  return { animatedStyle, startAnimation };
};

// ============ ANIMAÇÃO DE BARRA DE PROGRESSO ============

export const useProgressAnimation = (progress: number) => {
  const width = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${width.value}%`,
    };
  });

  const updateProgress = (newProgress: number) => {
    width.value = withTiming(newProgress, {
      duration: 500,
      easing: Easing.out(Easing.quad),
    });
  };

  return { animatedStyle, updateProgress };
};

// ============ ANIMAÇÃO DE ROTAÇÃO INFINITA ============

export const useSpinAnimation = () => {
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  const startAnimation = () => {
    rotation.value = withSequence(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear,
      }),
      withTiming(0, { duration: 0 })
    );
  };

  return { animatedStyle, startAnimation };
};

// ============ ANIMAÇÃO DE CONFETE (PARTICLES) ============

export interface ConfettiParticle {
  id: string;
  x: any;
  y: any;
  opacity: any;
  rotation: any;
}

export const useConfettiAnimation = (particleCount: number = 20) => {
  const particles: ConfettiParticle[] = Array.from({ length: particleCount }).map(
    (_, i) => ({
      id: `particle-${i}`,
      x: useSharedValue(Math.random() * 200 - 100),
      y: useSharedValue(0),
      opacity: useSharedValue(1),
      rotation: useSharedValue(0),
    })
  );

  const startAnimation = () => {
    particles.forEach((particle) => {
      // Queda
      particle.y.value = withTiming(400, {
        duration: 2000,
        easing: Easing.in(Easing.quad),
      });

      // Rotação
      particle.rotation.value = withTiming(720, {
        duration: 2000,
        easing: Easing.linear,
      });

      // Fade out
      particle.opacity.value = withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0, { duration: 500 })
      );
    });
  };

  return { particles, startAnimation };
};

// ============ ANIMAÇÃO DE SHAKE ============

export const useShakeAnimation = () => {
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const startAnimation = () => {
    translateX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  return { animatedStyle, startAnimation };
};

// ============ ANIMAÇÃO DE PULSAÇÃO ============

export const usePulseAnimation = () => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const startAnimation = () => {
    scale.value = withSequence(
      withTiming(1.1, { duration: 500, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 500, easing: Easing.in(Easing.quad) })
    );
  };

  return { animatedStyle, startAnimation };
};

// ============ ANIMAÇÃO DE SLIDE IN ============

export const useSlideInAnimation = (direction: "left" | "right" | "up" | "down" = "left") => {
  const offset = useSharedValue(direction === "left" ? -100 : direction === "right" ? 100 : direction === "up" ? -100 : 100);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const isHorizontal = direction === "left" || direction === "right";
    return {
      opacity: opacity.value,
      transform: isHorizontal
        ? [{ translateX: offset.value }]
        : [{ translateY: offset.value }],
    };
  });

  const startAnimation = () => {
    offset.value = withTiming(0, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });

    opacity.value = withTiming(1, {
      duration: 400,
    });
  };

  return { animatedStyle, startAnimation };
};
