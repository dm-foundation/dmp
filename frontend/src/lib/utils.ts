import { base16 } from "multiformats/bases/base16";
import { sha256 } from "multiformats/hashes/sha2";
import { CID } from "multiformats/cid";
import * as Digest from "multiformats/hashes/digest";
import * as codec from "@ipld/dag-cbor";

export function hexHashToCid(hash) {
  const arrayBuf = base16.decode("f" + hash.slice(2));
  const digest = Digest.create(sha256.code, arrayBuf);
  const cid = CID.create(1, codec.code, digest);
  return cid;
}

