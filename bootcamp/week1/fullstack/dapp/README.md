# 💸 Web3 Token dApp

Este é um projeto simples que demonstra como integrar um app Web2 com Web3 usando React, Vite, wagmi e viem. Ele permite:

- Conectar à MetaMask
- Ler o nome de um token ERC-20
- Ler o saldo de tokens da carteira conectada
- Enviar uma transação para mintar novos tokens
- Enviar uma transação para transferir tokens

# ✅ PASSO A PASSO

## 1. Criar projeto

```bash
npm create vite@latest my-dapp -- --template react
npm install
```

## 2. Instalar dependências

```bash
npm install viem wagmi @tanstack/react-query
```

## 3. Rodar Hello World!

```bash
npm run dev
```

## 4. Estrutura do Projeto

### Pastas

```bash
.
├── public/                 # Arquivos estáticos
├── src/
│   ├── ...
│   ├── App.tsx            # Componente principal
│   ├── main.jsx           # Entry point
├── ...
└── README.md
```

### `App.tsx`

```js
import React from "react";

function App() {
  return (
    <>
      <h1>Hello World</h1>
    </>
  );
}

export default App;
```

## 5. Adicionando Hooks

## 5.1 Hook de Wallet

### pasta

```bash
├── src
│   ├── ...
│   ├── hooks
│   │   └── useWallet.ts
│   └── main.jsx
└── ...
```

### `useWallet.ts`

```js
import { Address, createWalletClient, custom } from "viem";
import { anvil } from "viem/chains";
import { useState, useEffect } from "react";

export function useWallet() {
  const [account, setAccount] = (useState < Address) | (null > null);
  const [client, setClient] = useState < any > null;
  const [error, setError] = (useState < string) | (null > null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask não está instalado");
      }

      const walletClient = createWalletClient({
        chain: anvil,
        transport: custom(window.ethereum),
      });

      const [address] = await walletClient.requestAddresses();
      setClient(walletClient);
      setAccount(address);
      setError(null);
    } catch (err) {
      setError("Falha ao conectar com MetaMask");
      console.error(err);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (!window.ethereum) return;

        const walletClient = createWalletClient({
          chain: anvil,
          transport: custom(window.ethereum),
        });

        // Verifica se já há contas conectadas
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setClient(walletClient);
          setAccount(accounts[0]);
          setError(null);
        }
      } catch (err) {
        console.error("Erro ao verificar conexão inicial:", err);
      }
    };

    checkConnection();
  }, []);

  return { account, client, error, connectWallet };
}
```

### `global.d.ts`

```js
interface Window {
  ethereum?: {
    request: (args: { method: string, params?: any[] }) => Promise<any>,
    on?: (event: string, callback: (...args: any[]) => void) => void,
    removeListener?: (
      event: string,
      callback: (...args: any[]) => void
    ) => void,
  };
}
```

### 5.2 Componente `ConnectWalletButton`

```js
import React from "react";
import { Address } from "viem";

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
  return (
    <div style={{ textAlign: "center" }}>
      {!account && (
        <button
          onClick={connectWallet}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Conectar MetaMask
        </button>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
```

### 5.3 Hook de Contratos
