import { ethers } from "ethers";


const GemsForgingLogicABI = `[{"inputs":[{"internalType":"address","name":"gemsNftContractAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"FIVE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"FOUR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ONE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SIX","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"THREE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TWO","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ZERO","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"forge","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"gemsNFT","outputs":[{"internalType":"contract IGemsNFT","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"gemsNFTContract","outputs":[{"internalType":"contract IERC1155","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"lastMint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"smelt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tradeIn","type":"uint256"},{"internalType":"uint256","name":"for_","type":"uint256"}],"name":"trade","outputs":[],"stateMutability":"nonpayable","type":"function"}]`;

const forgingLogicAddress = "0x83246d05aB6aC7B977E1A1e2cFF8C9ad2a19AeDc";

export const getForgingContract = (provider: ethers.providers.Web3Provider) => {
  return new ethers.Contract(forgingLogicAddress, GemsForgingLogicABI, provider.getSigner());
};

export const forge = async (id: number, provider: ethers.providers.Web3Provider) => {
  const contract = getForgingContract(provider);
  const tx = await contract.forge(id);
  return tx.wait();
};

export const getConstants = async (provider: ethers.providers.Web3Provider) => {
  const contract = getForgingContract(provider);
  const constants = {
    ONE: await contract.ONE(),
    TWO: await contract.TWO(),
    THREE: await contract.THREE(),
    // Add others as needed
  };
  return constants;
};
