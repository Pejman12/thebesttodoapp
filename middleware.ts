import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import env from "@/lib/utils/env";

const isProtectedRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(
  async (auth, req) => {
    const { userId, redirectToSignIn } = await auth();

    if (!userId && isProtectedRoute(req)) {
      // Add custom logic to run before redirecting

      return redirectToSignIn();
    }
  },
  {
    contentSecurityPolicy: {
      directives: {
        "img-src": [env.bucketUrl],
      },
    },
    authorizedParties: [env.appUrl],
  },
);
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
