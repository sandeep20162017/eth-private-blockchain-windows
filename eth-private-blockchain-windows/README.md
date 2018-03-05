# eth-private-blockchain

`eth-private-blockchain` is a simple tool that allows you to quickly setup a three-node private Ethereum network running locally on your personal computer (Windows 7). The tool makes initializing, starting, and connecting nodes fast and easy. The network comes with three pre-made identities (Amar, Akbar, and Anthony) and a tutorial that walks you through simple actions like mining and transferring Ether, and culminates with the deployment and execution of a simple smart contract`. 

**Prerequisites:** Make sure `geth` is installed and in the `$PATH`. `geth` is a golang implementation of the Ethereum protocol and provides command line tools for interacting with the Ethereum network. You can download [pre-compiled binaries](https://ethereum.github.io/go-ethereum/downloads/) or install from Homebrew or source using the [installation instructions](https://www.ethereum.org/cli).

The base denomination of currency on the Ethereum network is the [Ether](https://en.wikipedia.org/wiki/Ethereum#Ether). However, since most actions on the network require just fractions of an Ether, we'll be referring to various denominations of Ether throughout the tutorial (e.g., Wei, GWei, Szabo, etc.). This [site](https://etherconverter.online/) gives an overview of the various denominations, and allows you to convert between them.

## Identities

The private network comes with three identities (each secured with `foobar123` as the password):

 - Amar: `0xdda6ef2ff259928c561b2d30f0cad2c2736ce8b6`
 - Akbar: `0x8691bf25ce4a56b15c1f99c944dc948269031801`
 - Anthony: `0xb1b6a66a410edc72473d92decb3772bad863e243`

Each user's identity is stored in `./[NAME]/keystore/UTC-...`.

## Initializing From Genesis Block

Since we're bootstrapping our own private chain, we'll need a [genesis block](https://github.com/ethereum/go-ethereum/wiki/Private-network#creating-the-genesis-block). The definition for our block will be stored in [`genesis.json`](https://github.com/vincentchu/eth-private-net/blob/master/genesis.json). Both Amar and Akbar's addresses are pre-allocated with 1 Ether (or 1e+18 [Wei](http://ethdocs.org/en/latest/ether.html)). Just run:

```
→ ./eth-private-blockchain init
```

**Note:** Tearing down your private network and resetting all account balances is easy. Just run:

```
→ ./eth-private-blockchain clean
```

## Running a Private Test Net

Nodes for `amar`, `akbar`, or `anthony` can be started easily with the `start` action of the convenience script:

```
→ ./eth-private-blockchain start amar
Starting node for amar on port: 40301, RPC port: 8101. Console logs sent to ./amar/console.log
Welcome to the Geth JavaScript console!
```

This starts a running Ethereum node, loads whatever identity you specified on the command line, and starts a console where you can begin interacting with your private net. The console itself is a Javascript REPL with all of the commands you need to begin working with Ethereum preloaded. You can check out all of the available commands [here](https://github.com/ethereum/go-ethereum/wiki/JavaScript-Console#management-api-reference).

The first thing you can do is check Amar's balance, which should show exactly 1e+18 Wei (1 Ether).

```
# As amar:

> eth.getBalance("0xdda6ef2ff259928c561b2d30f0cad2c2736ce8b6")
1000000000000000000
```

For convenience, the addresses for amar, akbar, and anthony have been aliased to variables. 

```
>akbar 
"0x8691bf25ce4a56b15c1f99c944dc948269031801"

> [ eth.getBalance(amar), eth.getBalance(akbar), eth.getBalance(anthony) ]
[1000000000000000000, 1000000000000000000, 0]
```

Get [`enode`] for Amar, Akbar and Anthony, to connect to the peers.

# As Amar
> admin.nodeInfo.enode

 
Take this identifier and use it to connect Akbar's node to Amar (make sure to start Akbar's node with: `./eth-private-net start Akbar`):

```
# As akbar:

> admin.peers
[]

admin.addPeer("enode://f15b1...@[::]:40301?discport=0")

