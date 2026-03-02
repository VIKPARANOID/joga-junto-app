import { useAuth } from "./use-auth";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";

export type UserType = "athlete" | "club" | null;

/**
 * Hook customizado para autenticação do Joga Junto
 * Estende useAuth com informações de tipo de usuário (atleta/clube)
 */
export function useJogaJuntoAuth() {
  const auth = useAuth();
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoadingUserType, setIsLoadingUserType] = useState(true);

  const userTypeQuery = trpc.userType.getType.useQuery(undefined, {
    enabled: auth.isAuthenticated,
  });

  useEffect(() => {
    if (userTypeQuery.data) {
      setUserType(userTypeQuery.data.type as UserType);
      setIsLoadingUserType(false);
    }
  }, [userTypeQuery.data]);

  return {
    ...auth,
    userType,
    isLoadingUserType: auth.loading || isLoadingUserType,
    isAthleteProfile: userType === "athlete",
    isClubProfile: userType === "club",
  };
}
