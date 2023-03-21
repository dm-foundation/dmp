{
  description = "UAP - Unstoppable Affiliates Protocol";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";
    foundry.url = "github:shazow/foundry.nix/monthly"; # Use monthly branch for permanent releases
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
    in {
      devShell = with pkgs;
        mkShell {
          buildInputs = [
            # smart contracct dependencies
            foundry-bin
            solc

            # frontend dependencies
            nodejs_latest
            nodePackages.pnpm
            nodePackages.typescript
            nodePackages.prettier
            # for editor
            nodePackages.typescript-language-server
          ];

          # Decorative prompt override so we know when we're in a dev shell
          shellHook = ''
            export PS1="[dev] $PS1"
          '';
        };
    });
}