Start nodes for amar, akbar, and anthony (using `eth-private-net start [amar | akbar | anthony]`), and connect the three nodes using:
Add Amar to Akbar
Add Amar to Anthony
Add Akbar to Anthony

> admin.peers
[{
    ...
    ..
    }
}]
```

## Mining

The console allows you to begin mining on our private network easily. Simply execute `miner.start()`:

```
# As amar:

> miner.start()
null

> eth.getBalance(eth.coinbase)
6000000000000000000

> miner.stop()
true

> eth.blockNumber
1
```

## Transferring Ether

Now that we've mined a few blocks, let's try transferring some Ethereum. Let's start from a clean network. Shutdown any running nodes by typing `exit` at the console prompt. Clean and reinitialize the network by executing:

```
→ ./eth-private-net clean

→ ./eth-private-net init
```
# As amar:

> personal.unlockAccount(eth.coinbase)
Unlock account 0xdda6ef2ff259928c561b2d30f0cad2c2736ce8b6
Passphrase:
true

> txn = eth.sendTransaction({ from: amar, to: akbar, value: web3.toWei(1, "szabo") })
"0xb0fa9985cd6549258d6d96823d24398ba339f7f555fa0a58ca4b980bbbbebfe5"
```

After the transaction has been processed, our account balances are now:

```
> [ eth.getBalance(amar), eth.getBalance(akbar), eth.getBalance(anthony) ]
[999621000000000000, 31000378000000000000, 1000000000000]
```
## Deploying and Running Smart Contracts

