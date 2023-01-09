import { Wallet } from 'ethers'
import { ethers, waffle } from 'hardhat'
import { UniswapV3Factory } from '../typechain/UniswapV3Factory'
import { expect } from './shared/expect'
import snapshotGasCost from './shared/snapshotGasCost'
import { TestERC20 } from '../typechain/TestERC20'
import { parseEther } from 'ethers/lib/utils'
import { poolFixture, TEST_POOL_START_TIME } from './shared/fixtures'
import { MockTimeUniswapV3Pool } from '../typechain/MockTimeUniswapV3Pool'
import { TestUniswapV3Callee } from '../typechain/TestUniswapV3Callee'
import {
  expandTo18Decimals,
  FeeAmount,
  getPositionKey,
  getMaxTick,
  getMinTick,
  encodePriceSqrt,
  TICK_SPACINGS,
  createPoolFunctions,
  SwapFunction,
  MintFunction,
  getMaxLiquidityPerTick,
  FlashFunction,
  MaxUint128,
  MAX_SQRT_RATIO,
  MIN_SQRT_RATIO,
  SwapToPriceFunction,
} from './shared/utilities'
import { getContractFactory } from '@nomiclabs/hardhat-ethers/types'


  type ThenArg<T> = T extends PromiseLike<infer U> ? U : T  

  // function encodePriceSqrt(reserve1: BigNumberish, reserve0: BigNumberish): BigNumber {
  //   return BigNumber.from(
  //     new bn(reserve1.toString())
  //       .div(reserve0.toString())
  //       .sqrt()
  //       .multipliedBy(new bn(2).pow(96))
  //       .integerValue(3)
  //       .toString()
  //   )
  // }  
  const createFixtureLoader = waffle.createFixtureLoader;
// describe("AA",async () => {
//         let wallet: Wallet, other: Wallet
//         let token0: TestERC20
//         let token1: TestERC20
//         let token2: TestERC20
//         // let minTick = getMinTick(10);
//         // let maxTick = getMaxTick(10);
//         // let mint: MintFunction
//         let factory: UniswapV3Factory
//         let pool: MockTimeUniswapV3Pool
//         let swapTarget: TestUniswapV3Callee
//         let createPool: ThenArg<ReturnType<typeof poolFixture>>['createPool'] 
//         let loadFixture: ReturnType<typeof createFixtureLoader>

//         let swapToLowerPrice: SwapToPriceFunction
//         let swapToHigherPrice: SwapToPriceFunction
//         let swapExact0For1: SwapFunction
//         let swap0ForExact1: SwapFunction
//         let swapExact1For0: SwapFunction
//         let swap1ForExact0: SwapFunction
//         let feeAmount: number
//         let tickSpacing: number
//         let minTick: number
//         let maxTick: number
//         let mint: MintFunction
//         let flash: FlashFunction


//         beforeEach('deploy fixture', async () => {
//           ;({ token0, token1, token2, factory, createPool, swapTargetCallee: swapTarget } = await loadFixture(poolFixture))
      
//           const oldCreatePool = createPool
//           createPool = async (_feeAmount, _tickSpacing) => {
//             const pool = await oldCreatePool(_feeAmount, _tickSpacing)
//             ;({
//               swapToLowerPrice,
//               swapToHigherPrice,
//               swapExact0For1,
//               swap0ForExact1,
//               swapExact1For0,
//               swap1ForExact0,
//               mint,
//               flash,
//             } = createPoolFunctions({
//               token0,
//               token1,
//               swapTarget,
//               pool,
//             }))
//             minTick = getMinTick(_tickSpacing)
//             maxTick = getMaxTick(_tickSpacing)
//             feeAmount = _feeAmount
//             tickSpacing = _tickSpacing
//             return pool
//           }
      
//           // default to the 30 bips pool
//           pool = await createPool(FeeAmount.MEDIUM, TICK_SPACINGS[FeeAmount.MEDIUM])
//         })

