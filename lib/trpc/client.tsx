"use client";
// ^-- to make sure we can mount the Provider from a server component
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { httpBatchStreamLink, httpLink, isNonJsonSerializable, splitLink, } from "@trpc/client";
import { createTRPCReact, type inferReactQueryProcedureOptions, } from "@trpc/react-query";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { ReactNode } from "react";
import env from "@/lib/utils/env";
import { makeQueryClient } from "./query-client";
import type { AppRouter } from "./router";

export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export const trpc = createTRPCReact<AppRouter>();
let clientQueryClientSingleton: QueryClient;
function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  if (!clientQueryClientSingleton)
    clientQueryClientSingleton = makeQueryClient();
  return clientQueryClientSingleton;
}
function getUrl() {
  const base = (() => {
    if (typeof window !== "undefined") return "";
    if (env.appUrl) return env.appUrl;
    return "http://localhost:3000";
  })();
  return `${base}/api/trpc`;
}
export function TRPCProvider(
  props: Readonly<{
    children: ReactNode;
  }>,
) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();
  const trpcClient = trpc.createClient({
    links: [
      splitLink({
        condition: (op) => isNonJsonSerializable(op.input),
        true: httpLink({
          url: getUrl(),
        }),
        false: httpBatchStreamLink({
          url: getUrl(),
        }),
      }),
    ],
  });
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration>
          {props.children}
          <ReactQueryDevtools initialIsOpen={false} />
        </ReactQueryStreamedHydration>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
