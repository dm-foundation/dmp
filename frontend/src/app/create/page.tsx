"use client";
import useSWR from "swr";
import { useState } from "react";
import Image from "next/image";
import { usePrepareContractWrite, useAccount } from "wagmi";
import { prepareWriteContract, writeContract } from "@wagmi/core";

import { create } from "kubo-rpc-client";
import storeABI from "../../../../contracts/out/store-reg.sol/Store.json" assert { type: "json" };
import depolyerTx from "../../../../contracts/broadcast/store-reg.s.sol/31337/run-latest.json" assert { type: "json" };

const fetcher = (...args) => fetch(...args).then((res) => res.json());
// connect to the default API address http://localhost:5001
const kuboClient = create("http://127.0.0.1:5001");
const rootHash = "bafyreidscpglkovhhih4tesnxhmpxicgro6jtyz64em34p3tnxx4ifpo7q";

export default function Page({ params }: { params: { address: string } }) {
  const [txState, setTxState] = useState(false);
  // ipfs

  const { data, error, isLoading } = useSWR(
    `http://${rootHash}.ipfs.localhost:8080/?format=dag-json`,
    fetcher
  );

  // smart contract
  const { address, isConnectingContract, isDisconnected } = useAccount();

  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();
    const checked = document.querySelectorAll(":checked");

    // Get data from the form.
    const data = Array.from(checked).map((item) => {
      return {
        index: item.getAttribute("data-index"),
        storeId: item.getAttribute("data-storeid"),
      };
    });

    // Send the data to the server in JSON format.
    console.log("data data to ipfs");

    const cid = await kuboClient.dag.put({
      promoting: [{ promotions: data }],
      listings: data,
    });
    const hexstr = Buffer.from(cid.multihash.digest).toString("hex");
    console.log(hexstr);

    const config = await prepareWriteContract({
      address: depolyerTx.transactions[0].contractAddress,
      abi: storeABI.abi,
      functionName: "mintTo",
      args: [address, `0x${hexstr}`],
    });
    const { hash, wait } = await writeContract(config);
    setTxState("waiting for tx");
    const receipt = await wait(1);
    setTxState("done");
  };

  if (txState) return <div>{txState}</div>;
  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  // render data
  return (
    <div>
      <h1>Create A Store</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-4 gap-4">
          {data.map((item, index) => {
            return (
              <div key={`image-${index}`}>
                <Image
                  src={`http://${rootHash}.ipfs.localhost:8080/${index}/picture`}
                  alt={item.description}
                  width={500}
                  height={500}
                  className="w-48 h-48 "
                  unoptimized
                />
                <p>{item.description}</p>
                <p>Price: {item.price}</p>
                <label>
                  Select
                  <input
                    type="checkbox"
                    data-index={index}
                    data-storeid="0" // todo
                  />
                </label>
              </div>
            );
          })}
        </div>
        <button disabled={isLoading}>
          {isDisconnected
            ? "connect to Mint"
            : isLoading
            ? "Minting..."
            : "Mint Store"}
        </button>
      </form>
    </div>
  );
  // return <h1>Hello, {params.address}</h1>;
}
