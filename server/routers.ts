import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { athleteRouter, clubRouter, userTypeRouter } from "./routers-joga-junto";
import { videoRouter } from "./routers-video";
import { publicRouter } from "./routers-public";
import { authRouter } from "./routers-auth";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    // Email signup/login procedures
    signup: authRouter._def.procedures.signup,
    login: authRouter._def.procedures.login,
    checkEmail: authRouter._def.procedures.checkEmail,
  }),

  athlete: athleteRouter,
  club: clubRouter,
  userType: userTypeRouter,
  video: videoRouter,
  public: publicRouter,
});

export type AppRouter = typeof appRouter;
