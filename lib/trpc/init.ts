import { auth, currentUser } from "@clerk/nextjs/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { initTRPC, TRPCError } from "@trpc/server";
import { db } from "@/lib/db";
import { transformer } from "@/lib/utils/transformer";

export const createTRPCContext = async () => {
  return {
    auth: await auth(),
    currentUser: await currentUser(),
    filestore: (await getCloudflareContext({async: true})).env.FILES,
    db: db(),
  };
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer,
});

// Check if the user is signed in
// Otherwise, throw an UNAUTHORIZED code
const isAuthed = t.middleware(({next, ctx}) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({code: "UNAUTHORIZED"});
  }
  return next({
    ctx: {
      auth: ctx.auth,
      currentUser: ctx.currentUser,
    },
  });
});

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(isAuthed);
