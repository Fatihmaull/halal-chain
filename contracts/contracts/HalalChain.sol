// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * HalalChain (minimal v1)
 * - Producer registers a batch (with IPFS CID for supporting docs).
 * - Auditor verifies or rejects the batch (immutable audit trail).
 *
 * NOTE: This is a bootstrap contract matching the PRD shape, not final governance/roles.
 */
contract HalalChain {
    enum Status {
        Unknown,
        Pending,
        Verified,
        Rejected
    }

    struct Batch {
        address producer;
        string productName;
        string ipfsCid;
        uint256 createdAt;
        Status status;
        address auditor;
        uint256 auditedAt;
        string auditIpfsCid; // optional audit report CID
        string rejectReason; // optional
    }

    address public immutable owner;
    mapping(address => bool) public isAuditor;

    uint256 public nextBatchId = 1;
    mapping(uint256 => Batch) private batches;

    event AuditorSet(address indexed auditor, bool allowed);
    event BatchRegistered(uint256 indexed batchId, address indexed producer, string ipfsCid);
    event BatchVerified(uint256 indexed batchId, address indexed auditor, string auditIpfsCid);
    event BatchRejected(uint256 indexed batchId, address indexed auditor, string reason, string auditIpfsCid);

    error NotOwner();
    error NotAuditor();
    error NotProducer();
    error InvalidBatch();
    error InvalidStatus();

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyAuditor() {
        if (!isAuditor[msg.sender]) revert NotAuditor();
        _;
    }

    function setAuditor(address auditor, bool allowed) external onlyOwner {
        isAuditor[auditor] = allowed;
        emit AuditorSet(auditor, allowed);
    }

    function registerBatch(string calldata productName, string calldata ipfsCid) external returns (uint256 batchId) {
        batchId = nextBatchId++;
        batches[batchId] = Batch({
            producer: msg.sender,
            productName: productName,
            ipfsCid: ipfsCid,
            createdAt: block.timestamp,
            status: Status.Pending,
            auditor: address(0),
            auditedAt: 0,
            auditIpfsCid: "",
            rejectReason: ""
        });
        emit BatchRegistered(batchId, msg.sender, ipfsCid);
    }

    function getBatch(uint256 batchId) external view returns (Batch memory) {
        if (batchId == 0 || batchId >= nextBatchId) revert InvalidBatch();
        return batches[batchId];
    }

    function verifyBatch(uint256 batchId, string calldata auditIpfsCid) external onlyAuditor {
        if (batchId == 0 || batchId >= nextBatchId) revert InvalidBatch();
        Batch storage b = batches[batchId];
        if (b.status != Status.Pending) revert InvalidStatus();

        b.status = Status.Verified;
        b.auditor = msg.sender;
        b.auditedAt = block.timestamp;
        b.auditIpfsCid = auditIpfsCid;

        emit BatchVerified(batchId, msg.sender, auditIpfsCid);
    }

    function rejectBatch(
        uint256 batchId,
        string calldata reason,
        string calldata auditIpfsCid
    ) external onlyAuditor {
        if (batchId == 0 || batchId >= nextBatchId) revert InvalidBatch();
        Batch storage b = batches[batchId];
        if (b.status != Status.Pending) revert InvalidStatus();

        b.status = Status.Rejected;
        b.auditor = msg.sender;
        b.auditedAt = block.timestamp;
        b.auditIpfsCid = auditIpfsCid;
        b.rejectReason = reason;

        emit BatchRejected(batchId, msg.sender, reason, auditIpfsCid);
    }
}

