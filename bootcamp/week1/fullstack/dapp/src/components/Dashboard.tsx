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
  const formattedBalance = balance / BigInt(10) ** BigInt(decimals);

  useEffect(() => {
    const readBalance = async () => {
      try {
        const _balance = await contract.read.balanceOf([account]);
        setBalance(_balance);
      } catch (error) {
        console.error("Erro ao ler o balance:", error);
      }
    };

    readBalance();
  }, []);

  const mintTokens = async () => {
    console.log("Minting tokens...");
    try {
      const tx = await contract.write.mint({}, { account });
      console.info(tx);
    } catch (error) {
      console.error("Error minting tokens:", error);
    }
  };

  return (
    <div>
      <p>Carteira conectada: {account}</p>
      <p>Token: {name}</p>
      <p>
        Saldo: {formattedBalance} {symbol}
      </p>

      <button onClick={mintTokens}>Claim your Tokens!</button>
    </div>
  );
}
