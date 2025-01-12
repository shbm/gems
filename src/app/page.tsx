"use client";

import React, { useState } from "react";
import { useBlockchain } from "./BlockchainContext";
import { mintToken, tradeTokens } from "./contractUtils"; // Import tradeTokens
import { forgeToken } from "./contractUtils";
import './styles.css';

const tokenNames: Record<number, string> = {
  0: "RUBY",
  1: "SAPPHIRE",
  2: "EMERALD",
  3: "SOLAR GEM",
  4: "OCEAN GEM",
  5: "NATURE GEM",
  6: "PRISMATIC GEM",
};

const Page = () => {
  const { account, connectWallet } = useBlockchain();
  const [mintResult, setMintResult] = useState<string>("");
  const [tokenId, setTokenId] = useState<number>(1);
  const [forgeResult, setForgeResult] = useState<string>("");
  const [loadingMint, setLoadingMint] = useState<boolean>(false);
  const [loadingForge, setLoadingForge] = useState<boolean>(false);
  const [tradeFrom, setTradeFrom] = useState<number>(0); // Token to trade from
  const [tradeTo, setTradeTo] = useState<number>(1); // Token to trade to
  const [tradeResult, setTradeResult] = useState<string>("");
  const [loadingTrade, setLoadingTrade] = useState<boolean>(false); // Loading state for trading

  const handleForge = async (id: number) => {
    if (!account) {
      setForgeResult("Please connect your wallet to forge a token.");
      return;
    }

    setLoadingForge(true);
    try {
      const result = await forgeToken(id);
      setForgeResult(`Token ${tokenNames[id]} forged successfully! Result: ${result}`);
    } catch (err: any) {
      if (err.code === 4001) {
        setForgeResult("Transaction was rejected by the user.");
      } else {
        setForgeResult(err.message || "Forging the token failed. Please try again.");
      }
    } finally {
      setLoadingForge(false);
    }
  };

  const handleMint = async (id: number) => {
    if (!account) {
      setMintResult("Please connect your wallet to mint a token.");
      return;
    }

    setLoadingMint(true);
    try {
      const result = await mintToken(account, id);
      setMintResult(`Token ${tokenNames[id]} minted successfully! Result: ${result}`);
    } catch (err: any) {
      if (err.code === 4001) {
        setMintResult("Transaction was rejected by the user.");
      } else {
        console.error(err);
        setMintResult(err.message || "Minting the token failed. Please try again.");
      }
    } finally {
      setLoadingMint(false);
    }
  };

  const handleTrade = async () => {
    if (!account) {
        setTradeResult("Please connect your wallet to trade tokens.");
        return;
    }

    setLoadingTrade(true); // Set loading for trading to true
    try {
        const result = await tradeTokens(tradeFrom, tradeTo);
        setTradeResult(
            `Trade successful! Result: ${tokenNames[result["from"]]} to ${tokenNames[result["to"]]}`
        );
    } catch (error) {
        if (error instanceof Error) {
            setTradeResult(error.message);
        } else {
            setTradeResult("An unknown error occurred.");
        }
    } finally {
        setLoadingTrade(false); // Set loading for trading to false after the process
    }
  };

  return (
    <div className="container">
      <h1 className="title">Welcome to the Gems Decentralized Application (dApp)</h1>
      {!account ? (
        <button className="button" onClick={connectWallet}>Connect Your Wallet</button>
      ) : (
        <p className="connected">You are connected as: <strong>{account}</strong></p>
      )}

      <div className="section">
        <h2>Mint a New Token</h2>
        <div className="token-images">
          {[0, 1, 2].map((id) => (
            <div key={id} className="token-item">
              <img
                src={`https://ipfs.io/ipfs/bafybeih76zyeeh7yk6upmpdrfngqkkxbiu4upbm2lx244jjx44zw63adde/${id}.webp`}
                alt={tokenNames[id]}
                className="token-image"
              />
              <button className="button" onClick={() => handleMint(id)}>Mint {tokenNames[id]}</button>
            </div>
          ))}
        </div>
        {loadingMint && <div className="loading"><div className="spinner"></div></div>}
        <p className="result">{mintResult}</p>
      </div>

      <div className="section">
        <h2>Forge an Existing Token</h2>
        <div className="token-images">
          {[3, 4, 5, 6].map((id) => (
            <div key={id} className="token-item">
              <img
                src={`https://ipfs.io/ipfs/bafybeih76zyeeh7yk6upmpdrfngqkkxbiu4upbm2lx244jjx44zw63adde/${id}.webp`}
                alt={tokenNames[id]}
                className="token-image"
              />
              <button className="button" onClick={() => handleForge(id)}>Forge {tokenNames[id]}</button>
            </div>
          ))}
        </div>
        {loadingForge && <div className="loading"><div className="spinner"></div></div>}
        <p className="result">{forgeResult}</p>
      </div>

      <div className="section">
        <h2>Trade Tokens</h2>
        <div className="trade-row">
          <h3>Trade From:</h3>
          <div className="gem-images">
            {[0, 1, 2].map((id) => (
              <label key={id} className="radio-label">

                <img
                  src={`https://ipfs.io/ipfs/bafybeih76zyeeh7yk6upmpdrfngqkkxbiu4upbm2lx244jjx44zw63adde/${id}.webp`}
                  alt={tokenNames[id]}
                  className={`gem-image ${tradeFrom === id ? 'selected' : ''}`}
                />

                <input
                  type="radio"
                  value={id}
                  checked={tradeFrom === id}
                  onChange={() => setTradeFrom(id)}
                />
                {tokenNames[id]}
              </label>
            ))}
          </div>
        </div>
        <div className="trade-row">
          <h3>Trade To:</h3>
          <div className="gem-images">
            {[0, 1, 2].map((id) => (
              <label key={id} className="radio-label">
                <img
                  src={`https://ipfs.io/ipfs/bafybeih76zyeeh7yk6upmpdrfngqkkxbiu4upbm2lx244jjx44zw63adde/${id}.webp`}
                  alt={tokenNames[id]}
                  className={`gem-image ${tradeTo === id ? 'selected' : ''}`}
                />
                <input
                  type="radio"
                  value={id}
                  checked={tradeTo === id}
                  onChange={() => setTradeTo(id)}
                />
                {tokenNames[id]}
              </label>
            ))}
          </div>
        </div>
        <button className="button" onClick={handleTrade}>Trade</button>
        {loadingTrade && <div className="loading"><div className="spinner"></div></div>} {/* Spinner for trading */}
        <p className="result">{tradeResult}</p>
      </div>
    </div>
  );
};

export default Page;