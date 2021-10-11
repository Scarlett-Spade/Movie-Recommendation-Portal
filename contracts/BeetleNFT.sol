// SPDX-License-Identifier: UNLICENSED

// This will not use a lower version of the Solidity compiler.
pragma solidity ^0.8.0;

// Import the necessary OpenZeppelin Contracts.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

//Automatically created console.logs provided by Hardhat to help debug the smart contract.
import "hardhat/console.sol";

// Import the helper functions from the Base64 smart contract.
import { Base64 } from "./libraries/Base64.sol";

// This inherits the smart contract imported from OpenZeppelin, meaning there will be access
// to the inherited smart contract's methods. This can call other smart contracts from this smart contract.
// The NFT standard is known as ERC721. OpenZeppelin implements the NFT standard here and 
// allows custom logic on top of it. This eliminates the need to write boiler plate code.
contract BeetleNFT is ERC721URIStorage, ReentrancyGuard, Ownable {
  // OpenZeppelin provides this to help keep track of tokenIds.
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  // These are used to randomly generate NFTS. 

    string [] names = [
    "LYDIA SENORA",
    "BEETLE THRUST",
    "BARBARA HAUNT",
    "GRAVE WAVE",
    "MAITLAND LOVE",
    "ADAM GHOST",
    "DELIA DAYYOO",
    "OTHO PARANORMAL",
    "MISS ARGENTINA"
  ];

    string [] images = [
    "ipfs://QmXMhjYz7QhdT9DP5LKNV72KdQeCAqZA46mJa33iNZH8DG/1.png",
    "ipfs://QmXMhjYz7QhdT9DP5LKNV72KdQeCAqZA46mJa33iNZH8DG/2.png",
    "ipfs://QmXMhjYz7QhdT9DP5LKNV72KdQeCAqZA46mJa33iNZH8DG/3.png",
    "ipfs://QmXMhjYz7QhdT9DP5LKNV72KdQeCAqZA46mJa33iNZH8DG/4.png",
    "ipfs://QmXMhjYz7QhdT9DP5LKNV72KdQeCAqZA46mJa33iNZH8DG/5.png",
    "ipfs://QmXMhjYz7QhdT9DP5LKNV72KdQeCAqZA46mJa33iNZH8DG/6.png",
    "ipfs://QmXMhjYz7QhdT9DP5LKNV72KdQeCAqZA46mJa33iNZH8DG/7.png",
    "ipfs://QmXMhjYz7QhdT9DP5LKNV72KdQeCAqZA46mJa33iNZH8DG/8.png",
    "ipfs://QmXMhjYz7QhdT9DP5LKNV72KdQeCAqZA46mJa33iNZH8DG/9.png"
  ];

    string [] descriptions = [
    "This is a spoiler reference to Lydia Deetz, a witty photographer that gothicly slays above the neck.",
    "This is a spoiler reference to Beetlejuice, an amusingly crude bio-exorcist.",
    "This is a spoiler reference to Barbara Maitland, a kind homebody who enjoys simple pleasures.",
    "This is a spoiler reference to the neitherworld, where ghosts read books and wear high heels. ",
    "This is a spoiler reference to the Maitlands, together in life and death.",
    "This is a spoiler reference to Adam Maitland, a newlywed sculptor and enemy of Beetlejuice.",
    "This is a spoiler reference to Delia Deetz, a fashionable sculptor with a dramatic flair.",
    "This is a spoiler reference to Otho Fenlock, an interior designer and paranormal researcher.",
    "This is a spoiler reference to Miss Argentina, a snippy beauty queen and neitherworld receptionist."

  ];

  event NewBeetleMint(address sender, uint256 tokenId);
    
  // This passes the name of the NFTs token and it's symbol.
  constructor() ERC721 ("BEETLEJUICE 1988", "BJ1988") {
    
    //When this contract is initialized for the first time, this constructor will run and 
    //print out this line.
    console.log("This is my first NFT contract thanks to Buildspace. Fire!");
  }

  // This function will randomly pick a name from the array.
  function pickBeetleCard(uint256 tokenId) private view returns (uint256) {
    uint256 rand = random(string(abi.encodePacked("NAME", block.timestamp, Strings.toString(tokenId))));
    return rand % names.length;
  }

  function random(string memory input) internal pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked(input)));
  } 

  // A function the user will hit to get their NFT.
  function mintBeetle() public {
    
    // This gets the current tokenId, starting from 0 when the smart contract declares private _tokenIds.
    // So when "mintBeetle" is first called, newItemId is 0. When it's ran again, newItemId will be 1,
    // and so on! These are unique identifiers. _tokenIds is a state variable which means if it changes, 
    // the value is stored on the smart contract directly.
    uint256 newItemId = _tokenIds.current();

    uint256 newBeetle = pickBeetleCard(newItemId);

    // This gets all the JSON metadata in place and base64 encode it.
    string memory json = Base64.encode(
        bytes(
            string(
                abi.encodePacked(
                    '{"name":"',
                    names[newBeetle],
                    '","description":"',
                    descriptions[newBeetle],
                    '","image":"',
                    images[newBeetle],
                '"}'
            )
          )
        )
    );

    // This prepends data:application/json;base64, to the data.
    string memory tokenUri = string(
        abi.encodePacked("data:application/json;base64,", json)
    );

    console.log("\n--------------------");
    console.log(tokenUri);
    console.log("--------------------\n");

    // This will mint the NFT to the sender using msg.sender. Here, msg.sender is a variable Solidity itself 
    // provides that easily gives access to the public address of the person calling the smart contract. 
    // This is a super-secure way to get the user's public address. By using msg.sender you can't "fake" 
    // someone else's public address unless you have their wallet credentials and call the smart contract on 
    // their behalf! You can't call a smart contract anonymously, you need to have your wallet credentials 
    // connected. This is almost like "signing in" and being authenticated.
    _safeMint(msg.sender, newItemId);
    
    // This will set the NFTs unique identifier along with the data associated w/
    // that unique identifier. This is literally setting the actual data that makes the NFT valuable. 
    _setTokenURI(newItemId, tokenUri);
        
    // This will increment the counter for when the next NFT is minted. This is a function provided by
    // OpenZeppelin.
    _tokenIds.increment();
    console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);

    emit NewBeetleMint(msg.sender, newItemId);

  }
  }