//         before('create fixture loader', async () => {
//           ;[wallet, other] = await (ethers as any).getSigners()
//           loadFixture = createFixtureLoader([wallet, other])
//         })
//     it("Create New Pool",async () => {
//       const [a,v,WETH,wallet,other] = await ethers.getSigners();
//       let loadFixture: ReturnType<typeof createFixtureLoader>
//       loadFixture = createFixtureLoader()
//       // await pool.initialize(encodePriceSqrt(1, 10))
//       // await mint(wallet.address, minTick, maxTick, 3161)

//       // // await mint(wallet.address, -240, 0, 10000)
//       // // await pool.burn(minTick, maxTick, 10000)
//       // // //console.log(tickSpacing);
//       // // //await mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, 100000000000)
//       // // //await pool.burn(minTick + tickSpacing, maxTick - tickSpacing,10000000000);
//       // // // await mint(wallet.address,-240, 0, 10000);
//       // // // //await pool.burn(-240, 0, 100);

//       // // await pool.setFeeProtocol(6, 6)
//       // // await mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, expandTo18Decimals(1))
//       // // await swapExact0For1(expandTo18Decimals(1).div(10), wallet.address)
//       // // await swapExact1For0(expandTo18Decimals(1).div(100), wallet.address)
      
      
//       // await mint(wallet.address, -46080, -46020, 10000)
//       //       await pool.burn(-46080, -46020, 10000)
//       //       const { amount0, amount1 } = await pool.callStatic.collect(
//       //         wallet.address,
//       //         -46080,
//       //         -46020,
//       //         MaxUint128,
//       //         MaxUint128
//       //       )
//       //       expect(amount0, 'amount0').to.eq(0)
//       //       expect(amount1, 'amount1').to.eq(3)
//       // //})  
        
//         // const factoryFactory = await ethers.getContractFactory('UniswapV3Factory');
//         // const factory  = await factoryFactory.deploy();
//         // ;({ token0, token1} = await loadFixture(poolFixture))
//         // // const dai = await ethers.getContractFactory("MyToken");
//         // // const DAI = await dai.deploy();
//         // // console.log(factory.address);
//         // // console.log(DAI.address);
//         // //await token0.mint(a.address,parseEther("100000"));
//         // //await token1.mint(a.address,parseEther("100000"));
        
//         // const pool  = await factory.createPool(token0.address,token1.address,500);
//         // //const pool1 = await 
//         // //console.log(pool);
//         // //console.log(token0);
//         // const poolAddress = await factory.getPool(token0.address,token1.address,500);
//         // const V3Pool =  await ethers.getContractAt("UniswapV3Pool",poolAddress);
//         // await token0.approve(poolAddress,parseEther("10000000"));
//         // await token1.approve(poolAddress,parseEther("10000000"));
//         // await V3Pool.initialize(encodePriceSqrt(1, 10));
//         // //console.log(await V3Pool.slot0());
//         // //wait V3Pool.mint(a.address,minTick + 10, maxTick - 10, 100,a.address)
//         // await mint(wallet.address, minTick, maxTick, 3161)
    
//         //beforeEach('initialize the pool at price of 10:1', async () => {
         
//         //})
//       //   pool = await createPool(FeeAmount.LOW, TICK_SPACINGS[FeeAmount.LOW])
//       // //await initializeAtZeroTick(pool)
//       //   const liquidityDelta = expandTo18Decimals(100)
//       // const lowerTick = -tickSpacing * 100
//       // const upperTick = tickSpacing * 100

//       // await mint(wallet.address, lowerTick, upperTick, liquidityDelta)

//       // const liquidityBefore = await pool.liquidity()

//       // const amount0In = expandTo18Decimals(1)
//       // await swapExact0For1(amount0In, wallet.address)
//       //await pool.burn(lowerTick, upperTick, 0)
//       //await pool.collect(wallet.address, lowerTick, upperTick, MaxUint128, MaxUint128)

