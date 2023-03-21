"use client";
import useSWR from "swr";
import Image from "next/image";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Page({ params }: { params: { address: string } }) {
  const rootHash =  "bafyreigi6k3a3ofqqdrsuyrzer5kn3kv5q72x5xmoyuyddomdwtkgoxf3e"

  const { data, error, isLoading } = useSWR(
    `http://${rootHash}.ipfs.localhost:8080/?format=dag-json`,
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  // render data
  return (
    <div className="grid grid-cols-4 gap-4">
      {data.map((item, index) => {
        return (
          <div>
            <Image
              src={`http://${rootHash}.ipfs.localhost:8080/${index}/picture`}
              alt={item.description}
              width={500}
              height={500}
              unoptimized
            />
          </div>
        );
      })}
    </div>
  );
  // return <h1>Hello, {params.address}</h1>;
}
