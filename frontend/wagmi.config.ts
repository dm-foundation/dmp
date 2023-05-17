import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";
import * as chains from "wagmi/chains";
import depolyerTx from "../contracts/broadcast/store-reg.s.sol/31337/run-latest.json" assert { type: "json" };

const address: string = depolyerTx.transactions[0].contractAddress;

export default defineConfig({
  out: "src/generated.ts",
  plugins: [
    foundry({
      deployments: {
        Store: {
          [chains.foundry.id]: address as `0x${string}`,
        },
      },
      project: "../contracts",
    }),
    react(),
  ],
});
