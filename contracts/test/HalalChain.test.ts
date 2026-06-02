import { expect } from "chai";
import hre from "hardhat";

describe("HalalChain", function () {
  it("producer can register and auditor can verify", async function () {
    const { ethers } = await hre.network.create();
    const [owner, producer, auditor] = await ethers.getSigners();

    const HalalChain = await ethers.getContractFactory("HalalChain", owner);
    const halalChain = await HalalChain.deploy();
    await halalChain.waitForDeployment();

    await (await halalChain.setAuditor(auditor.address, true)).wait();

    const tx = await halalChain.connect(producer).registerBatch("Keripik", "bafy-docs");
    const receipt = await tx.wait();
    const event = receipt?.logs?.find(() => true);
    expect(event).to.not.equal(undefined);

    const batchId = 1n;
    const b1 = await halalChain.getBatch(batchId);
    expect(b1.producer).to.equal(producer.address);
    expect(b1.productName).to.equal("Keripik");

    await (await halalChain.connect(auditor).verifyBatch(batchId, "bafy-audit")).wait();
    const b2 = await halalChain.getBatch(batchId);
    expect(b2.status).to.equal(2); // Verified
    expect(b2.auditor).to.equal(auditor.address);
  });
});