One of the most interesting features of the Ethereum blockchain is the ability to deploy and run [smart contracts](https://en.wikipedia.org/wiki/Smart_contract) on the blockchain. In this section, we'll go through a simple example of writing, deploying, and running a smart contract called `Freecandy`.

### FreeCandy - A simple, Smart Contract

I've included a sample contract called `FreeCandy` in [`solidity/FreeCandy.sol`]. The contract itself is simple and written in [Solidity](https://en.wikipedia.org/wiki/Solidity), a statically-typed language for writing smart contracts. It allows anybody on the Ethereum network to send the contract holder some money. Though it is simple, it illustrates some basic concepts around using smart contracts to send Ether.

To deploy a Solidity contract, you'll need to compile it into an [Application Binary Interface (ABI)] and Ethereum Virtual Machine (EVM) [bytecode]. The ABI itself is a bit of JSON that defines the contract's interface--- e.g., what methods it exposes or the types of its arguments. The bytecode is a hex-encoded string that allows the contract to be run on the Ethereum Virtual Machine (EVM) when the contract is called.


I've pre-compiled FreeCandy's ABI and bytecode (both in `solidity/`) using [`sol-js`](https://github.com/ethereum/solc-js) and wrapped both in a simple javascript file that allows easy use inside the geth console:

```
# As amar:

> loadScript('solidity/FreeCandy.sol.js')
true

> freeCandyBytecode
"0x6060604052341561000f57600080fd5b5b60008054600160a060020a03191633600160a060020a03161790555b5b6101558061003c6000396000f3006060604052361561003e5763ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041663944d1ea1811461004b575b5b610047610067565b505b005b610053610067565b604051901515815260200160405180910390f35b6000805473ffffffffffffffffffffffffffffffffffffffff163480156108fc0290604051600060405180830381858888f1935050505015610122576000547fbc8f5a5cb90bc33d83a08f0663beb02c65e4c51522ef0c8230d36370088a0a1990339073ffffffffffffffffffffffffffffffffffffffff163460405173ffffffffffffffffffffffffffffffffffffffff9384168152919092166020820152604080820192909252606001905180910390a1506001610126565b5060005b905600a165627a7a723058203dc9952621b6fb093a9c28af6f0e086c9794dd6f8a60a5b27aa463833ffefc9f0029"
```

### Deploying

Note: Make sure you unlock the accounts before deploying a contract or executing calls against it. 

Unlock accounts (amar, akbar and anthony)
> personal.unlockAccount(eth.coinbase)
**make sure that a miner is running** (in these examples, anthony is the sole running miner).

Suppose Amar wishes to deploy `FreeCandy` to allow anybody to send him some Ether. First, he'll need to prepare a transaction specifying the contract's compiled bytecode as data. We'll also provide 200,000 gas to pay for the deployment, and use `eth.estimateGas(...)` to check that our supplied gas is sufficient to pay for the contract's deployment:

```
# As amar:

> var deployTxn = { from: amar, data: freeCandyBytecode, gas: 200000 }
undefined

> eth.estimateGas(deployTxn)
165815
```

Next, we'll create an instance of the contract from its ABI, and deploy it using the transaction. We can then obtain the deployed contract's address from the receipt (**Note:** The address of the deployed contract is `0x48c1bd...` in the example, but will be different for you):

```
# As amar:

> var freeCandyContract = eth.contract(freeCandyAbi)
undefined

> var freeCandyInstance = freeCandyContract.new(deployTxn)
undefined

> var receipt = eth.getTransactionReceipt(freeCandyInstance.transactionHash)
undefined

> receipt.contractAddress
"0x48c1bdb954c945a57459286719e1a3c86305fd9e"

> receipt.gasUsed
165814
```

We see that we used 165,814 gas in the deployment--- just 1 off of our initial estimate! After deployment, Amar's account balance decreased by 2,984,652 Gwei (1 Gwei = 1 Shannon = 1 Nano Ether), which is just the cost of 165,814 gas as the prevailing price of 18 Gwei.

```
> eth.getBalance(amar)
997015348000000000

> web3.toWei(1, "ether") - eth.getBalance(amar) == 165814 * eth.gasPrice
true
```

### Using FreeCandy to Transfer Money

Now that our contract is deployed, let's have Akbar use it to send some money to Amar via the contract. To do so, Akbar will take the compiled ABI and bind it to the deployed contract's address. Akbar can then use this contract to call the `.gimmeMoney` method, sending 100 Finneys (1 Finney = 1 milliEther) to the contract owner (Amar):

```
# As akbar:

> loadScript('solidity/FreeCandy.sol.js')
true

> var freeCandyContract = eth.contract(freeCandyAbi)
undefined

> var freeCandyDeployed = freeCandyContract.at("0x48c1bdb954c945a57459286719e1a3c86305fd9e")
undefined

> freeCandyDeployed.gimmeMoney.sendTransaction({ from: akbar, value: web3.toWei(0.1, 'ether')})
"0xe42b7d3d113f8670528ee5f14ec6cd65e94d15c12b4ca31187e1134c80e884ff"
```

Checking our account balances after the transaction shows that Amar's account has indeed increased by 100 Finneys, while Akbar's has decreased by about 100.56 Finneys. Again, the discrepancy is due to the gas cost of executing the smart contract. In this case, the cost (at the prevailing gas price) was 30,979 gas:

```
> [ eth.getBalance(amar), eth.getBalance(akbar)]
[1097015348000000000, 899442378000000000]
```

### Events on Smart Contracts

The last concept we'll cover are events. Each time money is successfully sent, the contract emits an [event]. The following calls will allow us examine these events in greater detail.

```
> var outputEvent = function (e, result) { console.log(JSON.stringify(result)); }
undefined

> freeCandyDeployed.MoneySent({}, { fromBlock: 0, toBlock: 'latest' }).get(outputEvent)
[
  {
    "address": "0x48c1bdb954c945a57459286719e1a3c86305fd9e",
    "args": {
      "amount": "100000000000000000",
      "recipient": "0xdda6ef2ff259928c561b2d30f0cad2c2736ce8b6",
      "sender": "0x8691bf25ce4a56b15c1f99c944dc948269031801"
    },
    "blockHash": "0xe05737f1a0cbebac566e21e9d22986d36a50f42e115c058e7fe45cf14429dd4f",
    "blockNumber": 111,
    "event": "MoneySent",
    "logIndex": 0,
    "removed": false,
    "transactionHash": "0xf838b6be4d68de91ac1af91b933bb5bdfcae1e49c287184795b7933e654f2c14",
    "transactionIndex": 0
  }
]
```

Thanks: Vincent Chu (https://github.com/vincentchu/eth-private-net). tFeedback and comments are welcome.
