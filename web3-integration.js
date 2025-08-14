let web3;
let contract;
let userAccount;
// --- YENI: Liderlik Sözleşmesi Bilgileri ---
// Güncellenmiş sözleşme adresi: 0x1f124e276e4b503e9d6852e0f4489cfdbb1b412c
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
// --- YENI SON ---
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
// --- YENI: Liderlik sözleşmesi nesnesi ---
let leaderboardContract;
// --- YENI SON ---
// --- GUNCELLENMIS RPC URL ---
const PHAROS_RPC_URL = "https://testnet.dplabs-internal.com";
// --- GUNCELLENMIS RPC URL SON ---
// --- METAMASK AĞ YAPILANDIRMA ---
const PHAROS_TESTNET_CONFIG = {
    chainId: '0x' + (688688).toString(16), // Hex formatında doğru chain ID: 688688
    chainName: 'Pharos Testnet',
    nativeCurrency: {
        name: 'PHAR',
        symbol: 'PHAR',
        decimals: 18
    },
    rpcUrls: ['https://testnet.dplabs-internal.com'],
    blockExplorerUrls: ['https://testnet.pharosscan.xyz/'],
    iconUrls: [] // Opsiyonel
};

// --- YENI: Oyun Alanı Mesaj Fonksiyonu ---
/**
 * Oyun alanının ortasında, belirli bir stil ve animasyonla bir mesaj gösterir.
 * @param {string} text - Gösterilecek metin (örnek: "READY TO PHAROS MAINNET").
 * @param {number} durationMs - Mesajın ekranda kalma süresi (milisaniye cinsinden). Yanıp sönme animasyonu bu süreye göre hesaplanır.
 * @param {boolean} isPersistent - True ise mesaj süre bitiminde kaybolmaz, yeniden başlatılana kadar kalır.
 * @param {string} customClass - (Opsiyonel) Mesaja özel CSS sınıfı eklemek için.
 */
