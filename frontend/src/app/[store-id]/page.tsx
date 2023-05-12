"use client";
import useSWR from "swr";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { hexHashToCid } from "../../lib/utils";

import storeABI from "../../../../contracts/out/store-reg.sol/Store.json" assert { type: "json" };
import depolyerTx from "../../../../contracts/broadcast/store-reg.s.sol/31337/run-latest.json" assert { type: "json" };

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Page({ params }: { params: { "store-id": string } }) {
  // fetch the store hash from the contract
  const contract = useContractRead({
    address: depolyerTx.transactions[0].contractAddress,
    abi: storeABI.abi,
    functionName: "storeRootHash",
    args: ["0x" + params["store-id"]],
  });

  const sd = contract.data
    ? useSWR(
        `http://${hexHashToCid(
          contract.data
        )}.ipfs.localhost:8080/?format=dag-json`,
        fetcher
      )
    : { isLoading: true };

  if (sd.isLoading) return <div>loading...</div>;
  return (
    <div>
      <h1>{params["store-id"]}</h1>
      <h2> Promotion </h2>
      <div className="grid grid-cols-4 gap-4">
        {sd.data.promoting.map((item, index) => (
          <StoreItem index={index} item={item} />
        ))}
      </div>
    </div>
  );
}

// todo need to finish
const StoreItem = (props) => {
  console.log(props);
  const contract = useContractRead({
    address: depolyerTx.transactions[0].contractAddress,
    abi: storeABI.abi,
    functionName: "storeRootHash",
    args: ["0x" + props.item.storeId],
  });

  const sd = contract.data
    ? useSWR(
        `http://${hexHashToCid(
          contract.data
        )}.ipfs.localhost:8080/?format=dag-json`,
        fetcher
      )
    : { isLoading: true };

  if (sd.isLoading) return <div>loading...</div>;
  return (
    <div key={`image-${props.index}`}>
      <Image
        src={`http://${hexHashToCid(
          contract.data
        )}.ipfs.localhost:8080/listings/${props.item.index}/picture`}
        alt={sd.data.listings[props.item.index].description}
        width={500}
        height={500}
        className="w-48 h-48 "
        unoptimized
      />
      <p>{sd.data.listings[props.item.index].description}</p>
      <p>Price: {sd.data.listings[props.item.index].price}</p>
    </div>
  );
};
