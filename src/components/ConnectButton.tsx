"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="px-6 py-2.5 rounded-xl font-semibold text-sm
          bg-gradient-to-r from-amber-500 to-yellow-400
          text-black hover:from-amber-400 hover:to-yellow-300
          transition-all duration-200 shadow-lg shadow-amber-500/20
          hover:shadow-amber-500/40 active:scale-95"
      >
        {address.slice(0, 6)}...{address.slice(-4)}
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        const connector = connectors[0];
        if (connector) connect({ connector });
      }}
      className="px-6 py-2.5 rounded-xl font-semibold text-sm
        bg-gradient-to-r from-amber-500 to-yellow-400
        text-black hover:from-amber-400 hover:to-yellow-300
        transition-all duration-200 shadow-lg shadow-amber-500/20
        hover:shadow-amber-500/40 active:scale-95"
    >
      Connect Wallet
    </button>
  );
}
