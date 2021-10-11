  // This tracks the mint limit-------------------
  // 1.Create a useState hook to save new mints.
  const [mintLimit, setMintLimit] = useState(0);
  
  // 3.Pass the mintUpdate function to the mintCountDown function where I have mintLimit defined.
  const mintUpdate = (async () => {
    setMintLimit(await mintCountDown());
  }, [setMintLimit]);

  // 2.Create a function that returns the issued NFT amount and the max issued NFT amount from the smart contract.
  const mintCountDown = async () => {
    
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, tragedyGirlsNFT.abi, signer);

        const issued = await connectedContract.publicIssued();const max = await connectedContract.MAX_MINT(); 
        
        return { issued: issued.toString(), max: max.toString() };

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 4. Sync mintUpdate to the mintUpdateEvent
  // 5. Render the data.
  const mintLimitCount = ({ value }) => {
	        if (!value) {
            return null;
            }
            
            return (
              <div className="mint-limit">
              <div className="limit-header">Minted:</div>
              <div className="limit-value gradient-text">{value.issued}/{value.max}
              </div>
              </div>
              );


};

// 6. Show the mint update amount.
<MintLimit value={mintLimitCount} />

//----------------------------------------------------
// 1. Create a public function that shows the tokenId in the smart contract.
// 2. Create a function in your app.js that returns the tokenId from the smart contract to the web3 app by calling the function in step one
//3. Save the values to a state hook. 
// EX: const [mintLimit, setMintLimit] = useState(0);
//4. Render the value.
//EX {minted}/{TOTAL_MINT_COUNT}