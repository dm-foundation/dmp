"use client";
import { WagmiConfig, createClient } from "wagmi";
import { optimism, arbitrum, hardhat, mainnet } from "wagmi/chains";
// import { ens } from "@ensdomains/ensjs";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultClient,
} from "connectkit";

import "./globals.css";

// to do; add ens integration
// const ENSInstance = new ENS();
// ENSInstance.setProvider(provider(mainnet)).then(async () => {
//  const profile = await ENSInstance.getProfile(
//    "0x51434F6502b6167ABEC98Ff9F5fd37Ef3E07E7d2"
//  );
// });

// Set up client
const client = createClient(
  getDefaultClient({
    appName: "ConnectKit Next.js demo",
    //infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    //alchemyId:  process.env.NEXT_PUBLIC_ALCHEMY_ID,
    chains: [ hardhat, mainnet],
  })
);

// Pass client to React Context Provider
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WagmiConfig client={client}>
          <ConnectKitProvider>
            <ConnectKitButton />
          </ConnectKitProvider>
          {children}
        </WagmiConfig>
      </body>
    </html>
  );
}
