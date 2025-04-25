import React from 'react';
import { Address } from 'viem';

interface ConnectWalletButtonProps {
  account: Address | null;
  error: string | null;
  connectWallet: () => Promise<void>;
}

export function ConnectWalletButton({ account, error, connectWallet }: ConnectWalletButtonProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      {!account && (
        <button
          onClick={connectWallet}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Conectar MetaMask
        </button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}