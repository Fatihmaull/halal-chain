import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  console.log("Deploying with:", deployer.address);

  const HalalChain = await ethers.getContractFactory("HalalChain");
  const halalChain = await HalalChain.deploy();
  await halalChain.waitForDeployment();

  const address = await halalChain.getAddress();
  console.log("HalalChain deployed to:", address);

  const PRODUCER_ROLE = await halalChain.PRODUCER_ROLE();
  const AUDITOR_ROLE = await halalChain.AUDITOR_ROLE();

  if (signers.length >= 3) {
    const producer = signers[1];
    const auditor = signers[2];
    await (await halalChain.grantRole(PRODUCER_ROLE, producer.address)).wait();
    await (await halalChain.grantRole(AUDITOR_ROLE, auditor.address)).wait();
    console.log("PRODUCER_ROLE granted to:", producer.address);
    console.log("AUDITOR_ROLE granted to:", auditor.address);
  } else if (process.env.PRODUCER_ADDRESS && process.env.AUDITOR_ADDRESS) {
    await (await halalChain.grantRole(PRODUCER_ROLE, process.env.PRODUCER_ADDRESS)).wait();
    await (await halalChain.grantRole(AUDITOR_ROLE, process.env.AUDITOR_ADDRESS)).wait();
    console.log("PRODUCER_ROLE granted to:", process.env.PRODUCER_ADDRESS);
    console.log("AUDITOR_ROLE granted to:", process.env.AUDITOR_ADDRESS);
  } else {
    console.log("Grant roles manually via grantRole(PRODUCER_ROLE / AUDITOR_ROLE, address)");
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
