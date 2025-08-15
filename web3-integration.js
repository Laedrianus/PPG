let web3;
let contract;
let userAccount;

const LEADERBOARD_CONTRACT_ADDRESS = "0x1f124e276e4b503e9d6852e0f4489cfdbb1b412c";
const LEADERBOARD_CONTRACT_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "submitted",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "best",
				"type": "uint256"
			}
		],
		"name": "ScoreSubmitted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "score",
				"type": "uint256"
			}
		],
		"name": "submitScore",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "bestScore",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "getPlayerScore",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTop50",
		"outputs": [
			{
				"internalType": "address[50]",
				"name": "addrs",
				"type": "address[50]"
			},
			{
				"internalType": "uint256[50]",
				"name": "scores",
				"type": "uint256[50]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "topAddresses",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "topScores",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const ORIGINAL_CONTRACT_ADDRESS = "0x15A96966a7003bfc63B58ee9658418DB72D3974D";
const ORIGINAL_CONTRACT_ABI = [
    {
        "inputs": [{"internalType": "uint256", "name": "score", "type": "uint256"}],
        "name": "submitScore",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "player", "type": "address"},
            {"internalType": "address", "name": "", "type": "address"}
        ],
        "name": "latestRoundData",
        "outputs": [
            {"internalType": "uint80", "name": "roundId", "type": "uint80"},
            {"internalType": "int256", "name": "answer", "type": "int256"},
            {"internalType": "uint256", "name": "startedAt", "type": "uint256"},
            {"internalType": "uint256", "name": "updatedAt", "type": "uint256"},
            {"internalType": "uint80", "name": "answeredInRound", "type": "uint80"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "player", "type": "address"}],
        "name": "getPlayerScore",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
];

let leaderboardContract;

const PHAROS_RPC_URL = "https://testnet.dplabs-internal.com";

const PHAROS_TESTNET_CONFIG = {
    chainId: '0xA86A8',
    chainName: 'Pharos Testnet',
    nativeCurrency: {
        name: 'PHAR',
        symbol: 'PHAR',
        decimals: 18
    },
    rpcUrls: [PHAROS_RPC_URL],
    blockExplorerUrls: ['https://testnet.pharosscan.xyz/'],
    iconUrls: []
};

async function switchOrAddPharosNetwork() {
    if (!window.ethereum) {
        console.error("MetaMask not installed!");
        return false;
    }

    const chainIdHex = PHAROS_TESTNET_CONFIG.chainId;

    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainIdHex }]
        });
        console.log("Switched to Pharos Testnet network.");
        return true;
    } catch (switchError) {
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [PHAROS_TESTNET_CONFIG]
                });
                console.log("Pharos Testnet network added and selected.");
                return true;
            } catch (addError) {
                console.error("Error adding network:", addError);
                return false;
            }
        } else {
            console.error("Could not switch network:", switchError);
            return false;
        }
    }
}

async function connectToWeb3Interactive() {
    try {
        if (window.ethereum) {
            const networkAdded = await switchOrAddPharosNetwork();
            if (!networkAdded) {
                return { success: false, error: 'Network configuration failed or was rejected.' };
            }

            web3 = new Web3(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts returned by wallet.');
            }
            userAccount = accounts[0];
            contract = new web3.eth.Contract(ORIGINAL_CONTRACT_ABI, ORIGINAL_CONTRACT_ADDRESS);
            leaderboardContract = new web3.eth.Contract(LEADERBOARD_CONTRACT_ABI, LEADERBOARD_CONTRACT_ADDRESS);
            console.log("Wallet connected:", userAccount);
            return { success: true, account: userAccount };
        } else {
            console.log("No wallet detected, falling back to read-only mode.");
            web3 = new Web3(new Web3.providers.HttpProvider(PHAROS_RPC_URL));
            contract = new web3.eth.Contract(ORIGINAL_CONTRACT_ABI, ORIGINAL_CONTRACT_ADDRESS);
            leaderboardContract = new web3.eth.Contract(LEADERBOARD_CONTRACT_ABI, LEADERBOARD_CONTRACT_ADDRESS);
            return { success: false, error: 'MetaMask or compatible wallet not detected.' };
        }
    } catch (err) {
        console.error('Connection error:', err);
        return { success: false, error: err.message || String(err) };
    }
}

