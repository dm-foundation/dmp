"use client";
import useSWR from "swr";
import Image from "next/image";
import { useContractRead } from "wagmi";
import { hexHashToCid } from "../../lib/utils";

import storeABI from "../../../../contracts/out/store-reg.sol/Store.json" assert { type: "json" };
import depolyerTx from "../../../../contracts/broadcast/store-reg.s.sol/31337/run-latest.json" assert { type: "json" };

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Page({ params }: { params: { storeId: string } }) {
  // fetch the store hash from the contract
  const contract = useContractRead({
    address: depolyerTx.transactions[0].contractAddress,
    abi: storeABI.abi,
    functionName: "storeRootHash",
    args: ["0x" + params["store-id"]],
  });

  const storeData = contract.data
    ? useSWR(
        `http://${hexHashToCid(
          contract.data
        )}.ipfs.localhost:8080/?format=dag-json`,
        fetcher
      )
    : { isLoading: true };

  if (storeData.error) return <div>failed to load</div>;
  if (storeData.isLoading) return <div>loading...</div>;
  return (
    <div>
      <h1>{params.storeId}</h1>
      <h2> listings </h2>
      <div className="grid grid-cols-4 gap-4">
        {storeData.data.listings.map((item, index) => {
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
            </div>
          );
        })}
      </div>
      <h2> Promotion </h2>
      <div className="grid grid-cols-4 gap-4">
        {storeData.data.listings.map((item, index) => (
          <StoreItem index={index} item={item} />
        ))}
      </div>
    </div>
  );
}

// todo need to finish
const StoreItem = (props) => {
  const contract = useContractRead({
    address: depolyerTx.transactions[0].contractAddress,
    abi: storeABI.abi,
    functionName: "storeRootHash",
    args: [props],
  });
  return <h1>{props.text}</h1>;
};
