// Compiled bytecode for FreeCandy (using --bin)
var freeCandyBytecode = "0x6060604052341561000f57600080fd5b5b60008054600160a060020a03191633600160a060020a03161790555b5b6101558061003c6000396000f3006060604052361561003e5763ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041663944d1ea1811461004b575b5b610047610067565b505b005b610053610067565b604051901515815260200160405180910390f35b6000805473ffffffffffffffffffffffffffffffffffffffff163480156108fc0290604051600060405180830381858888f1935050505015610122576000547fbc8f5a5cb90bc33d83a08f0663beb02c65e4c51522ef0c8230d36370088a0a1990339073ffffffffffffffffffffffffffffffffffffffff163460405173ffffffffffffffffffffffffffffffffffffffff9384168152919092166020820152604080820192909252606001905180910390a1506001610126565b5060005b905600a165627a7a723058203dc9952621b6fb093a9c28af6f0e086c9794dd6f8a60a5b27aa463833ffefc9f0029"

// Application Binary Interface (ABI) for FreeCandy (using --abi)
var freeCandyAbi = [
  {
    "constant": false,
    "inputs": [],
    "name": "gimmeMoney",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "MoneySent",
    "type": "event"
  }
]
