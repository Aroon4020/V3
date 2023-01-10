// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.6;
import './interfaces/IUniswapV3Pool.sol';
import "hardhat/console.sol";
import './interfaces/IUniswapV3Factory.sol';
import './libraries/LiquidityAmounts.sol';
import './libraries/TickMath.sol';
import './interfaces/IERC20Minimal.sol';

contract V3 {

    
    IUniswapV3Factory private factory;

    constructor(address _factory){
        factory = IUniswapV3Factory(_factory);
    }

    function createPair(address t1, address t2, uint24 _fee) external returns (address pool){
        (pool) = factory.createPool(t1, t2, _fee);
    }

    function init(IUniswapV3Pool pool,uint160 sqrtPriceX96) external{
        pool.initialize(sqrtPriceX96);
    }


    function addLiquidity(
        IUniswapV3Pool pool,
        int24 lowerTick,
        int24 upperTick,
        uint256 amount0,
        uint256 amount1
     ) external {
            (uint160 sqrtRatioX96, , , , , , ) = pool.slot0();

            uint128 liquidity =  LiquidityAmounts.getLiquidityForAmounts(
            sqrtRatioX96,
            TickMath.getSqrtRatioAtTick(lowerTick),
            TickMath.getSqrtRatioAtTick(upperTick),
            amount0,
            amount1);
            pool.mint(address(this), lowerTick, upperTick, liquidity, abi.encode(msg.sender));
            
    }
    function burnLiquidity(
        IUniswapV3Pool pool,
        int24 tickLower,
        int24 tickUpper,
        uint256 _amount0,
        uint256 _amount1
    ) external returns(uint256 amount0,uint256 amount1){
        (uint160 sqrtRatioX96, , , , , , ) = pool.slot0();

            uint128 liquidity =  LiquidityAmounts.getLiquidityForAmounts(
            sqrtRatioX96,
            TickMath.getSqrtRatioAtTick(tickLower),
            TickMath.getSqrtRatioAtTick(tickUpper),
            _amount0,
            _amount1);
        (amount0,amount1) = pool.burn(tickLower, tickUpper, liquidity);
        if (amount0 > 0 || amount1 > 0) {
            (amount0, amount0) = pool.collect(
                msg.sender,
                tickLower,
                tickUpper,
                uint128(amount0),
                uint128(amount1)
            );
        }
    }

    function swap(
        IUniswapV3Pool pool,
        bool zeroForOne,
        int256 amountSpecified
    ) external {
        (uint160 sqrtPriceX96,,,,,,) = pool.slot0();
        uint160 exactSqrtPriceImpact = (sqrtPriceX96 * (1e5 / 2)) / 1e6;
        uint160 sqrtPriceLimitX96 = zeroForOne
            ? sqrtPriceX96 - exactSqrtPriceImpact
            : sqrtPriceX96 + exactSqrtPriceImpact;
        pool.swap(address(this), zeroForOne, amountSpecified, sqrtPriceLimitX96, abi.encode(msg.sender));
        
    }

    function collect(
        IUniswapV3Pool pool,
        int24 tickLower,
        int24 tickUpper,
        uint128 amount0Requested,
        uint128 amount1Requested
    ) external returns(uint256 amount0,uint256 amount1)  {
        
        (amount0, amount1)  = pool.collect(msg.sender, tickLower, tickUpper, amount0Requested, amount1Requested);
    }

    

    function uniswapV3MintCallback(
        uint256 amount0Owed,
        uint256 amount1Owed,
        bytes calldata data
    ) external {
        
        if (amount0Owed > 0)
            IERC20Minimal(IUniswapV3Pool(msg.sender).token0()).transferFrom(abi.decode(data, (address)), msg.sender, amount0Owed);
        
        if (amount1Owed > 0)
        IERC20Minimal(IUniswapV3Pool(msg.sender).token1()).transferFrom(abi.decode(data, (address)), msg.sender, amount1Owed);
            
    }


    function uniswapV3SwapCallback(
        int256 amount0,
        int256 amount1,
        bytes calldata data
    ) external {
        
        if (amount0 > 0) {
            IERC20Minimal(IUniswapV3Pool(msg.sender).token0()).transferFrom(abi.decode(data, (address)), msg.sender, uint256(amount0));
        } else if (amount1 > 0) {
            IERC20Minimal(IUniswapV3Pool(msg.sender).token1()).transferFrom(abi.decode(data, (address)), msg.sender, uint256(amount1));
        }
    }

    

}
