// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.6;
import './interfaces/IUniswapV3Pool.sol';
//import "./interface/IPool.sol";
import "hardhat/console.sol";
//import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
//import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";

import './interfaces/IUniswapV3Factory.sol';

interface P{
    function getTicks(address) external returns (
            int24 baseLower,
            int24 baseUpper,
            int24 bidLower,
            int24 bidUpper,
            int24 askLower,
            int24 askUpper
        );
}
contract V3 {

    
    // sfunction a() external{
    //     FABI.createPool();
    // }
    //IUniswapV3Pool private pool;
    //P private unipilot;
    IUniswapV3Factory private factory;

    constructor(address _factory){
        //pool = IUniswapV3Pool(_pool);
        //unipilot = P(str);
        factory = IUniswapV3Factory(_factory);
    }

    function createPair(address t1, address t2, uint24 _fee) external returns (address pool){
        (pool) = factory.createPool(t1, t2, _fee);
    }

    function init(IUniswapV3Pool pool,uint160 sqrtPriceX96) external{
        pool.initialize(sqrtPriceX96);
    }


    
    fallback() external{
        console.log("hhh");
    }

    function addLiquidity(
        IUniswapV3Pool pool,
        address recipient,
        int24 lowerTick,
        int24 upperTick,
        uint128 amount, //amount of liquidity
        bytes calldata data
        //address pool //encoded sender address transffer token to pool
     ) external {
            pool.mint(recipient, lowerTick, upperTick, amount, data);
     }
    function burnLiquidity(
        IUniswapV3Pool pool,
        int24 tickLower,
        int24 tickUpper,
        uint128 amount
    ) external returns(uint256 amount0,uint256 amount1){
        (amount0,amount1) = pool.burn(tickLower, tickUpper, amount);
    }

    function swap(
        IUniswapV3Pool pool,
        address recipient,
        bool zeroForOne,
        int256 amountSpecified,
        uint160 sqrtPriceLimitX96,
        bytes calldata data
    ) external {
        pool.swap(recipient, zeroForOne, amountSpecified, sqrtPriceLimitX96, data);
    }

    function collect(
        IUniswapV3Pool pool,
        address recipient,
        int24 tickLower,
        int24 tickUpper,
        uint128 amount0Requested,
        uint128 amount1Requested
    ) external returns(uint256 amount0,uint256 amount1)  {
        (amount0, amount1)  = pool.collect(recipient, tickLower, tickUpper, amount0Requested, amount1Requested);
    }

}
