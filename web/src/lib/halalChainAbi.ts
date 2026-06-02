export const halalChainAbi = [
  {
    type: "function",
    name: "registerBatch",
    stateMutability: "nonpayable",
    inputs: [
      { name: "productName", type: "string" },
      { name: "ipfsCid", type: "string" },
    ],
    outputs: [{ name: "batchId", type: "uint256" }],
  },
  {
    type: "function",
    name: "getBatch",
    stateMutability: "view",
    inputs: [{ name: "batchId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "producer", type: "address" },
          { name: "productName", type: "string" },
          { name: "ipfsCid", type: "string" },
          { name: "createdAt", type: "uint256" },
          { name: "status", type: "uint8" },
          { name: "auditor", type: "address" },
          { name: "auditedAt", type: "uint256" },
          { name: "auditIpfsCid", type: "string" },
          { name: "rejectReason", type: "string" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "verifyBatch",
    stateMutability: "nonpayable",
    inputs: [
      { name: "batchId", type: "uint256" },
      { name: "auditIpfsCid", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "rejectBatch",
    stateMutability: "nonpayable",
    inputs: [
      { name: "batchId", type: "uint256" },
      { name: "reason", type: "string" },
      { name: "auditIpfsCid", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "setAuditor",
    stateMutability: "nonpayable",
    inputs: [
      { name: "auditor", type: "address" },
      { name: "allowed", type: "bool" },
    ],
    outputs: [],
  },
] as const;