function initReadOnlyWeb3() {
    if (web3) {
        console.log("Reinitializing read-only Web3 connection.");
    }
    
    try {
        web3 = new Web3(new Web3.providers.HttpProvider(PHAROS_RPC_URL));
        contract = new web3.eth.Contract(ORIGINAL_CONTRACT_ABI, ORIGINAL_CONTRACT_ADDRESS);
        leaderboardContract = new web3.eth.Contract(LEADERBOARD_CONTRACT_ABI, LEADERBOARD_CONTRACT_ADDRESS);
        console.log("Read-only Web3 initialized with RPC:", PHAROS_RPC_URL);
    } catch (err) {
        console.error('Error initializing read-only Web3:', err);
    }
}

async function submitScoreToBlockchain(score) {
    try {
        if (!web3 || !leaderboardContract) initReadOnlyWeb3();

        const accounts = await web3.eth.getAccounts();
        if (!accounts || accounts.length === 0) {
            return { success: false, error: 'Wallet not connected.' };
        }
        userAccount = accounts[0];

        let gas = 200000;
        try {
            gas = await leaderboardContract.methods.submitScore(score).estimateGas({ from: userAccount });
        } catch (e) {
            console.warn("Gas estimate failed, using fallback value.");
        }

        const tx = await leaderboardContract.methods.submitScore(score).send({
            from: userAccount,
            gas: Math.min(gas + 10000, 500000)
        });

        return { success: true, txHash: tx.transactionHash };
    } catch (error) {
        if (error.code === 4001 || (error.message && error.message.includes("User denied transaction signature"))) {
            console.log("User cancelled the transaction");
            return { success: false, error: "User cancelled the transaction" };
        }
        
        console.error('Submit score error:', error);
        return { success: false, error: error.message || "Transaction failed" };
    }
}

async function getLeaderboardFromBlockchain(limit = 50) {
    let localWeb3 = null;
    let localLeaderboardContract = null;
    try {
        localWeb3 = new Web3(new Web3.providers.HttpProvider(PHAROS_RPC_URL));
        localLeaderboardContract = new localWeb3.eth.Contract(LEADERBOARD_CONTRACT_ABI, LEADERBOARD_CONTRACT_ADDRESS);

        const result = await localLeaderboardContract.methods.getTop50().call({ cache: 'no-store' });
        
        let addrsArray, scoresArray;
        if (Array.isArray(result) && result.length === 2) {
            addrsArray = result[0];
            scoresArray = result[1];
        } else if (result && typeof result === 'object' && result.addrs !== undefined && result.scores !== undefined) {
            addrsArray = result.addrs;
            scoresArray = result.scores;
        } else {
            console.error("ERROR: Unexpected result format from getTop50:", result);
            throw new Error("Unexpected result format from contract");
        }

        if (!Array.isArray(addrsArray) || !Array.isArray(scoresArray)) {
            console.error("ERROR: Contract returned invalid data structure");
            throw new Error("Contract returned invalid data structure");
        }

        const rows = [];
        const loopLimit = Math.min(addrsArray.length, scoresArray.length, limit);

        for (let i = 0; i < loopLimit; i++) {
            const addr = addrsArray[i];
            const score = scoresArray[i];
            
            if (addr && addr !== "0x0000000000000000000000000000000000000000") {
                const parsedScore = parseInt(score, 10);
                rows.push({
                    player: addr,
                    score: parsedScore
                });
            }
        }

        return { success: true, rows: rows };
    } catch (error) {
        console.error("!!! FAILED to fetch leaderboard from blockchain !!!");
        console.error("Error details:", error);
        return { success: false, error: error.message || "Could not fetch leaderboard data." };
    } finally {
    }
}

window.connectToWeb3Interactive = connectToWeb3Interactive;
window.submitScoreToBlockchain = submitScoreToBlockchain;
window.getLeaderboardFromBlockchain = getLeaderboardFromBlockchain;
window.initReadOnlyWeb3 = initReadOnlyWeb3;

window.addEventListener('load', initReadOnlyWeb3);
