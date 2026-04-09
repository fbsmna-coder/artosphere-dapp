"use client";

import { ReactNode, useState } from "react";
import { WagmiProvider, http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";

const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    coinbaseWallet({ appName: "Artosphere DApp" }),
    ...(process.env.NEXT_PUBLIC_WC_PROJECT_ID
      ? [walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID })]
      : []),
  ],
  transports: {
    [base.id]: http("https://mainnet.base.org"),
  },
  ssr: true,
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000, // 30s before refetch
            gcTime: 300_000, // 5min garbage collection
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
