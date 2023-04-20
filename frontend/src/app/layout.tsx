"use client";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { mainnet, optimism, arbitrum, hardhat } from "wagmi/chains";
import { ENS } from "@ensdomains/ensjs";
import { publicProvider } from "wagmi/providers/public";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultClient,
} from "connectkit";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import "./globals.css";

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, optimism, arbitrum, hardhat],
  [publicProvider()]
);

// to do; add ens integration
const ENSInstance = new ENS();
ENSInstance.setProvider(provider(mainnet)).then(async () => {
  const profile = await ENSInstance.getProfile(
    "0x51434F6502b6167ABEC98Ff9F5fd37Ef3E07E7d2"
  );
  console.log(profile);
});

const client = createClient(
  getDefaultClient({
    connectors: [
      new MetaMaskConnector({ chains }),
      new WalletConnectConnector({
        chains,
        options: {
          qrcode: false,
          version: "1",
        },
      }),
      new InjectedConnector({
        chains,
        options: {
          name: "Injected",
          shimDisconnect: true,
        },
      }),
    ],
    provider,
    webSocketProvider,
  })
);
// Set up client

// Pass client to React Context Provider
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log(children);
  return (
    <html lang="en">
      <body>
        <WagmiConfig client={client}>
          <ConnectKitProvider theme="minimal">
            <ConnectKitButton />
            {children}
          </ConnectKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
