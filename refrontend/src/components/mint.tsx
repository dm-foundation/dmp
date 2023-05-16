import * as React from "react";

export function MintNFTForm() {
  const [tokenId, setTokenId] = React.useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        write?.();
      }}
    >
      <button disabled={!write} onClick={() => write?.()}>
        Mint Store
      </button>
    </form>
  );
}
