"use client";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { optimism, arbitrum, hardhat, mainnet } from "wagmi/chains";
import { publicProvider } from "@wagmi/core/providers/public";
import Profile from "../components/profile";
// import { ens } from "@ensdomains/ensjs";
import { InjectedConnector } from "@wagmi/core/connectors/injected";
import "./globals.css";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [optimism, arbitrum, hardhat, mainnet],
  [publicProvider()]
);

// to do; add ens integration
// const ENSInstance = new ENS();
// ENSInstance.setProvider(provider(mainnet)).then(async () => {
//  const profile = await ENSInstance.getProfile(
//    "0x51434F6502b6167ABEC98Ff9F5fd37Ef3E07E7d2"
//  );
// });

// Set up client
const config = createConfig({
  publicClient,
  webSocketPublicClient,
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
});

// Pass client to React Context Provider
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WagmiConfig config={config}>
          <Profile />
          {children}
        </WagmiConfig>
      </body>
    </html>
  );
}
