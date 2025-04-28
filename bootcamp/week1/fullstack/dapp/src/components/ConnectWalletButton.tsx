import { Address } from "viem";
import React from "react";

interface ConnectWalletButtonProps {
  account: Address | null;
  error: string | null;
  connectWallet: () => Promise<void>;
}

export function ConnectWalletButton({
  account,
  error,
  connectWallet,
}: ConnectWalletButtonProps) {

  console.log("foi")
  return (
    <div>
      <button onClick={connectWallet}>Conectar MetaMask</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
