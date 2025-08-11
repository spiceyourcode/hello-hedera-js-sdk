const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  AccountBalanceQuery,
  Hbar,
  TokenType,
  TokenCreateTransaction,
  TokenSupplyType,
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

  // verifying the account balance
  const accountBalance = await new AccountBalanceQuery()
    .setAccountId(newAccountId)
    .execute(client);

  console.log(
    "the new account balance is: " +
      accountBalance.hbars.toTinybars() +
      " tinybar."
  );

  const supplyKey = PrivateKey.generate();

  // CREATE FUNGIBLE TOKEN (STABLECOIN)
  let tokenCreateTx = await new TokenCreateTransaction()
    .setTokenName("Hedera Tutorial Token")
    .setTokenSymbol("HTT")
    .setTokenType(TokenType.FungibleCommon)
    .setDecimals(2)
    .setInitialSupply(10000)
    .setTreasuryAccountId(myAccountId)
    .setSupplyType(TokenSupplyType.Infinite)
    .setSupplyKey(supplyKey)
    .freezeWith(client);

  //SIGN WITH TREASURY KEY
  let tokenCreateSign = await tokenCreateTx.sign(PrivateKey.fromString(myPrivateKey));

  //SUBMIT THE TRANSACTION
  let tokenCreateSubmit = await tokenCreateSign.execute(client);

  //GET THE TRANSACTION RECEIPT
  let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);

  //GET THE TOKEN ID
  let tokenId = tokenCreateRx.tokenId;

  //LOG THE TOKEN ID TO THE CONSOLE
  console.log(`- Created token with ID: ${tokenId} \n`);

  const transaction = await new TokenAssociateTransaction()
    .setAccountId(newAccountId)
    .setTokenIds([tokenId])
    .freezeWith(client);

  const signTx = await transaction.sign(newAccountPrivateKey);

  const txResponse = await signTx.execute(client);

  const associationReceipt = await txResponse.getReceipt(client);

  const transactionStatus =associationReceipt.status; 
  
  console.log("Transaction of association was: " +transactionStatus);

  const transferTransaction = await new TransferTransaction()
    .addTokenTransfer(tokenId , myAccountId, -10)
    .addTokenTransfer(tokenId , newAccountId, 10)
    .freezeWith(client);
  
  const signTransferTx = await transferTransaction.sign(PrivateKey.fromString(myPrivateKey));
  const transferTxResponse = await signTransferTx.execute(client);
  const transferReceipt = await transferTxResponse.getReceipt(client);
  const transferStatus = transferReceipt.status;

  console.log("The status of the token transfer is: "+transferStatus);    

}
environmentSetup();
