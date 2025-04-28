import { Abi, Address, isAddress } from "viem";
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
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferTo, setTransferTo] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
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
      setError("Erro ao mintar tokens: " + error.message);
    } finally {
      setIsMinting(false);
    }
  };

  const transferTokens = async () => {
    console.log("Transferring tokens...");
    setIsTransferring(true);
    setError(null);
    try {
      // Valida o endereço de destino
      if (!isAddress(transferTo)) {
        throw new Error("Endereço de destino inválido");
      }

      // Valida o valor
      const amount = Number(transferAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("O valor deve ser maior que 0");
      }

      // Converte o valor para a unidade correta (considerando decimals)
      const amountInWei = BigInt(Math.floor(amount * 10 ** decimals));
      if (amountInWei > balance) {
        throw new Error("Saldo insuficiente para a transferência");
      }

      // Executa a transferência
      const tx = await contract.write.transfer([transferTo as Address, amountInWei], { account });
      console.log("Transfer transaction sent:", tx);

      // Aguarda a confirmação da transação
      const receipt = await provider.waitForTransactionReceipt({ hash: tx });
      console.log("Transfer transaction confirmed:", receipt);

      // Atualiza o saldo após a confirmação
      await readBalance();

      // Limpa os campos
      setTransferTo("");
      setTransferAmount("");
    } catch (error) {
      console.error("Error transferring tokens:", error);
      setError("Erro ao transferir tokens: " + error.message);
    } finally {
      setIsTransferring(false);
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

      {balance > 0n && (
        <div>
          <h3>Transferir Tokens</h3>
          <input
            type="text"
            placeholder="Endereço de destino (0x...)"
            value={transferTo}
            onChange={(e) => setTransferTo(e.target.value)}
            disabled={isTransferring}
          />
          <input
            type="number"
            placeholder="Quantidade"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            disabled={isTransferring}
            min="0"
            step="0.0001"
          />
          <button onClick={transferTokens} disabled={isTransferring}>
            {isTransferring ? "Transferindo..." : "Transferir"}
          </button>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}