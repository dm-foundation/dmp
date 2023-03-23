## Getting Started
### Installation
	- NixOS is used to create the development enviroment and manage dependencies. [See installation instuctions](https://nixos.org/download.html).
	- clone the repository `git@github.com:wanderer/uap.git`
	- `cd uap` and enter into the nix development shell `nix dev`
		- Alternativaly install [direnv](https://direnv.net/) and run `direnv allow` to automatically enter the shell on entry to the directory.
	- Run `run`. This will start [Anvil](https://book.getfoundry.sh/anvil/) with the contracts loaded and nextjs's development server.
	- You should be able to navigate to `http://localhost:3001/` in your browser to see the site.
## Fronted Stack
	- [nextjs](https://nextjs.org/) frontend framework
	- [wagmi](https://wagmi.sh/) ethereum/react intergation
	- [tailwind](https://tailwindcss.com/) css
## Backend/Contracts
	- [Forge](https://getfoundry.sh/) solidity/ethereum dev environment.
