import { expect } from "chai";
import hre from "hardhat";

describe("HalalChain", function () {
  async function deployFixture() {
    const { ethers } = await hre.network.create();
    const [admin, producer, auditor, stranger] = await ethers.getSigners();

    const HalalChain = await ethers.getContractFactory("HalalChain", admin);
    const halalChain = await HalalChain.deploy();
    await halalChain.waitForDeployment();

    const PRODUCER_ROLE = await halalChain.PRODUCER_ROLE();
    const AUDITOR_ROLE = await halalChain.AUDITOR_ROLE();

    await (await halalChain.grantRole(PRODUCER_ROLE, producer.address)).wait();
    await (await halalChain.grantRole(AUDITOR_ROLE, auditor.address)).wait();

    return { halalChain, admin, producer, auditor, stranger, PRODUCER_ROLE, AUDITOR_ROLE, ethers };
  }

  it("producer can register and auditor can verify", async function () {
    const { halalChain, producer, auditor } = await deployFixture();

    await (await halalChain.connect(producer).registerBatch("Keripik", "bafy-docs")).wait();

    const b1 = await halalChain.getBatch(1n);
    expect(b1.producer).to.equal(producer.address);
    expect(b1.productName).to.equal("Keripik");
    expect(b1.status).to.equal(1n); // Pending

    await (await halalChain.connect(auditor).verifyBatch(1n, "bafy-audit")).wait();
    const b2 = await halalChain.getBatch(1n);
    expect(b2.status).to.equal(2n); // Verified
    expect(b2.auditor).to.equal(auditor.address);
  });

  it("auditor can reject a pending batch", async function () {
    const { halalChain, producer, auditor } = await deployFixture();

    await (await halalChain.connect(producer).registerBatch("Sambal", "bafy-sambal")).wait();
    await (
      await halalChain.connect(auditor).rejectBatch(1n, "Bahan tidak jelas", "bafy-audit-reject")
    ).wait();

    const batch = await halalChain.getBatch(1n);
    expect(batch.status).to.equal(3n); // Rejected
    expect(batch.rejectReason).to.equal("Bahan tidak jelas");
  });

  it("producer can submit revision after rejection", async function () {
    const { halalChain, producer, auditor } = await deployFixture();

    await (await halalChain.connect(producer).registerBatch("Keripik", "bafy-v1")).wait();
    await (await halalChain.connect(auditor).rejectBatch(1n, "Dokumen kurang", "bafy-audit")).wait();
    await (await halalChain.connect(producer).registerRevision(1n, "bafy-v2")).wait();

    const original = await halalChain.getBatch(1n);
    const revision = await halalChain.getBatch(2n);

    expect(original.status).to.equal(3n);
    expect(revision.parentBatchId).to.equal(1n);
    expect(revision.status).to.equal(1n);
    expect(revision.productName).to.equal("Keripik");

    await (await halalChain.connect(auditor).verifyBatch(2n, "bafy-audit-v2")).wait();
    expect((await halalChain.getBatch(2n)).status).to.equal(2n);
  });

  it("rejects unauthorized register and verify", async function () {
    const { halalChain, stranger, auditor, ethers } = await deployFixture();

    await expect(halalChain.connect(stranger).registerBatch("X", "cid")).to.revert(ethers);
    await expect(halalChain.connect(auditor).registerBatch("X", "cid")).to.revert(ethers);
  });

  it("prevents double verification", async function () {
    const { halalChain, producer, auditor, ethers } = await deployFixture();

    await (await halalChain.connect(producer).registerBatch("Keripik", "bafy-docs")).wait();
    await (await halalChain.connect(auditor).verifyBatch(1n, "bafy-audit")).wait();

    await expect(halalChain.connect(auditor).verifyBatch(1n, "bafy-audit-2")).to.revert(ethers);
  });

  it("auditor can revoke a verified batch", async function () {
    const { halalChain, producer, auditor } = await deployFixture();

    await (await halalChain.connect(producer).registerBatch("Keripik", "bafy-docs")).wait();
    await (await halalChain.connect(auditor).verifyBatch(1n, "bafy-audit")).wait();
    await (await halalChain.connect(auditor).revokeBatch(1n, "Recall produk")).wait();

    const batch = await halalChain.getBatch(1n);
    expect(batch.status).to.equal(4n); // Revoked
    expect(batch.rejectReason).to.equal("Recall produk");
  });

  it("rejects invalid batch id", async function () {
    const { halalChain, producer, ethers } = await deployFixture();
    await expect(halalChain.getBatch(99n)).to.revert(ethers);
    await expect(halalChain.connect(producer).registerRevision(99n, "cid")).to.revert(ethers);
  });

  it("rejects verify on rejected batch (Scenario C)", async function () {
    const { halalChain, producer, auditor, ethers } = await deployFixture();

    await (await halalChain.connect(producer).registerBatch("Keripik", "bafy-v1")).wait();
    await (await halalChain.connect(auditor).rejectBatch(1n, "Dokumen kurang", "bafy-audit")).wait();

    await expect(halalChain.connect(auditor).verifyBatch(1n, "bafy-tamper")).to.revert(ethers);

    const batch = await halalChain.getBatch(1n);
    expect(batch.status).to.equal(3n);
    expect(batch.rejectReason).to.equal("Dokumen kurang");
  });
});
