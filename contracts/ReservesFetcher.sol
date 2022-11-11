pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IUniswapV2Pair {
    function factory() external view returns (address);
    function token0() external view returns (address);
    function token1() external view returns (address);
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function price0CumulativeLast() external view returns (uint);
    function price1CumulativeLast() external view returns (uint);
    function kLast() external view returns (uint);
}

contract ReservesFetcher is Ownable {

    struct PairReserves {
        address uniswapPair;
        uint112 reserve0;
        uint112 reserve1;
        uint32 blockTimestampLast;
    }

    mapping(address => bool) private uniswap_address_map;
    address[] private uniswap_addresses;

    function addPair(address uniswapPair) public onlyOwner {
        (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast) = IUniswapV2Pair(uniswapPair).getReserves();
        require(reserve0 != 0, "Uniswap pair is empty");
        require(reserve1 != 0, "Uniswap pair is empty");
        require(blockTimestampLast != 0, "Uniswap pair is empty");
        require(!uniswap_address_map[uniswapPair], "Uniswap pair already registered");
        uniswap_address_map[uniswapPair] = true;
        uniswap_addresses.push(uniswapPair);
    }

    function addPairs(address[] calldata uniswapPairs) public onlyOwner {
        for(uint i = 0; i < uniswapPairs.length; i++) {
            addPair(uniswapPairs[i]);
        }
    }

    function removePair(address uniswapPair) public onlyOwner {
        require(uniswap_address_map[uniswapPair], "Uniswap pair absent");
        uniswap_address_map[uniswapPair] = false;
        address lastAddress = uniswap_addresses[uniswap_addresses.length - 1];
        delete uniswap_addresses[uniswap_addresses.length - 1];
        for(uint i = 0; i < uniswap_addresses.length; i++) {
            address currentAddress = uniswap_addresses[i];
            if (currentAddress == uniswapPair) {
                uniswap_addresses[i] = lastAddress;
            }
        }
    }

    function getStatistics() public view returns(PairReserves[] memory _pairReserves) {
        _pairReserves = new PairReserves[](uniswap_addresses.length);
        for(uint i = 0; i< _pairReserves.length; i++) {
            address currentAddress = uniswap_addresses[i];
            (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast) = IUniswapV2Pair(currentAddress).getReserves();
            PairReserves memory currentReserves = PairReserves(currentAddress, reserve0, reserve1, blockTimestampLast);
            _pairReserves[i] = currentReserves;
        }
        return _pairReserves;
    }

    function getStatistics(uint leftInclusive, uint rightExclusive) public view returns(PairReserves[] memory _pairReserves) {
        _pairReserves = new PairReserves[](rightExclusive - leftInclusive);
        uint offset = 0;
        for(uint i = leftInclusive; i < rightExclusive; i++) {
            address currentAddress = uniswap_addresses[i];
            (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast) = IUniswapV2Pair(currentAddress).getReserves();
            PairReserves memory currentReserves = PairReserves(currentAddress, reserve0, reserve1, blockTimestampLast);
            _pairReserves[offset] = currentReserves;
            offset += 1;
        }
        return _pairReserves;
    }


}
