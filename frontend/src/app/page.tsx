"use client";

import { assert } from "console";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import * as storeABI from "../../../contracts/out/store-reg.sol/NFT.json" assert { type: "json" };

export default function Page() {
  const { config } = usePrepareContractWrite({
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    abi: storeABI,
    functionName: "withdrawPayments",
    args: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  return (
    <div>
      <button disabled={!write} onClick={() => write?.()}>
        Feed
      </button>
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
    </div>
  );
}
