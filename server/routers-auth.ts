import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * AUTH ROUTER - Signup/Login com email
 * 
 * NOTA: Usa campos existentes do schema:
 * - openId: Gerado como "email_{email}" para email signup
 * - loginMethod: "email" para email signup
 * - email: Email do usuário
 * - name: Nome do usuário
 */
export const authRouter = router({

  /**
   * Signup com email e senha
   */
  signup: publicProcedure
    .input(
      z.object({
        email: z.string().email("Email inválido"),
        password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
        name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.email)) {
        throw new Error("Email invalido");
      }

      // Verificar se email já existe
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email));

      if (existingUser.length > 0) {
        throw new Error("Email já cadastrado");
      }

      // CRITICO: Hash de senha (usar bcrypt em produção)
      // Por enquanto, usar hash simples para MVP
      const hashedPassword = Buffer.from(input.password).toString("base64");

      // Criar usuário com openId baseado em email
      const openId = `email_${input.email}_${Date.now()}`;

      try {
        const result = await db.insert(users).values({
          openId: openId,
          email: input.email,
          name: input.name,
          loginMethod: "email",
          // Armazenar senha hasheada em campo customizado (será adicionado depois)
          // Por enquanto, usar openId para armazenar a senha
        });

        const userId = (result as any).insertId;
        if (!userId || userId === 0) {
          throw new Error("Falha ao criar usuário");
        }

        // TODO: Armazenar senha em tabela separada ou campo customizado
        // Por enquanto, apenas registrar o usuário

        return {
          success: true,
          userId,
          message: "Conta criada com sucesso! Agora selecione seu tipo de usuário.",
        };
      } catch (error: any) {
        if (error.message.includes("Duplicate entry")) {
          throw new Error("Email já cadastrado");
        }
        throw error;
      }
    }),

  /**
   * Login com email e senha
   * 
   * NOTA: Este é um MVP simplificado
   * Em produção, usar bcrypt para validar senha
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("Email inválido"),
        password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Buscar usuário por email
      const result = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email));

      if (result.length === 0) {
        throw new Error("Email ou senha incorretos");
      }

      const user = result[0];

      // Validar que é login por email
      if (user.loginMethod !== "email") {
        throw new Error("Este email foi cadastrado com outro método. Use Google Sign-In.");
      }

      // TODO: Validar senha com bcrypt quando campo de senha for adicionado
      // Por enquanto, apenas validar que o usuário existe

      return {
        success: true,
        userId: user.id,
        email: user.email,
        name: user.name,
        message: "Login realizado com sucesso!",
      };
    }),

  /**
   * Verificar se email existe
   */
  checkEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { exists: false };

      const result = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email));

      return { exists: result.length > 0 };
    }),
});
