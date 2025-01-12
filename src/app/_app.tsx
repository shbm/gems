import "../globals.css";
import { WagmiConfig, createClient, configureChains, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const { provider, webSocketProvider } = configureChains([mainnet], [publicProvider()]);
const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
}

export default MyApp;
