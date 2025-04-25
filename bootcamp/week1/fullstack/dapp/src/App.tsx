import React from "react";
import { useWallet } from "./hooks/useWallet";
import { ConnectWalletButton } from "./components/ConnectWalletButton";

function Dashboard({ account }: { account: string }) {
  return (
    <div>
      <p>Carteira conectada: {account}</p>
      {/* Outras informações do dashboard serão adicionadas depois */}
    </div>
  );
}

function App() {
  const { account, error, connectWallet } = useWallet();

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Web3 Token dApp</h1>
      {account ? (
        <Dashboard account={account} />
      ) : (
        <ConnectWalletButton
          account={account}
          error={error}
          connectWallet={connectWallet}
        />
      )}
    </div>
  );
}

export default App;