import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const HalalChain = await ethers.getContractFactory("HalalChain");
  const halalChain = await HalalChain.deploy();
  await halalChain.waitForDeployment();

  const address = await halalChain.getAddress();
  console.log("HalalChain deployed to:", address);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

