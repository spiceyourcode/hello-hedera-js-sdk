# Hello Hedera JS SDK
****
A beginner-friendly JavaScript application demonstrating how to interact with the Hedera Hashgraph network using the official Hedera JavaScript SDK. This project showcases fundamental operations including **account** creation, balance queries, and HBAR transfers on the Hedera testnet.

## 🚀 Features

- **Account Creation**: Create new Hedera accounts programmatically
- **Balance Queries**: Check account balances in real-time
- **HBAR Transfers**: Send HBAR between accounts with transaction verification
- **Testnet Integration**: Safe testing environment using Hedera testnet
- **Environment Configuration**: Secure private key management using environment variables

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- A **Hedera Testnet Account** with test HBAR
- Basic knowledge of JavaScript/Node.js

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/hello-hedera-js-sdk.git
cd hello-hedera-js-sdk
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with your Hedera testnet credentials:

```env
MY_ACCOUNT_ID=0.0.1234567
MY_PRIVATE_KEY=302e020100300506032b657004220420...
```

#### Getting Testnet Credentials:
1. Visit [Hedera Portal](https://portal.hedera.com)
2. Create a free account
3. Generate testnet credentials
4. Fund your account with test HBAR using the [Hedera Faucet](https://portal.hedera.com/faucet)

### 4. Run the Application
```bash
node index.js
```

## 📖 Code Overview

### Main Components

#### 1. Client Setup
```javascript
const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);
```

#### 2. Account Creation
- Generates new ED25519 key pair
- Creates account with 1,000 tinybar initial balance
- Returns new account ID for future operations

#### 3. Balance Verification
```javascript
const accountBalance = await new AccountBalanceQuery()
    .setAccountId(newAccountId)
    .execute(client);
```

#### 4. HBAR Transfer
- Transfers 1,000 tinybar from operator account to new account
- Verifies transaction status on the network

## 🔧 Project Structure

```
hello-hedera-js-sdk/
├── index.js              # Main application file
├── package.json          # Project dependencies
├── package-lock.json     # Dependency lock file
├── .env                  # Environment variables (create this)
├── .gitignore           # Git ignore file
└── README.md            # This file
```

## 🧪 Testing

The application performs the following sequence:
1. **Environment Validation**: Checks for required environment variables
2. **Client Initialization**: Sets up connection to Hedera testnet
3. **Account Creation**: Creates new account with generated keys
4. **Balance Check**: Verifies initial balance of new account
5. **Transfer Execution**: Sends HBAR between accounts
6. **Transaction Verification**: Confirms successful transaction

## 📊 Expected Output

When you run the application successfully, you should see output similar to:

```
the new account ID is: 0.0.1234568
the new account balance is: 1000 tinybar.
The transfer transaction from my account to the new account was: SUCCESS
```

## 🔍 Troubleshooting

### Common Issues

#### "the two variables must be available"
- **Cause**: Missing `.env` file or environment variables
- **Solution**: Ensure `.env` file exists with correct `MY_ACCOUNT_ID` and `MY_PRIVATE_KEY`

#### "INSUFFICIENT_PAYER_BALANCE"
- **Cause**: Not enough test HBAR in your account
- **Solution**: Use the [Hedera Faucet](https://portal.hedera.com/faucet) to get more test HBAR

#### Network Connection Issues
- **Cause**: Internet connectivity or firewall issues
- **Solution**: Check your internet connection and ensure testnet endpoints are accessible

## 🌐 Network Information

- **Network**: Hedera Testnet
- **Explorer**: [HashScan Testnet Explorer](https://hashscan.io/testnet)
- **Faucet**: [Hedera Testnet Faucet](https://portal.hedera.com/faucet)

## 📝 Next Steps

After successfully running this project, consider exploring:

1. **Smart Contracts**: Deploy and interact with smart contracts
2. **Token Operations**: Create and manage fungible/non-fungible tokens
3. **File Service**: Store and retrieve files on Hedera
4. **Consensus Service**: Submit messages to Hedera consensus
5. **Scheduled Transactions**: Create time-based transaction execution

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

## 🙏 Acknowledgments

- [Hedera Documentation](https://docs.hedera.com)
- [Hedera JavaScript SDK](https://github.com/hashgraph/hedera-sdk-js)
- Hedera Developer Community

## 📞 Support

If you have questions or need help:
- Check the [Hedera Documentation](https://docs.hedera.com)
- Join the [Hedera Discord](https://hedera.com/discord)
- Open an issue in this repository
