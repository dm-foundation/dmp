import { base16 } from "multiformats/bases/base16";
import { sha256 } from "multiformats/hashes/sha2";
import { CID } from "multiformats/cid";
import * as Digest from "multiformats/hashes/digest";
import * as codec from "@ipld/dag-cbor";

export function hexHashToCid(hash: string) {
  const arrayBuf = base16.decode("f" + hash.slice(2));
  const digest = Digest.create(sha256.code, arrayBuf);
  const cid = CID.create(1, codec.code, digest);
  return cid;
}

export function toHexString(arr: Uint8Array) {
  return Array.from(arr, (i) => i.toString(16).padStart(2, "0")).join("");
}
