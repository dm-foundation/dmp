{
  description = "UAP - Unstoppable Affiliates Protocol";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";
    foundry.url = "github:shazow/foundry.nix"; # Use monthly branch for permanent releases
    muKnIOpkgs.url = "github:MuKnIO/nixpkgs/solc"; # solc in master is broken and out of date
  };

  outputs = {
    self,
    nixpkgs,
    utils,
    foundry,
    muKnIOpkgs,
  }:
    utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {
        inherit system;
        overlays = [
          (self: super: {
            solc = muKnIOpkgs.legacyPackages.${system}.solc;
          })
          foundry.overlay
        ];
      };
      run-script = pkgs.writeShellScriptBin "run" ''
        ${pkgs.nodejs_latest}/bin/node $ROOT/frontend/script/run.js
      '';
    in {
      devShell = with pkgs;
        mkShell {
          buildInputs = [
            run-script
            # smart contracct dependencies
            kubo
            foundry-bin
            solc
            nostr-rs-relay
            # frontend dependencies
            nodejs_latest
            nodePackages.pnpm
          ];

          # Decorative prompt override so we know when we're in a dev shell
          shellHook = ''
            export PS1="[dev] $PS1"
            export ROOT=$(pwd)
            export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
          '';
        };
    });
}
