const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  AccountBalanceQuery,
  Hbar,
  TokenType,
  TokenCreateTransaction,
  TokenSupplyType,
  TokenMintTransaction,
  TransferTransaction,
  TokenAssociateTransaction,
} = require("@hashgraph/sdk");
require("dotenv").config();

async function environmentSetup() {
  // Grab the hedera testnet accountID  and private key from the .env file
  const myAccountId = process.env.My_ACCOUNT_ID;
  const myPrivateKey = process.env.MY_PRIVATE_KEY;

  if (!myAccountId || !myPrivateKey) {
    throw new Error("the two variables must be avalable ");
  }

  const client = Client.forTestnet();
  client.setOperator(myAccountId, myPrivateKey);
  client.setDefaultMaxTransactionFee(new Hbar(100));
  client.setMaxQueryPayment(new Hbar(50));

  // setting the new keys
  const newAccountPrivateKey = PrivateKey.generateED25519();
  const newAccountPublicKey = newAccountPrivateKey.publicKey;

  // creating a new account with 1,000 tinybar starting balance
  const newAccount = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .setInitialBalance(Hbar.fromTinybars(1000))
    .execute(client);
  // getting the new account ID

  const getReceipt = await newAccount.getReceipt(client);
  const newAccountId = getReceipt.accountId;

  // logging the account ID
  console.log("the new account ID is: " + newAccountId);

  const supplyKey = PrivateKey.generate();

  //Create the NFT
  const nftCreate = await new TokenCreateTransaction()
    .setTokenName("Hedera Token Test")
    .setTokenSymbol("HTT")
    .setTokenType(TokenType.NonFungibleUnique)
    .setDecimals(0)
    .setInitialSupply(0)
    .setTreasuryAccountId(myAccountId)
    .setSupplyType(TokenSupplyType.Finite)
    .setMaxSupply(250)
    .setSupplyKey(supplyKey)
    .freezeWith(client);
  // log the supply key
  console.log(`Supply key: ${supplyKey} \n`);

  //Sign the transaction with the treasury key
  const nftCreateTxSign = await nftCreate.sign(PrivateKey.fromString(myPrivateKey));

  //Submit the transaction to a Hedera network
  const nftCreateSubmit = await nftCreateTxSign.execute(client);

  //Get the transaction receipt
  const nftCreateRx = await nftCreateSubmit.getReceipt(client);

  //Get the token ID
  const tokenId = nftCreateRx.tokenId;

  //Log the token ID
  console.log("Created NFT with Token ID: " + tokenId);

  // Max transaction fee as a constant
  const maxTransactionFee = new Hbar(20);

  //IPFS content identifiers for which we will create a NFT
  const CID = [
    Buffer.from(
      "ipfs://bafyreiao6ajgsfji6qsgbqwdtjdu5gmul7tv2v3pd6kjgcw5o65b2ogst4/metadata.json"
    ),
    Buffer.from(
      "ipfs://bafyreic463uarchq4mlufp7pvfkfut7zeqsqmn3b2x3jjxwcjqx6b5pk7q/metadata.json"
    ),
    Buffer.from(
      "ipfs://bafyreihhja55q6h2rijscl3gra7a3ntiroyglz45z5wlyxdzs6kjh2dinu/metadata.json"
    ),
    Buffer.from(
      "ipfs://bafyreidb23oehkttjbff3gdi4vz7mjijcxjyxadwg32pngod4huozcwphu/metadata.json"
    ),
    Buffer.from(
      "ipfs://bafyreie7ftl6erd5etz5gscfwfiwjmht3b52cevdrf7hjwxx5ddns7zneu/metadata.json"
    ),
  ];

  // MINT NEW BATCH OF NFTs
  const mintTx = new TokenMintTransaction()
    .setTokenId(tokenId)
    .setMetadata(CID) //Batch minting - UP TO 10 NFTs in single tx
    .setMaxTransactionFee(maxTransactionFee)
    .freezeWith(client);

  //Sign the transaction with the supply key
  const mintTxSign = await mintTx.sign(supplyKey);

  //Submit the transaction to a Hedera network
  const mintTxSubmit = await mintTxSign.execute(client);

  //Get the transaction receipt
  const mintRx = await mintTxSubmit.getReceipt(client);

  //Log the serial number
  console.log(
    "Created NFT " + tokenId + " with serial number: " + mintRx.serials
  );

  //Create the associate transaction and sign with Alice's key
  const associateAccountTx = await new TokenAssociateTransaction()
    .setAccountId(newAccountId)
    .setTokenIds([tokenId])
    .freezeWith(client)
    .sign(newAccountPrivateKey);

  //Submit the transaction to a Hedera network
  const associateAccountTxSubmit = await associateAccountTx.execute(client);

  //Get the transaction receipt
  const associateAccountRx = await associateAccountTxSubmit.getReceipt(client);

  //Confirm the transaction was successful
  console.log(
    `NFT association with new account: ${associateAccountRx.status}\n`
  );
  // Check the balance before the transfer for the treasury account
  var balanceCheckTx = await new AccountBalanceQuery()
    .setAccountId(myAccountId)
    .execute(client);
  console.log(
    `Treasury balance: ${balanceCheckTx.tokens._map.get(
      tokenId.toString()
    )} NFTs of ID ${tokenId}`
  );

  // Check the balance before the transfer for Alice's account
  var balanceCheckTx = await new AccountBalanceQuery()
    .setAccountId(newAccountId)
    .execute(client);
  console.log(
    `Alice's balance: ${balanceCheckTx.tokens._map.get(
      tokenId.toString()
    )} NFTs of ID ${tokenId}`
  );

  // Transfer the NFT from treasury to Alice
  // Sign with the treasury key to authorize the transfer
  const tokenTransferTx = await new TransferTransaction()
    .addNftTransfer(tokenId, 1, myAccountId, newAccountId)
    .freezeWith(client)
    .sign(PrivateKey.fromString(myPrivateKey));

  const tokenTransferSubmit = await tokenTransferTx.execute(client);
  const tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

  console.log(
    `\nNFT transfer from Treasury to new Account: ${tokenTransferRx.status} \n`
  );

}

environmentSetup();
