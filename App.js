import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import beetleNFT from './utils/beetleNFT.json';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const CONTRACT_ADDRESS = "CONTRACT ADDRESS";
const OPENSEA_LINK = "https://testnets.opensea.io/collection/beetlejuice-1988"


const App = () => {

  //This state variable will store users' public wallet address.
  const [currentAccount, setCurrentAccount] = useState("");

  //This is the loading message after submitting---
  const [loading, setLoading] = React.useState(false);
  
  
  /*
    * Make sure this is async.
    */
  const checkIfWalletIsConnected = async () => {
    //To make sure there's access to window.ethereum.
    const { ethereum } = window
      console.log('CHECKING FOR METAMASK WALLET')
    if (!ethereum) {
      console.log("CONNECT YOUR METAMASK WALLET")
      return
    } else {
      console.log("YOUR METAMASK WALLET IS CONNECTED", ethereum)
    }
    //To check if there's access to an authorized user wallet
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    //There could be multiple accounts. Check for one.
        if(accounts.length !== 0) {
          //Grab the first account there's access to.
          const account = accounts[0]
          console.log("FOUND AN AUTHORIZED ACCOUNT: ", account)
          //Store the authorized user wallet address.
          setCurrentAccount(account)
          // This is an event listener for when a user comes to the website ALREADY connected + authorized with Metamask.
          mintEventListener()
        } else {
          console.log("NO AUTHORIZED ACCOUNT FOUND")
        }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      // This will print out the public address once Metamask wallet is authorized.
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
      // This is an event listener for a new user connecting + authorizing with Metamask for the first time.
      mintEventListener()
    } catch (error) {
      console.log(error)
    }
  }

  // This is the event listener.
  const mintEventListener = async () => {

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, beetleNFT.abi, signer);

        // This will "capture" the event when the smart contract throws it, similar to webhooks.
        connectedContract.on("NewBeetleMint", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Opensea link notifcation prepped")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  // This is the code to Mint NFTs --------------------
  const mintBeetle = async () => {
    setLoading(true)
    try {
      const { ethereum } = window;

      if (ethereum) {
        // A "provider" is used to talk to Ethereum nodes. This uses nodes that Metamask provides in the background to send/receive data from the deployed smart contract. Ethers is a library that allows the frontend to communicate with the smart contract.
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        // This creates the connection to the contract. It needs: the smart contract's address, the abi file, and a signer to communicate with smart contracts on the blockchain. 
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, beetleNFT.abi, signer);

        console.log("Paying the gas fee...")

        let nftTxn = await connectedContract.mintBeetle({ gasLimit:3000000});

        console.log("Mining...please wait.")
        setLoading(true)

        await nftTxn.wait();
        
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        setLoading(false)

      } else {
        console.log("NFT does not exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

    /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  //------------------------------------------------------
  // Render Methods
  
  // This is the "connect wallet" button
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      CONNECT METAMASK
    </button>
  );

  // The "connect wallet" button will disappear once Metamask wallet is authorized.
  const renderMintUI = () => (
    <button onClick={mintBeetle} className="cta-button connect-wallet-button">

      {loading ? <img className="loadingButton" src="https://media.giphy.com/media/WOkskpxpnnK7KlLkG0/giphy.gif" alt ="Beetlejuice"/> : 'GET NFT'}

    </button>
  );

// This conditional render will not show "connect to wallet" if the user is connected.
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          
          <img alt="Betelguese Sign" src= "https://media.giphy.com/media/SqlCDON0ocCC5eDW6X/giphy.gif"
          className="TragedyLogo" />
          
          <p className="header gradient-text"> MOVIE SCREENING</p>

          <img alt="Beetlejuice Worm" src= "https://media.giphy.com/media/cnjJfGkCnQgW5dJKIB/giphy.gif"
          className="BeetleWorm" />

          <p className="sub-text">
            STREAM "BEETLEJUICE", A CULT CLASSIC FILM, USING A CLUB PASS SPOILER <br/> NAME FROM A 
            LIMITED EDITION NFT! START BY CONNECTING YOUR METAMASK TO RINKEBY (FREE).
          </p>

          <a href={OPENSEA_LINK} 
                className="opensea-button"
                target="_blank"
                rel="noopener noreferrer">
    
                 VIEW COLLECTION ON OPENSEA
            </a>

          {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}

        </div>

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >{`LEARN-A-THON WITH @${TWITTER_HANDLE}`}</a>
          <br/> <p className="footer-text"> , ORIGINAL PORTFOLIO CONCEPT</p>
        </div>
      </div>
    </div>
  );
};

export default App;
