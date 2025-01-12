"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getProvider } from "./contractUtils";
import { ethers } from "ethers";

interface BlockchainContextProps {
  account: string | null;
  connectWallet: () => Promise<void>;
}

const BlockchainContext = createContext<BlockchainContextProps>({
  account: null,
  connectWallet: async () => {},
});

export const useBlockchain = () => useContext(BlockchainContext);

export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      const provider = getProvider();
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const provider = getProvider();
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (err) {
        console.error("Failed to check wallet connection:", err);
      }
    };

    checkWalletConnection();
  }, []);

  return (
    <BlockchainContext.Provider value={{ account, connectWallet }}>
      {children}
    </BlockchainContext.Provider>
  );
};
