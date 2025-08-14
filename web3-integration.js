// web3-integration.js

let web3;
let contract;
let userAccount;

// Liderlik Sözleşmesi Bilgileri
const LEADERBOARD_CONTRACT_ADDRESS = "0x1f124e276e4b503e9d6852e0f4489cfdbb1b412c";
const LEADERBOARD_CONTRACT_ABI = [ /* Buraya kendi ABI’nı koy */ ];

const ORIGINAL_CONTRACT_ADDRESS = "0x15A96966a7003bfc63B58ee9658418DB72D3974D";
const ORIGINAL_CONTRACT_ABI = [ /* Buraya kendi ABI’nı koy */ ];

// Liderlik sözleşmesi nesnesi
let leaderboardContract;

// RPC URL
const PHAROS_RPC_URL = "https://testnet.dplabs-internal.com";

// Pharos Testnet Ağ Parametreleri (chainId otomatik güncellenecek)
let PHAROS_TESTNET_PARAMS = {
  chainId: '0xA86A8',
  chainName: 'Pharos Testnet',
  nativeCurrency: { name: 'PHR', symbol: 'PHR', decimals: 18 },
  rpcUrls: [PHAROS_RPC_URL],
  blockExplorerUrls: ['https://testnet.pharosscan.xyz'],
};

// RPC’den chainId tespit et
async function detectChainIdFromRpc() {
  try {
    const res = await fetch(PHAROS_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_chainId',
        params: []
      })
    });
    const data = await res.json();
    if (data && data.result) {
      console.log("RPC Chain ID bulundu:", data.result);
      PHAROS_TESTNET_PARAMS.chainId = data.result;
    }
  } catch (err) {
    console.error("RPC’den chainId alınamadı:", err);
  }
}

// MetaMask ile bağlantı
async function connectToWeb3Interactive() {
  try {
    await detectChainIdFromRpc();

    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) throw new Error('No accounts returned');
      userAccount = accounts[0];

      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log("Mevcut Chain ID:", currentChainId);
      console.log("Beklenen Chain ID:", PHAROS_TESTNET_PARAMS.chainId);

      if (currentChainId !== PHAROS_TESTNET_PARAMS.chainId) {
        console.log("Ağ değiştirme/ekleme başlatılıyor...");
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: PHAROS_TESTNET_PARAMS.chainId }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            console.log("Ağ ekleniyor...");
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [PHAROS_TESTNET_PARAMS],
            });
          } else {
            throw new Error(`Ağ değiştirilemedi: ${switchError.message || String(switchError)}`);
          }
        }
      }

      web3 = new Web3(window.ethereum);
      contract = new web3.eth.Contract(ORIGINAL_CONTRACT_ABI, ORIGINAL_CONTRACT_ADDRESS);
      leaderboardContract = new web3.eth.Contract(LEADERBOARD_CONTRACT_ABI, LEADERBOARD_CONTRACT_ADDRESS);

      console.log("Bağlantı başarılı:", userAccount);
      return { success: true, account: userAccount };
    } else {
      console.log("MetaMask bulunamadı, salt okunur moda geçiliyor.");
      initReadOnlyWeb3();
      return { success: false, error: 'MetaMask not detected' };
    }
  } catch (err) {
    console.error('Connection error:', err);
    return { success: false, error: err.message || String(err) };
  }
}

// Read-only bağlantı
function initReadOnlyWeb3() {
  try {
    web3 = new Web3(new Web3.providers.HttpProvider(PHAROS_RPC_URL));
    contract = new web3.eth.Contract(ORIGINAL_CONTRACT_ABI, ORIGINAL_CONTRACT_ADDRESS);
    leaderboardContract = new web3.eth.Contract(LEADERBOARD_CONTRACT_ABI, LEADERBOARD_CONTRACT_ADDRESS);
    console.log("Read-only Web3 başlatıldı.");
  } catch (err) {
    console.error('Init error:', err);
  }
}

// Skor gönderme
async function submitScoreToBlockchain(score) {
  try {
    if (!web3 || !leaderboardContract) initReadOnlyWeb3();

    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) return { success: false, error: 'Wallet not connected' };
    userAccount = accounts[0];

    let gas = 200000;
    try {
      gas = await leaderboardContract.methods.submitScore(score).estimateGas({ from: userAccount });
    } catch {
      console.warn("Gas tahmini başarısız, varsayılan kullanılıyor");
    }

    const tx = await leaderboardContract.methods.submitScore(score).send({
      from: userAccount,
      gas: Math.min(gas + 10000, 500000)
    });

    return { success: true, txHash: tx.transactionHash };
  } catch (error) {
    console.error('Submit error:', error);
    return { success: false, error: error.message || "Transaction failed" };
  }
}

// Liderlik tablosu alma
async function getLeaderboardFromBlockchain(limit = 50) {
  try {
    const localWeb3 = new Web3(new Web3.providers.HttpProvider(PHAROS_RPC_URL));
    const localLeaderboardContract = new localWeb3.eth.Contract(LEADERBOARD_CONTRACT_ABI, LEADERBOARD_CONTRACT_ADDRESS);
    const result = await localLeaderboardContract.methods.getTop50().call();

    let addrsArray, scoresArray;
    if (Array.isArray(result) && result.length === 2) {
      addrsArray = result[0];
      scoresArray = result[1];
    } else if (result && result.addrs && result.scores) {
      addrsArray = result.addrs;
      scoresArray = result.scores;
    } else {
      throw new Error("Unexpected result format from contract");
    }

    const rows = [];
    for (let i = 0; i < Math.min(addrsArray.length, scoresArray.length, limit); i++) {
      if (addrsArray[i] && addrsArray[i] !== "0x0000000000000000000000000000000000000000") {
        rows.push({ player: addrsArray[i], score: parseInt(scoresArray[i], 10) });
      }
    }
    return { success: true, rows };
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return { success: false, error: error.message || "Could not fetch leaderboard" };
  }
}

// Global erişim
window.connectToWeb3Interactive = connectToWeb3Interactive;
window.submitScoreToBlockchain = submitScoreToBlockchain;
window.getLeaderboardFromBlockchain = getLeaderboardFromBlockchain;
window.initReadOnlyWeb3 = initReadOnlyWeb3;

window.addEventListener('load', initReadOnlyWeb3);
