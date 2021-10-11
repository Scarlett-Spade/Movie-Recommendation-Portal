const main = async () => {
  //This will compile the smart contract and generate the necessary files to work with 
  //the smart contract under the artifacts directory. 
  const nftContractFactory = await hre.ethers.getContractFactory('BeetleNFT');
  //Hardhat will create a local Ethereum network for this contract. 
  //Then, after the script completes, it'll destroy that local Ethereum network. Every time 
  //I run this smart contract, it'll be a fresh blockchain. Whats the point? It starts from 
  //a clean slate which makes it easy to debug errors.
  const nftContract = await nftContractFactory.deploy();
  //This waits until the smart contract is officially mined and deployed to the local blockchain!
  //The constructor runs when the smart contract is fully deployed!
  await nftContract.deployed();
  //Once it's deployed, nftContract.address will provide the address of the deployed smart contract. 
  //This address is how I can find the smart contract on the blockchain.
  console.log("Contract deployed to:", nftContract.address);

  // This calls the smart contract function to mint NFTS.
  let txn = await nftContract.mintBeetle()
  // This waits for the NFT to be mined.
  await txn.wait()
  console.log("Your NFT has been minted!")
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();