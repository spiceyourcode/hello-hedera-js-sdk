const
 { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction}
 = require("@hashgraph/sdk");
require('dotenv').config();

async function environmentSetup(){
    // Grab the hedera testnet accountID  and private key from the .env file
    const myAccountId = process.env.My_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;
    
    if(!myAccountId || ! myPrivateKey){
        throw new Error ( "the two variables must be avalable ")    
        
    }

    const client = Client.forTestnet();
    
    client.setOperator(myAccountId, myPrivateKey);
    
    client.setDefaultMaxTransactionFee(new Hbar(100));
    
    client.setMaxQueryPayment( new Hbar(50));

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
    console.log("the new account ID is: " +newAccountId);
    
    // verifying the account balance 
    const accountBalance = await new AccountBalanceQuery()
    .setAccountId(newAccountId)
    .execute(client);

    console.log("the new account balance is: " + accountBalance.hbars.toTinybars()+ " tinybar.");

    // creating transfer transaction
    const sendHbar = await new TransferTransaction()
    .addHbarTransfer(myAccountId, Hbar.fromTinybars(-1000)) // sending account
    .addHbarTransfer(newAccountId, Hbar.fromTinybars(1000)) //Receiving account 
    .execute(client);

    //verifying the transaction reached concesus 
    const transactionReceipt = await sendHbar.getReceipt(client);
    console.log("The transfer transaction from my account to the new account was: "+transactionReceipt.status.toString());
    

    

}
environmentSetup(); 
