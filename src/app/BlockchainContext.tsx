"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getProvider } from "./contractUtils";
import { ethers } from "ethers";

interface BlockchainContextProps {
  account: string | null;
  connectWallet: () => Promise<void>;
  balance: string | null;
  isCorrectNetwork: boolean;
  switchToSepolia: () => Promise<void>;
}

const BlockchainContext = createContext<BlockchainContextProps>({
  account: null,
  connectWallet: async () => {},
  balance: null,
  isCorrectNetwork: false,
  switchToSepolia: async () => {},
});

export const useBlockchain = () => useContext(BlockchainContext);

export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);

  const checkNetwork = async () => {
    try {
      const provider = getProvider();
      const network = await provider.getNetwork();
      setIsCorrectNetwork(network.chainId === 11155111); // Sepolia chain ID
    } catch (err) {
      console.error("Failed to check network:", err);
      setIsCorrectNetwork(false);
    }
  };

  const switchToSepolia = async () => {
    try {
      const provider = getProvider();
      await provider.send('wallet_switchEthereumChain', [{ chainId: '0xaa36a7' }]); // Sepolia chain ID in hex
      await checkNetwork();
    } catch (err: any) {
      if (err.code === 4902) {
        // Network not added to wallet
        try {
          const provider = getProvider();
          await provider.send('wallet_addEthereumChain', [{
            chainId: '0xaa36a7',
            chainName: 'Sepolia Test Network',
            nativeCurrency: {
              name: 'Sepolia ETH',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: ['https://rpc.sepolia.org'],
            blockExplorerUrls: ['https://sepolia.etherscan.io']
          }]);
          await checkNetwork();
        } catch (addError) {
          console.error("Failed to add Sepolia network:", addError);
        }
      } else {
        console.error("Failed to switch network:", err);
      }
    }
  };

  const getBalance = async (address: string) => {
    try {
      const provider = getProvider();
      const balance = await provider.getBalance(address);
      setBalance(ethers.utils.formatEther(balance));
    } catch (err) {
      console.error("Failed to get balance:", err);
    }
  };

  const connectWallet = async () => {
    try {
      const provider = getProvider();
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      getBalance(accounts[0]);
      await checkNetwork();
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
          getBalance(accounts[0]);
          await checkNetwork();
        }
      } catch (err) {
        console.error("Failed to check wallet connection:", err);
      }
    };

    checkWalletConnection();

    // Listen for network changes
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <BlockchainContext.Provider value={{ account, connectWallet, balance, isCorrectNetwork, switchToSepolia }}>
      {children}
    </BlockchainContext.Provider>
  );
};
