"use client";

import React from "react";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import storeABI from "../../../contracts/out/store-reg.sol/Store.json" assert { type: "json" };
import { useDebounce } from "usehooks-ts";

export default function Page() {
  const [storeId, setStoreId] = React.useState("");
  const debouncedStoreId = useDebounce(storeId, 500);
  const { config } = usePrepareContractWrite({
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    abi: storeABI.abi,
    functionName: "mintTo",
    args: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", debouncedStoreId],
    enabled: Boolean(debouncedStoreId),
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
        <input
          onChange={(e) => setStoreId(e.target.value)}
          id="storeName"
          placeholder="Store Name"
          value={storeId}
        />
        <br />
        <button disabled={!write || isLoading}>
          {isLoading ? "Minting..." : "Mint"}
        </button>
        {isSuccess && (
          <div>
            Successfully minted your NFT!
          </div>
        )}
      </form>
    </div>
  );
}
