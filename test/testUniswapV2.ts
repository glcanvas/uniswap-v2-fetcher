import {ethers, network} from "hardhat";

const {expect} = require("chai");

import {UniswapV2Pair, UniswapV2Factory, ReserveTestToken, ReservesFetcher} from "../typechain";
import {BigNumber} from "ethers";
import {VoidType} from "typechain";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {sign} from "crypto";

function getOutputAmount(amount: BigNumber, reserve1: BigNumber, reserve2: BigNumber): BigNumber {
  var amountInWithFee = amount.mul(997);
  var numerator = amountInWithFee.mul(reserve2);
  var denominator = reserve1.mul(1000).add(amountInWithFee);
  return numerator.div(denominator);
}

type UniswapPair = {
  token0: ReserveTestToken,
  token1: ReserveTestToken,
  pair: UniswapV2Pair
};

async function deployPair(signer: SignerWithAddress): Promise<UniswapPair> {
  const factoryABI = await ethers.getContractFactory("UniswapV2Factory");
  var factory = await factoryABI.deploy(signer.address);
  await factory.deployed();

  const contract = await ethers.getContractFactory("ReserveTestToken");
  var token0 = await contract.deploy("D", "F");
  await token0.deployed();

  var token1 = await contract.deploy("D", "F");
  await token1.deployed();

  var pair = await factory.createPair(token0.address, token1.address);
  var pairAddress = await factory.getPair(token0.address, token1.address);
  var uniPair = await ethers.getContractFactory("UniswapV2Pair");
  var uniPairInst = uniPair.attach(pairAddress);

  var res = {
    "token0": token0,
    "token1": token1,
    "pair": uniPairInst
  };

  return Promise.resolve(res);
}

describe("Uniswap tests", () => {

  it("create token", async () => {
    const [owner, ...addresses] = await ethers.getSigners();
    const contract = await ethers.getContractFactory("ReserveTestToken");
    var token = await contract.deploy("D", "F");
    await token.deployed();

    await token.transfer(addresses[0].address, 1_000);
    var balance = await token.balanceOf(addresses[0].address);
    expect(balance).to.be.eq(1_000);
  });

  it("add pair / delete pair", async () => {
    const [owner, ...addresses] = await ethers.getSigners();

    var pair = await deployPair(owner);
    await pair.token0.transfer(pair.pair.address, 1_000_000);
    await pair.token1.transfer(pair.pair.address, 1_000_000)
    await pair.pair.mint(owner.address);

    var reserveContract = await ethers.getContractFactory("ReservesFetcher");
    var reserve = await reserveContract.deploy();

    await reserve.addPair(pair.pair.address);
    await reserve.removePair(pair.pair.address);

  });

  it("get pair stat", async () => {
    const [owner, ...addresses] = await ethers.getSigners();

    var pair = await deployPair(owner);
    await pair.token0.transfer(pair.pair.address, 1_000_000);
    await pair.token1.transfer(pair.pair.address, 1_000_000)
    await pair.pair.mint(owner.address);

    var reserveContract = await ethers.getContractFactory("ReservesFetcher");
    var reserve = await reserveContract.deploy();

    await reserve.addPair(pair.pair.address);

    var res = await reserve["getStatistics()"]();
    expect(res.length).to.be.eq(1);


    var res = await reserve["getStatistics(uint256,uint256)"](0, 1);
    expect(res.length).to.be.eq(1);

  });
});