function showGameAreaMessage(text, durationMs = 2000, isPersistent = false, customClass = '') {
    // 1. Oyun alanını temsil eden HTML elementini bulun.
    //    Bu, oyun ızgarasını içeren elementin ID'si veya class'ı olmalıdır.
    //    Örnek ID'ler: 'game-container', 'grid-container', 'game-board'
    const gameAreaElement = document.querySelector('.game-container'); // veya ID ile: document.getElementById('game-container');

    if (!gameAreaElement) {
        console.warn('Oyun alanı elementi bulunamadı. Mesaj gösterilemedi.');
        return;
    }

    // 2. Yeni bir div elementi oluşturun.
    const messageElement = document.createElement('div');
    messageElement.className = `game-area-message ${customClass}`.trim(); // Temel sınıf + özel sınıf
    messageElement.textContent = text;
    messageElement.id = 'pharos-mainnet-message'; // Sonradan kolayca bulmak/silmek için ID

    // 3. CSS stillerini doğrudan uygulayın (veya bir CSS sınıfı tanımlayıp onu kullanın).
    //    Aşağıdaki stiller, mesajın ortalanmasını, büyük görünmesini ve animasyon için hazırlık yapar.
    const baseStyles = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%); /* Tam ortala */
        font-size: 3vw; /* Görüntüleme boyutuna göre ölçeklenebilir */
        font-weight: bold;
        color: rgba(255, 255, 255, 0); /* Başlangıçta tamamen şeffaf */
        text-align: center;
        pointer-events: none; /* Fare etkileşimlerini engelle, alttaki oyun etkileşimi bozulmasın */
        z-index: 100; /* Diğer elementlerin üstünde olduğundan emin olun */
        transition: opacity 1s ease-in-out, color 1s ease-in-out; /* Yumuşak geçişler */
        text-shadow: 0 0 15px rgba(0, 255, 255, 0.8); /* Pharos mavisi gibi bir ışık efekti */
        /* width: 100%;  Genişliği oyun alanına göre ayarlamak için */
        /* word-break: break-word; Uzun metinler için */
    `;
    messageElement.style.cssText = baseStyles;

    // 4. Elementi oyun alanına ekleyin.
    gameAreaElement.style.position = 'relative'; // Container'ın konum bağlamı olması gerekir
    gameAreaElement.appendChild(messageElement);

    // 5. Bir sonraki frame'de (tarayıcı render ettikten sonra) animasyonu başlatın.
    requestAnimationFrame(() => {
        // Metni görünür ve parlak yap
        messageElement.style.color = 'rgba(255, 255, 255, 1)'; // Tam opak
        // Opsiyonel: Renk değişimini da ekleyebilirsiniz, örneğin maviye geçiş
        // messageElement.style.color = 'rgba(0, 255, 255, 1)';
    });

    // 6. Süre dolduğunda mesajı gizle veya kalıcı bırak.
    if (!isPersistent) {
        setTimeout(() => {
            // Kaybolma animasyonu: Opaklık azalır
            messageElement.style.color = 'rgba(255, 255, 256, 0)'; // Tekrar şeffaf yap
            // Animasyon tamamlandıktan sonra elementi DOM'dan kaldır
            setTimeout(() => {
                if (messageElement.parentNode === gameAreaElement) {
                    gameAreaElement.removeChild(messageElement);
                }
            }, 1000); // Bu süre, CSS transition süresiyle eşleşmelidir (1s)
        }, durationMs);
    }
    // isPersistent true ise, element DOM'da kalır. Oyun yeniden başlatıldığında kaldırılmalıdır.
}
// --- YENI SON: Oyun Alanı Mesaj Fonksiyonu ---

async function switchOrAddPharosNetwork() {
    if (!window.ethereum) {
        alert("MetaMask yüklü değil!");
        return false;
    }
    const chainIdHex = PHAROS_TESTNET_CONFIG.chainId;
    try {
        // Önce ağa geçmeye çalış
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainIdHex }]
        });
        console.log("Zaten Pharos Testnet ağına bağlı.");
        return true;
    } catch (switchError) {
        // Ağ yoksa ekle
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [PHAROS_TESTNET_CONFIG]
                });
                console.log("Pharos Testnet ağı başarıyla eklendi.");
                return true;
            } catch (addError) {
                console.error("Ağ eklenirken hata oluştu:", addError);
                alert("Ağ eklenemedi. Lütfen manuel olarak ekleyin.");
                return false;
            }
        } else {
            console.error("Ağ değiştirilemedi:", switchError);
            alert("Ağ değiştirilemedi. Lütfen manuel olarak değiştirin.");
            return false;
        }
    }
}
// --- METAMASK AĞ YAPILANDIRMA SON ---
async function connectToWeb3Interactive() {
    try {
        if (window.ethereum) {
            // Ağ kontrolü ve gerekirse ekleme/değiştirme
            const networkAdded = await switchOrAddPharosNetwork();
            if (!networkAdded) {
                return { success: false, error: 'Ağ yapılandırması başarısız oldu.' };
            }
            web3 = new Web3(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts returned');
            }
            userAccount = accounts[0];
            contract = new web3.eth.Contract(ORIGINAL_CONTRACT_ABI, ORIGINAL_CONTRACT_ADDRESS);
            // --- YENI: Liderlik sözleşmesini başlat ---
            leaderboardContract = new web3.eth.Contract(LEADERBOARD_CONTRACT_ABI, LEADERBOARD_CONTRACT_ADDRESS);
            // --- YENI SON ---

            // *** YENI EKLEME ***
            // Cüzdan başarıyla bağlandıktan sonra "READY TO PHAROS MAINNET" mesajını göster
            if (typeof showGameAreaMessage === 'function') {
                showGameAreaMessage("READY TO PHAROS MAINNET", 2000, false, 'mainnet-ready');
            }
            // *** YENI EKLEME SONU ***

            return { success: true, account: userAccount };
        } else {
            web3 = new Web3(new Web3.providers.HttpProvider(PHAROS_RPC_URL));
            contract = new web3.eth.Contract(ORIGINAL_CONTRACT_ABI, ORIGINAL_CONTRACT_ADDRESS);
            // --- YENI: Liderlik sözleşmesini başlat ---
            leaderboardContract = new web3.eth.Contract(LEADERBOARD_CONTRACT_ABI, LEADERBOARD_CONTRACT_ADDRESS);
            // --- YENI SON ---
            return { success: false, error: 'MetaMask not detected' };
        }
    } catch (err) {
        console.error('Connection error:', err);
        return { success: false, error: err.message || String(err) };
    }
}
function initReadOnlyWeb3() {
    // Her zaman yeni bir web3 başlat ve doğrudan RPC'yi kullan
    // window.ethereum'in durumu belirsiz olduğu için güvenli değil
    if (web3) {
        // Zaten başlatılmışsa, tekrar başlatmadan önce temizleyelim
        // (Opsiyonel: web3.version vs gibi kontrol ederek)
        // Ancak genellikle yeni başlatmak daha güvenlidir.
        console.log("Web3 zaten başlatılmış. Yeniden başlatılıyor.");
    }
    try {
        // window.ethereum yerine doğrudan RPC'yi kullan
        // Bu, hem gizli hem de normal pencerede tutarlı davranış sağlar
        web3 = new Web3(new Web3.providers.HttpProvider(PHAROS_RPC_URL));
        contract = new web3.eth.Contract(ORIGINAL_CONTRACT_ABI, ORIGINAL_CONTRACT_ADDRESS);
        // --- YENI: Liderlik sözleşmesini başlat ---
        leaderboardContract = new web3.eth.Contract(LEADERBOARD_CONTRACT_ABI, LEADERBOARD_CONTRACT_ADDRESS);
        // --- YENI SON ---
        console.log("Read-only Web3 başlatıldı. RPC:", PHAROS_RPC_URL);

        // *** YENI EKLEME ***
        // Sayfa yüklendiğinde (salt okunur bağlantı kurulduğunda) "READY TO PHAROS MAINNET" mesajını göster
        // Bu, kullanıcının cüzdanı olmasa bile mesajın görünmesini sağlar.
        setTimeout(() => { // Kısa bir gecikme, DOM'un tamamen yüklenmesi için
             if (typeof showGameAreaMessage === 'function') {
                showGameAreaMessage("READY TO PHAROS MAINNET", 2000, false, 'mainnet-ready');
            }
        }, 500);
       
        // *** YENI EKLEME SONU ***
    } catch (err) {
        console.error('Init error:', err);
    }
}
// --- DEĞİŞTİRİLDİ: Skor gönderme fonksiyonu artık yeni liderlik sözleşmesini kullanacak ---
async function submitScoreToBlockchain(score) {
    try {
        if (!web3 || !leaderboardContract) initReadOnlyWeb3(); // <-- leaderboardContract kullan
        const accounts = await web3.eth.getAccounts();
        if (!accounts || accounts.length === 0) {
            return { success: false, error: 'Wallet not connected' };
        }
        userAccount = accounts[0];
        let gas = 200000;
        try {
            // <-- leaderboardContract.methods kullan
            gas = await leaderboardContract.methods.submitScore(score).estimateGas({ from: userAccount });
        } catch (e) {
            console.warn("Gas estimate failed, using fallback");
        }
        // <-- leaderboardContract.methods.send kullan
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
// --- GUNCELLENMIS FONKSIYON: Liderlik tablosunu çek (Hata ayıklama eklenmiş) ---
// *** TAMAMEN YENİLENMİŞ SÜRÜM ***
async function getLeaderboardFromBlockchain(limit = 50) {
    let localWeb3 = null;
    let localLeaderboardContract = null;
    try {
        // HER ZAMAN doğrudan RPC ile yeni bir web3 nesnesi oluştur
        // Bu, cüzdan durumundan bağımsız olarak doğru ağa bağlanmamızı sağlar
        localWeb3 = new Web3(new Web3.providers.HttpProvider(PHAROS_RPC_URL));
        localLeaderboardContract = new localWeb3.eth.Contract(LEADERBOARD_CONTRACT_ABI, LEADERBOARD_CONTRACT_ADDRESS);
        console.log("DEBUG: About to call getTop50 on contract:", LEADERBOARD_CONTRACT_ADDRESS, "via RPC:", PHAROS_RPC_URL);
        // getTop50 fonksiyonunu çağır - Cache engelleme eklendi
        const result = await localLeaderboardContract.methods.getTop50().call({ cache: 'no-store' });
        console.log("DEBUG: Raw result received from getTop50:", result);
        console.log("DEBUG: Type of result:", typeof result);
        console.log("DEBUG: Is result an array?", Array.isArray(result));
        // Web3.js bazen sonuçları farklı şekilde döndürebilir
        let addrsArray, scoresArray;
        if (Array.isArray(result)) {
            // Eski Web3.js sürümleri bazen array olarak döndürebilir
            console.log("DEBUG: Result is an array. Length:", result.length);
            if (result.length === 2) {
                addrsArray = result[0];
                scoresArray = result[1];
                console.log("DEBUG: Parsed from array - addrs:", addrsArray, "scores:", scoresArray);
            } else {
                console.error("ERROR: Unexpected array format from getTop50");
                throw new Error("Unexpected result format from contract");
            }
        } else if (result && typeof result === 'object' && result.addrs !== undefined && result.scores !== undefined) {
            // Yeni Web3.js sürümleri genellikle isimlendirilmiş obje olarak döndürür
            addrsArray = result.addrs;
            scoresArray = result.scores;
            console.log("DEBUG: Parsed from object - addrs:", addrsArray, "scores:", scoresArray);
        } else {
            console.error("ERROR: Unknown result format from getTop50:", result);
            throw new Error("Unknown result format from contract");
        }
        console.log("DEBUG: Type of addrsArray:", typeof addrsArray, "Is Array?", Array.isArray(addrsArray));
        console.log("DEBUG: Type of scoresArray:", typeof scoresArray, "Is Array?", Array.isArray(scoresArray));
        if (!Array.isArray(addrsArray) || !Array.isArray(scoresArray)) {
            console.error("ERROR: addrs or scores is not an array!");
            throw new Error("Contract returned invalid data structure");
        }
        console.log("DEBUG: addrsArray length:", addrsArray.length);
        console.log("DEBUG: scoresArray length:", scoresArray.length);
        const rows = [];
        const loopLimit = Math.min(addrsArray.length, scoresArray.length, limit);
        console.log("DEBUG: Processing up to", loopLimit, "entries");
        for (let i = 0; i < loopLimit; i++) {
            const addr = addrsArray[i];
            const score = scoresArray[i];
            console.log("DEBUG: Processing entry", i, "Address:", addr, "Score:", score);
            if (addr && addr !== "0x0000000000000000000000000000000000000000") {
                const parsedScore = parseInt(score, 10);
                console.log("DEBUG: Adding valid entry - Address:", addr, "Parsed Score:", parsedScore);
                rows.push({
                    player: addr,
                    score: parsedScore
                });
            } else {
                console.log("DEBUG: Skipping entry", i, "- Address is zero or invalid");
            }
        }
        console.log("DEBUG: Final leaderboard rows:", rows);
        return { success: true, rows: rows };
    } catch (error) {
        console.error("!!! FAILED to fetch leaderboard !!!");
        console.error("Error object:", error);
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error code:", error.code);
        console.error("Error reason:", error.reason);
        // Hatanın yığın izini (stack trace) de alalım
        if (error.stack) {
            console.error("Error stack:", error.stack);
        }
        return { success: false, error: error.message || "Could not fetch leaderboard" };
    } finally {
        // localWeb3 bağlantısını temizle (opsiyonel, JS çöp toplayıcısı halledebilir)
        if (localWeb3) {
            // Web3.js'nin HttpProvider'ı için özel bir kapatma işlemi genellikle gerekmez
            // Ancak gelecekte websocket kullanılırsa önemli olabilir.
        }
    }
}
// --- GUNCELLENMIS FONKSIYON SON ---
// Globala aç
window.connectToWeb3Interactive = connectToWeb3Interactive;
window.submitScoreToBlockchain = submitScoreToBlockchain;
// --- YENI: getLeaderboardFromBlockchain global olarak açıldı ---
window.getLeaderboardFromBlockchain = getLeaderboardFromBlockchain;
// --- YENI SON ---
window.initReadOnlyWeb3 = initReadOnlyWeb3;
window.switchOrAddPharosNetwork = switchOrAddPharosNetwork;

// *** YENI EKLEME: showGameAreaMessage fonksiyonunu global yap ***
window.showGameAreaMessage = showGameAreaMessage;
// *** YENI EKLEME SONU ***

// Sayfa yüklendiğinde readonly başlat
window.addEventListener('load', initReadOnlyWeb3);
