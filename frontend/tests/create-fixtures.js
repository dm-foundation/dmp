import { create } from "kubo-rpc-client";
import listings from "./listings.json" assert { type: "json" };
import * as fs from "node:fs/promises";

// connect to the default API address http://localhost:5001
const client = create("http://127.0.0.1:5001");

const storeData = listings.listings.map(async (listing) => {
  const file = await fs.readFile(`./fixtures/${listing.picture}`);
  const fileCid = await client.add(file);
  return {
    price: Math.trunc(Math.random(100) * 100),
    description: listing.description,
    picture: fileCid.cid,
  };
});

Promise.all(storeData).then(async (data) => {
  const cid = await client.dag.put(data);
  const hexstr = Buffer.from(cid.multihash.digest).toString("hex");
  console.log(hexstr);
});
