// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * HalalChain v1 — batch traceability with RBAC and revision history.
 * - PRODUCER_ROLE: register batches and submit revisions after rejection.
 * - AUDITOR_ROLE: verify, reject, or revoke batches.
 * - DEFAULT_ADMIN_ROLE: grant/revoke roles.
 */
contract HalalChain is AccessControl {
    bytes32 public constant PRODUCER_ROLE = keccak256("PRODUCER_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");

    enum Status {
        Unknown,
        Pending,
        Verified,
        Rejected,
        Revoked
    }

    struct Batch {
        address producer;
        string productName;
        string ipfsCid;
        uint256 createdAt;
        Status status;
        address auditor;
        uint256 auditedAt;
        string auditIpfsCid;
        string rejectReason;
        uint256 parentBatchId;
    }

    uint256 public nextBatchId = 1;
    mapping(uint256 => Batch) private batches;

    event BatchRegistered(
        uint256 indexed batchId,
        address indexed producer,
        string ipfsCid,
        uint256 parentBatchId
    );
    event BatchVerified(uint256 indexed batchId, address indexed auditor, string auditIpfsCid);
    event BatchRejected(
        uint256 indexed batchId,
        address indexed auditor,
        string reason,
        string auditIpfsCid
    );
    event BatchRevoked(uint256 indexed batchId, address indexed auditor, string reason);

    error InvalidBatch();
    error InvalidStatus();
    error NotOriginalProducer();
    error ParentNotRejected();

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function registerBatch(
        string calldata productName,
        string calldata ipfsCid
    ) external onlyRole(PRODUCER_ROLE) returns (uint256 batchId) {
        batchId = _createBatch(msg.sender, productName, ipfsCid, 0);
    }

    function registerRevision(
        uint256 parentBatchId,
        string calldata ipfsCid
    ) external onlyRole(PRODUCER_ROLE) returns (uint256 batchId) {
        if (parentBatchId == 0 || parentBatchId >= nextBatchId) revert InvalidBatch();
        Batch storage parent = batches[parentBatchId];
        if (parent.producer != msg.sender) revert NotOriginalProducer();
        if (parent.status != Status.Rejected) revert ParentNotRejected();

        batchId = _createBatch(msg.sender, parent.productName, ipfsCid, parentBatchId);
    }

    function _createBatch(
        address producer,
        string memory productName,
        string memory ipfsCid,
        uint256 parentBatchId
    ) internal returns (uint256 batchId) {
        batchId = nextBatchId++;
        batches[batchId] = Batch({
            producer: producer,
            productName: productName,
            ipfsCid: ipfsCid,
            createdAt: block.timestamp,
            status: Status.Pending,
            auditor: address(0),
            auditedAt: 0,
            auditIpfsCid: "",
            rejectReason: "",
            parentBatchId: parentBatchId
        });
        emit BatchRegistered(batchId, producer, ipfsCid, parentBatchId);
    }

    function getBatch(uint256 batchId) external view returns (Batch memory) {
        if (batchId == 0 || batchId >= nextBatchId) revert InvalidBatch();
        return batches[batchId];
    }

    function verifyBatch(
        uint256 batchId,
        string calldata auditIpfsCid
    ) external onlyRole(AUDITOR_ROLE) {
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
    ) external onlyRole(AUDITOR_ROLE) {
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

    function revokeBatch(uint256 batchId, string calldata reason) external onlyRole(AUDITOR_ROLE) {
        if (batchId == 0 || batchId >= nextBatchId) revert InvalidBatch();
        Batch storage b = batches[batchId];
        if (b.status != Status.Verified) revert InvalidStatus();

        b.status = Status.Revoked;
        b.auditor = msg.sender;
        b.auditedAt = block.timestamp;
        b.rejectReason = reason;

        emit BatchRevoked(batchId, msg.sender, reason);
    }
}