//       // await pool.burn(lowerTick, upperTick, 0)
//       // const { amount0: fees0, amount1: fees1 } = await pool.callStatic.collect(
//       //   wallet.address,
//       //   lowerTick,
//       //   upperTick,
//       //   MaxUint128,
//       //   MaxUint128
//       // )
//       // expect(fees0).to.be.eq(0)
//       // expect(fees1).to.be.eq(0)

//       // const token0BalanceAfterWallet = await token0.balanceOf(wallet.address)
//       // const token1BalanceAfterWallet = await token1.balanceOf(wallet.address)
//       // const token0BalanceAfterPool = await token0.balanceOf(pool.address)
//       // const token1BalanceAfterPool = await token1.balanceOf(pool.address)

//       // expect(token0BalanceAfterWallet).to.be.gt(token0BalanceBeforeWallet)
//       // expect(token1BalanceAfterWallet).to.be.eq(token1BalanceBeforeWallet)

//       // expect(token0BalanceAfterPool).to.be.lt(token0BalanceBeforePool)
//       // expect(token1BalanceAfterPool).to.be.eq(token1BalanceBeforePool)
//     })
//     describe('#collect', () => {
//       beforeEach(async () => {
//         pool = await createPool(FeeAmount.LOW, TICK_SPACINGS[FeeAmount.LOW])
//         await pool.initialize(encodePriceSqrt(1, 1))
//       })
  
//       it('works with multiple LPs', async () => {
//         await mint(wallet.address, minTick, maxTick, expandTo18Decimals(1))
//         await mint(wallet.address, minTick + tickSpacing, maxTick - tickSpacing, expandTo18Decimals(2))
//         await swapExact0For1(expandTo18Decimals(1), wallet.address)
//         await swapExact0For1(expandTo18Decimals(1), wallet.address)
//         await swapExact1For0(expandTo18Decimals(1), wallet.address)
//         await pool.burn(minTick, maxTick, 0)
//         const { amount0, amount1 } = await pool.callStatic.collect(
//           wallet.address,
//           minTick,
//           maxTick,
//           MaxUint128,
//           MaxUint128
//         )
//         console.log(amount0);
//         console.log(amount1);
//       })

//       it.only("Burn", async () => {
//           await mint(wallet.address, -46080, -46020, 10000)
//           await pool.burn(-46080, -46020, 10000)
//       })
//     })  
// })


describe("Local contract test", function() {
  // let token0: TestERC20;
  // let token1: TestERC20;
  it("Deply",async function () {
    const [a,v,WETH,wallet,other] = await ethers.getSigners();
    //const fact = await  ethers.getContractFactory("V3");
    const ERC20 = await ethers.getContractFactory("Token0");
    const token0 = await ERC20.deploy("token0","t0"); 
    const ERC201 = await ethers.getContractFactory("Token1");
    const token1 = await ERC201.deploy("token1","t1"); 
    const V3fact = await ethers.getContractFactory("UniswapV3Factory");
    const d = await V3fact.deploy();
    //await d.createPool(token0.address,token1.address,500);
    const fact = await  ethers.getContractFactory("V3");
    const v3 = await fact.deploy(d.address);
    const tx = await v3.createPair(token0.address,token1.address,500);
    let pool = await d.getPool(token0.address,token1.address,500);
    await token0._mint(a.address,parseEther("10000"));
    await token1._mint(a.address,parseEther("10000"));
    await token0.approve(v3.address,parseEther("10000"));
    await token1.approve(v3.address,parseEther("10000"));
    console.log(encodePriceSqrt(10, 1));
    await v3.init(pool,encodePriceSqrt(5000, 1));

    await v3.addLiquidity(pool,a.address,-46080, -46020, 10000,a.address);

    // console.log(token0);
    
  
  });
  
})


