"use client";

import React from "react";
import { usePrepareContractWrite, useContractWrite, useAccount } from "wagmi";
import storeABI from "../../../contracts/out/store-reg.sol/Store.json" assert { type: "json" };
import depolyerTx from "../../../contracts/broadcast/store-reg.s.sol/31337/run-latest.json" assert { type: "json" };

export default function Page() {
  const { address, isConnecting, isDisconnected } = useAccount();

  console.log(address);
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: depolyerTx.transactions[0].contractAddress,
    abi: storeABI.abi,
    functionName: "mintTo",
    args: [address],
    enabled: true,
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          write?.();
        }}
      >
        <button disabled={!write || isLoading}>
          {isDisconnected ? "connect to Minet" : (isLoading ? "Minting..." : "Mint") }
        </button>
        {isSuccess && <div>Successfully minted your Store!</div>}
        {isPrepareError && <div>Error: {prepareError?.message}</div>}
      </form>
    </div>
  );
}
