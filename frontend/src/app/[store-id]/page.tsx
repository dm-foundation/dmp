"use client";
import useSWR from "swr";
import Image from "next/image";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Page({ params }: { params: { address: string } }) {
  const rootHash =
    "bafyreidscpglkovhhih4tesnxhmpxicgro6jtyz64em34p3tnxx4ifpo7q";

  const { data, error, isLoading } = useSWR(
    `http://${rootHash}.ipfs.localhost:8080/?format=dag-json`,
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  // render data
  return (
    <div>
      <h1>{params.address}</h1>
      <form>
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
                <label>Select <input type="checkbox"/></label>
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
  // return <h1>Hello, {params.address}</h1>;
}
