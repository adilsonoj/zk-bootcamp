import { Abi, Address } from "viem";
import React, { useEffect, useState } from "react";
import { provider } from "../libs/provider";

export interface DashboardProps {
  account: Address;
  decimals: number;
  contract: any;
  symbol: string;
  name: string;
}

export function Dashboard({
  account,
  name,
  symbol,
  decimals,
  contract,
}: DashboardProps) {
  const [balance, setBalance] = useState<bigint>(0n);
  const [isMinting, setIsMinting] = useState(false);
  const formattedBalance = balance / BigInt(10) ** BigInt(decimals);

  const readBalance = async () => {
    try {
      const _balance = await contract.read.balanceOf([account]);
      setBalance(_balance);
    } catch (error) {
      console.error("Erro ao ler o balance:", error);
    }
  };

  useEffect(() => {
    readBalance();
  }, [account, contract]);

  const mintTokens = async () => {
    console.log("Minting tokens...");
    setIsMinting(true);
    try {
      const tx = await contract.write.mint([], { account });
      console.log("Transaction sent:", tx);

      // Aguarda a confirmação da transação
      const receipt = await provider.waitForTransactionReceipt({ hash: tx });
      console.log("Transaction confirmed:", receipt);

      // Atualiza o saldo após a confirmação
      await readBalance();
    } catch (error) {
      console.error("Error minting tokens:", error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div>
      <p>Carteira conectada: {account}</p>
      <p>Token: {name}</p>
      <p>
        Saldo: {formattedBalance} {symbol}
      </p>
      <button onClick={mintTokens} disabled={isMinting}>
        {isMinting ? "Minting..." : "Claim your Tokens!"}
      </button>
    </div>
  );
}
