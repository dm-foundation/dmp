import { spawn } from "node:child_process";
import process from "node:process";
import clc from "cli-color";

const frontendPath = new URL("../", import.meta.url);
const contractsPath = new URL("../../contracts", import.meta.url);

// start the blockchain
const anvil = spawn("anvil");
connectIO(anvil, "anvil");
// start the frontend
process.chdir(frontendPath.pathname);
const next = spawn("pnpm", ["dev"]);
connectIO(next, "next");

anvil.stdout.once("data", () => {
  process.chdir(contractsPath.pathname);
  const compileScript = spawn("forge", [
    "script",
    "./script/store-reg.s.sol:MyScript",
    "--fork-url",
    "http://localhost:8545",
    "--broadcast",
    "--no-auto-detect",
  ]);
  connectIO(compileScript, "forge");
});

function connectIO(stream, name) {
  stream.stdout.on("data", (data) => {
    process.stdout.write(`${clc.blue(name)}: ${data}`);
  });

  stream.stderr.on("data", (data) => {
    process.stderr.write(`${clc.red(name)}: ${data}`);
  });
}

//catch uncaught exceptions, trace, then exit normally
process.on("uncaughtException", function (e) {
  console.log("Uncaught Exception...");
  console.log(e.stack);
  // cleanup: kill running processes
  anvil.kill();
  next.kill();
  process.exit(99);
});
