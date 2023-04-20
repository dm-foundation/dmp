"use client";

import React from "react";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import storeABI from "../../../contracts/out/store-reg.sol/Store.json" assert { type: "json" };

export default function Page() {
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    abi: storeABI.abi,
    functionName: "mintTo",
    args: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
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
          {isLoading ? "Minting..." : "Mint"}
        </button>
        {isSuccess && <div>Successfully minted your NFT!</div>}
        {isPrepareError && <div>Error: {prepareError?.message}</div>}
      </form>
    </div>
  );
}
