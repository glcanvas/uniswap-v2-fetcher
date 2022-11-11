import * as dotenv from "dotenv";
import {HardhatUserConfig, task} from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "solidity-coverage";
import "hardhat-dependency-compiler";
import * as process from "process";
import {ReservesFetcher} from "./typechain";

dotenv.config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  console.log(hre.network);
  for (const account of accounts) {
    console.log(await account.getBalance("latest"));
  }
});

task("deployLst", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  const contract = await hre.ethers.getContractFactory("ReservesFetcher");
  const res = await contract.deploy();
  console.log(res)
});

task("callRange", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  const contract = await hre.ethers.getContractFactory("ReservesFetcher");
  const c = await contract.attach("0x340fDcD8Ca0196D40D62FA7D5d94bDFCd29C2044");
  const res = await c["getStatistics()"]();
  console.log(res);
});



const config: HardhatUserConfig = {
  dependencyCompiler: {
    paths: [
      '@uniswap/v2-periphery/contracts/UniswapV2Router01.sol',
      '@uniswap/v2-core/contracts/UniswapV2Pair.sol',
      '@uniswap/v2-core/contracts/UniswapV2Factory.sol',
    ],
  },
  solidity: {
    compilers: [
      {
        version: "0.5.16"
      },
      {
        version: "0.6.6"
      },
      {
        version: "0.8.7"
      }
    ]
  }, // compiler version
  networks: { // list of networks with routes and accounts to use
    arbitrum: {
      url: "https://arbitrum.getblock.io/mainnet/",
      httpHeaders: {"x-api-key": process.env.API_KEY ?? ""},
      accounts: [process.env.PRIVATE_KEY ?? ""]
    },
    avalanche: {
      url: "https://avax.getblock.io/mainnet/ext/bc/C/rpc/",
      httpHeaders: {"x-api-key": process.env.API_KEY ?? ""},
      accounts: [process.env.PRIVATE_KEY ?? ""]
    },
    bsc: {
      url: "https://bsc.getblock.io/mainnet/",
      httpHeaders: {"x-api-key": process.env.API_KEY ?? ""},
      accounts: [process.env.PRIVATE_KEY ?? ""]
    },
    bsc_test: {
      url: "https://bsc.getblock.io/testnet/",
      httpHeaders: {"x-api-key": process.env.API_KEY ?? ""},
      accounts: [process.env.PRIVATE_KEY ?? ""]
    },
    cronos: {
      url: "https://cro.getblock.io/mainnet/",
      httpHeaders: {"x-api-key": process.env.API_KEY ?? ""},
      accounts: [process.env.PRIVATE_KEY ?? ""]
    },
    fantom: {
      url: "https://ftm.getblock.io/mainnet/",
      httpHeaders: {"x-api-key": process.env.API_KEY ?? ""},
      accounts: [process.env.PRIVATE_KEY ?? ""]
    },
    moonbeam: {
      url: "https://moonbeam.getblock.io/mainnet/",
      httpHeaders: {"x-api-key": process.env.API_KEY ?? ""},
      accounts: [process.env.PRIVATE_KEY ?? ""]
    },
    moonriver: {
      url: "https://moonriver.getblock.io/mainnet/",
      httpHeaders: {"x-api-key": process.env.API_KEY ?? ""},
      accounts: [process.env.PRIVATE_KEY ?? ""]
    },
    optimism: {
      url: "https://op.getblock.io/mainnet/",
      httpHeaders: {"x-api-key": process.env.API_KEY ?? ""},
      accounts: [process.env.PRIVATE_KEY ?? ""]
    },
    polygon: {
      url: "https://matic.getblock.io/mainnet/",
      httpHeaders: {"x-api-key": process.env.API_KEY ?? ""},
      accounts: [process.env.PRIVATE_KEY ?? ""]
    }
  }
};

export default config;
