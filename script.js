<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Pirate Parrot Game</title>
  <link rel="stylesheet" href="style.css" />
  <!-- Ethers (mevcut projende kullanıyorsun) -->
  <script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.min.js  "></script>
</head>
<body>
  <div id="gameContainer">
    <div id="gameHeader">
      <h1>Pirate Parrot Game</h1>
      <div id="scoreDisplay">Score: 0</div>
    </div>

    <div id="bonusContainer">
      <div id="pharosBonus" class="bonus-message hidden">
        <span>BONUS: FOLLOW Pharos on X</span>
        <button class="follow-button" data-key="pharos" id="pharosFollowBtn">Follow</button>
      </div>
      <div id="blocksenseBonus" class="bonus-message hidden">
        <span>BONUS: FOLLOW Blocksense on X</span>
        <button class="follow-button" data-key="blocksense" id="blocksenseFollowBtn">Follow</button>
      </div>
    </div>

    <div id="mainContent">
      <div id="gameArea">
        <!-- Splash Screen - Başlangıçta görünür, cüzdan bağlandığında kaybolur -->
        <div id="splashScreen" class="hidden">
          <img src="assets/logo.png" alt="Pirate Parrot Game" style="max-width: 80%; max-height: 80%;">
        </div>

        <canvas id="gameCanvas" width="800" height="600"></canvas>

        <div id="gameControls">
          <div id="bonusMessage"></div>

          <div id="startScreen">
            <h2>Welcome to Pirate Parrot Game!</h2>
            <p>Use arrow keys to move, SPACEBAR to shoot</p>
            <p>Reach 5 points for Pharos bonus, 10 points for Blocksense bonus</p>

            <div id="walletConnectGroup">
              <button id="connectWalletBtn">Connect Wallet</button>
              <div id="walletStatus" class="info" style="margin-top:8px;">Wallet not connected</div>
            </div>

            <button id="startButton" disabled>Press ENTER or Click to Start</button>
          </div>

          <div id="gameOverScreen" class="hidden">
            <h2>GAME OVER</h2>
            <p>Final Score: <span id="finalScore">0</span></p>

            <div id="blockchainSection">
              <div id="blockchainStatus">Waiting to submit score...</div>
              <div id="transactionInfo" class="hidden">
                <p>Transaction sent successfully!</p>
                <p>TX Hash: <a id="transactionLink" href="#" target="_blank">#</a></p>
              </div>
            </div>

            <!-- Tweet bonus -->
            <div id="endTweetGroup" style="margin-top:12px;">
              <button id="tweetScoreBtn">Tweet your score for bonus</button>
              <button id="verifyTweetBtn" class="hidden">Verify Tweet (grant bonus)</button>
            </div>

            <button id="restartButton">Restart Game</button>
          </div>
        </div>
      </div>

      <div id="leaderboardSidebar">
        <h3>Leaderboard (Top 50)</h3>
        <div id="leaderboardLoading" class="info">Loading...</div>
        <table id="leaderboardTable" class="hidden">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody id="leaderboardBody"></tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Web3.js (mevcut entegrasyonla uyumlu) -->
  <script src="https://cdn.jsdelivr.net/npm/web3@1.8.2/dist/web3.min.js  "></script>

  <!-- On-chain entegrasyon -->
  <script src="web3-integration.js"></script>

  <!-- Oyun ana kodu -->
  <script src="script.js"></script>
</body>
</html>
```

---

### **style.css**

```css
* {
    box-sizing: border-box;
}
body {
    margin: 0;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    color: #eee;
    background: radial-gradient(1200px 600px at 50% -200px, #0b1b2b, #051019 60%, #03070C);
}
#gameContainer {
    width: 1200px; /* Genişletildi */
    margin: 24px auto;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 16px 16px 24px;
    backdrop-filter: blur(6px);
}
#gameHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}
#gameHeader h1 {
    margin: 0;
    font-size: 22px;
    letter-spacing: 0.5px;
}
#scoreDisplay {
    background: rgba(0,0,0,0.4);
    padding: 6px 12px;
    border-radius: 8px;
    font-weight: 600;
}
#bonusContainer {
    display: flex;
    gap: 12px;
    margin-bottom: 10px;
    min-height: 46px;
}
.bonus-message {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #142033;
    padding: 8px 10px;
    border: 1px solid #233a5c;
    border-radius: 10px;
}
.follow-button {
    padding: 6px 10px;
    border: 1px solid #3178ff;
    color: #fff;
    background: #1b4fff;
    cursor: pointer;
    border-radius: 8px;
}
.follow-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Yeni Ana İçerik Düzeni */
#mainContent {
    display: flex;
    gap: 20px;
}
#gameArea {
    flex: 0 0 auto; /* Oyun alanının sabit kalmasını sağlar */
}
#leaderboardSidebar {
    flex: 1;
    min-width: 0; /* Flex item'ların taşmasını engeller */
    background: rgba(0,0,0,0.25);
    border-radius: 10px;
    padding: 15px;
    max-height: 620px; /* Canvas yüksekliği + padding */
    overflow-y: auto; /* Uzun liste için kaydırma */
}
#leaderboardSidebar h3 {
    margin-top: 0;
    margin-bottom: 15px;
    text-align: center;
}
#leaderboardTable {
    width: 100%;
    border-collapse: collapse;
}
#leaderboardTable th, #leaderboardTable td {
    padding: 8px 12px;
    text-align: left;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}
#leaderboardTable th {
    background-color: rgba(0,0,0,0.3);
    font-weight: bold;
}
#leaderboardBody tr:hover {
    background-color: rgba(255,255,255,0.05);
}
/* Yeni Ana İçerik Düzeni Sonu */

#gameCanvas {
    display: block;
    margin: 0 auto 10px;
    border: 1px solid rgba(255,255,255,0.08);
    background: #000;
    border-radius: 10px;
}
#gameControls {
    display: grid;
    gap: 12px;
}
#bonusMessage {
    min-height: 22px;
    color: #ffd166;
    font-weight: 600;
}
#startScreen, #gameOverScreen {
    text-align: center;
    padding: 10px;
    background: rgba(0,0,0,0.25);
    border-radius: 10px;
}
#startButton, #restartButton, #connectWalletBtn, #tweetScoreBtn, #verifyTweetBtn {
    padding: 10px 16px;
    border: none;
    border-radius: 10px;
    background: #1b4fff;
    color: white;
    font-weight: 600;
    cursor: pointer;
    margin-top: 8px;
}
#startButton:disabled {
    background: #3a4b78;
    cursor: not-allowed;
    opacity: 0.6;
}
.hidden {
    display: none !important;
}
.info { color: #a8c1ff; }
.success { color: #57e389; }
.error { color: #ff6b6b; }
a { color: #8ab4ff; text-decoration: none; }
a:hover { text-decoration: underline; }

/* Splash Screen Stili */
#splashScreen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10; /* Canvas'in üzerine gelmesi için yüksek z-index */
    overflow: hidden; /* Resmin dışarı taşmasını engeller */
}

#splashScreen img {
    max-width: 80%;
    max-height: 80%;
    image-rendering: pixelated; /* Pixel art kalitesini korur */
}
```

---

### **script.js**

```javascript
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const bonusMessage = document.getElementById('bonusMessage');
const gameOverScreen = document.getElementById('gameOverScreen');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const finalScoreDisplay = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');
const blockchainStatus = document.getElementById('blockchainStatus');
const pharosBonus = document.getElementById('pharosBonus');
const blocksenseBonus = document.getElementById('blocksenseBonus');
const connectWalletBtn = document.getElementById('connectWalletBtn');
const walletStatus = document.getElementById('walletStatus');
const pharosFollowBtn = document.getElementById('pharosFollowBtn');
const blocksenseFollowBtn = document.getElementById('blocksenseFollowBtn');
const tweetScoreBtn = document.getElementById('tweetScoreBtn');
const verifyTweetBtn = document.getElementById('verifyTweetBtn');

// --- YENI: Splash Screen ---
const splashScreen = document.getElementById('splashScreen');
// --- YENI SON ---

const leaderboardLoading = document.getElementById('leaderboardLoading');
const leaderboardTable = document.getElementById('leaderboardTable');
const leaderboardBody = document.getElementById('leaderboardBody');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_SPEED = 5;
let ENEMY_SPEED = 2;
let BULLET_SPEED = 10;
const NUM_ENEMIES = 7;

let shootInterval = 300;
let lastShotTime = 0;
const MIN_SHOOT_INTERVAL = 100;

let gameRunning = false;
let gameStarted = false;
let score = 0;
let pharosUnlocked = false;
let blocksenseUnlocked = false;
let blockchainSubmitted = false;
let tweetBonusApplied = false;
let walletConnected = false;
let gamePaused = false;

let player = { x: GAME_WIDTH / 2 - 32, y: GAME_HEIGHT - 100, width: 64, height: 64, speed: PLAYER_SPEED };
let enemies = [];
let bullets = [];

// --- YENI EKLENEN KISIM: Ses Efektleri ---
let sounds = {};
let soundsLoaded = false;

function loadSounds() {
    if (soundsLoaded) return;
    
    try {
        sounds.shoot = new Audio('assets/shoot.mp3');
        sounds.hit = new Audio('assets/hit.mp3');
        sounds.playerDeath = new Audio('assets/player_death.mp3');
        sounds.bonus = new Audio('assets/bonus.mp3');
        sounds.buttonClick = new Audio('assets/button_click.mp3');
        sounds.gameStart = new Audio('assets/game_start.mp3');
        sounds.gameOver = new Audio('assets/game_over.mp3');
        
        // Ses dosyalarının yüklenmesini bekle
        const soundPromises = Object.values(sounds).map(sound => {
            return new Promise((resolve) => {
                sound.addEventListener('canplaythrough', resolve);
                sound.addEventListener('error', resolve); // Hata durumunda da devam et
                // Zaman aşımı ekle (5 saniye)
                setTimeout(resolve, 5000);
            });
        });
        
        // Tüm sesler yüklendiğinde veya zaman aşımına uğradığında
        Promise.all(soundPromises).then(() => {
            soundsLoaded = true;
            console.log("Ses efektleri yüklendi");
        }).catch(err => {
            console.warn("Ses efektleri yüklenirken hata oluştu:", err);
        });
        
    } catch (e) {
        console.warn("Ses efektleri yüklenemedi:", e);
    }
}

function playSound(soundName) {
    if (!soundsLoaded || !sounds[soundName]) return;
    
    try {
        // Sesin baştan başlamasını sağla
        sounds[soundName].currentTime = 0;
        // Ses çal
        sounds[soundName].play().catch(e => {
            // Otomatik oynatma engellenirse sessiz kalabilir
            console.log(`Ses çalınamadı (${soundName}):`, e.message);
        });
    } catch (e) {
        console.log(`Ses çalınamadı (${soundName}):`, e.message);
    }
}
// --- YENI EKLENEN KISIM SONU ---

let dataParticles = [];
const BLOCKCHAIN_WORDS = ["DATA", "FEED", "VERIFIED", "ORACLE"];

class DataParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dx = (Math.random() - 0.5) * 4;
        this.dy = (Math.random() - 0.5) * 4;
        this.life = 30;
        this.text = BLOCKCHAIN_WORDS[Math.floor(Math.random() * BLOCKCHAIN_WORDS.length)];
        const colors = ["#00ff00", "#00cc00", "#009900", "#33ff33"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.fontSize = 12 + Math.random() * 4;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.dy += 0.1;
        this.life--;
    }

    draw(ctx) {
        if (this.life > 0) {
            ctx.fillStyle = this.color;
            ctx.font = `bold ${this.fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.text, this.x, this.y);
        }
    }
}

let playerImage = new Image();
let pharosImage = new Image();
let blocksenseImage = new Image();
playerImage.src = 'assets/player.png';
pharosImage.src = 'assets/pharos.jpg';
blocksenseImage.src = 'assets/blocksense.jpg';

const keys = { ArrowLeft:false, ArrowRight:false, ArrowUp:false, ArrowDown:false, Space:false, Enter:false };
const MAINNET_LETTERS = ['M','A','I','N','N','E','T'];

function spawnInitialEnemies() {
  enemies = [];
  for (let i = 0; i < NUM_ENEMIES; i++) enemies.push(randomEnemy());
}
function randomEnemy() {
  const r = Math.random();
  if (r < 0.7) {
    return { type:'pharos', x: Math.random()*(GAME_WIDTH-40), y: Math.random()*-600-40, width:48, height:48 };
  } else {
    return { type:'letter', letter: MAINNET_LETTERS[Math.floor(Math.random()*MAINNET_LETTERS.length)],
      x: Math.random()*(GAME_WIDTH-40), y: Math.random()*-600-40, width:44, height:44 };
  }
}

document.addEventListener('keydown', (e) => {
  if (gamePaused) return;
  if (e.key==='ArrowLeft') keys.ArrowLeft=true;
  if (e.key==='ArrowRight') keys.ArrowRight=true;
  if (e.key==='ArrowUp') keys.ArrowUp=true;
  if (e.key==='ArrowDown') keys.ArrowDown=true;
  if (e.key===' ') { e.preventDefault(); keys.Space=true; }
  if (e.key==='Enter') {
    e.preventDefault();
    if (!gameStarted && walletConnected) startGame();
    else if (!walletConnected) showBonusMessage('Connect wallet first');
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key==='ArrowLeft') keys.ArrowLeft=false;
  if (e.key==='ArrowRight') keys.ArrowRight=false;
  if (e.key==='ArrowUp') keys.ArrowUp=false;
  if (e.key==='ArrowDown') keys.ArrowDown=false;
  if (e.key===' ') { e.preventDefault(); keys.Space=false; }
});

startButton.addEventListener('click', () => {
  playSound('buttonClick'); // Buton tıklama sesi
  if (walletConnected) startGame(); else showBonusMessage('Connect wallet first');
});
restartButton.addEventListener('click', () => {
  playSound('buttonClick'); // Buton tıklama sesi
  resetGame();
});

connectWalletBtn.addEventListener('click', async () => {
  playSound('buttonClick'); // Buton tıklama sesi
  connectWalletBtn.disabled = true;
  walletStatus.textContent = 'Connecting...';
  const res = await connectToWeb3Interactive();
  if (res.success) {
    walletConnected = true;
    walletStatus.textContent = `Connected: ${res.account.substring(0,10)}...${res.account.slice(-6)}`;
    startButton.disabled = false;
    connectWalletBtn.textContent = 'Connected';
    connectWalletBtn.disabled = true;
    
    // Splash screen'i gizle
    splashScreen.classList.add('hidden');
    
    await loadAndRenderLeaderboard();
  } else {
    walletConnected = false;
    walletStatus.textContent = `Error: ${res.error}`;
    connectWalletBtn.disabled = false;
  }
});

function setupFollowButtons() {
  const followHandler = (evt) => {
    playSound('buttonClick'); // Buton tıklama sesi
    pauseGameForFollow(evt.target.dataset.key);
  };
  pharosFollowBtn.addEventListener('click', followHandler);
  blocksenseFollowBtn.addEventListener('click', followHandler);
}
async function pauseGameForFollow(key) {
  if (gamePaused) return;
  gamePaused = true; gameRunning = false;
  showBonusMessage('Opening X in new tab. Verify after follow.');
  const url = key==='pharos' ? 'https://x.com/pharos_network  ' : 'https://x.com/blocksense_  ';
  window.open(url, '_blank');
  const btn = key==='pharos' ? pharosFollowBtn : blocksenseFollowBtn;
  btn.textContent = 'Verify'; btn.disabled = false;
  btn.onclick = () => { 
    playSound('buttonClick'); // Buton tıklama sesi
    grantFollowBonus(key); btn.onclick = null; 
  };
}
function grantFollowBonus(key) {
  if (key==='pharos' && pharosUnlocked) score += 3;
  else if (key==='blocksense' && blocksenseUnlocked) score += 5;
  updateScore();
  playSound('bonus'); // Bonus alma sesi
  showBonusMessage('Bonus awarded. Resuming game.');
  gamePaused = false; gameRunning = true;
  const btn = key==='pharos' ? pharosFollowBtn : blocksenseFollowBtn;
  btn.textContent = 'Follow'; btn.disabled = false; btn.parentNode.classList.add('hidden');
}

tweetScoreBtn.addEventListener('click', () => {
  playSound('buttonClick'); // Buton tıklama sesi
  const text = `Game over — my score: ${score} #PirateParrotGame @blocksense_ @pharos_network`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
  tweetScoreBtn.classList.add('hidden');
  verifyTweetBtn.classList.remove('hidden');
});
verifyTweetBtn.addEventListener('click', () => {
  playSound('buttonClick'); // Buton tıklama sesi
  if (!tweetBonusApplied) {
    score += 5; tweetBonusApplied = true;
    finalScoreDisplay.textContent = score;
    playSound('bonus'); // Bonus alma sesi
    showBonusMessage('Tweet bonus applied.');
  }
  verifyTweetBtn.classList.add('hidden');
});

function updateScore(){ scoreDisplay.textContent = `Score: ${score}`; }
function showBonusMessage(msg){ bonusMessage.textContent = msg; setTimeout(()=>{ if(bonusMessage.textContent===msg) bonusMessage.textContent=''; },3000); }

function movePlayer(){
  if (gamePaused) return;
  if (keys.ArrowLeft) player.x -= player.speed;
  if (keys.ArrowRight) player.x += player.speed;
  if (keys.ArrowUp) player.y -= player.speed;
  if (keys.ArrowDown) player.y += player.speed;
  player.x = Math.max(0, Math.min(GAME_WIDTH - player.width, player.x));
  player.y = Math.max(0, Math.min(GAME_HEIGHT - player.height, player.y));
}
function fireBullet(){
  if (gamePaused) return;
  const now = performance.now();
  if (keys.Space && now - lastShotTime > shootInterval) {
    lastShotTime = now;
    bullets.push({ x: player.x + player.width/2 - 15, y: player.y, width: 30, height: 30 });
    playSound('shoot'); // Ateş etme sesi
  }
}
function moveBullets(){
  if (gamePaused) return;
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= BULLET_SPEED;
    if (bullets[i].y + bullets[i].height < 0) bullets.splice(i,1);
  }
}
function moveEnemies(){
  if (gamePaused) return;
  for (let i=0;i<enemies.length;i++){
    enemies[i].y += ENEMY_SPEED;
    if (enemies[i].y > GAME_HEIGHT) {
      enemies[i] = randomEnemy();
      enemies[i].y = Math.random() * -100 - 40;
    }
  }
}

function checkCollisions(){
  if (gamePaused) return;
  for (let i=0;i<enemies.length;i++){
    if (isColliding(player, enemies[i])) { 
      playSound('playerDeath'); // Oyuncu ölümü sesi
      showGameOver(); return; 
    }
  }
  for (let i=bullets.length-1;i>=0;i--){
    for (let j=enemies.length-1;j>=0;j--){
      if (isColliding(bullets[i], enemies[j])) {
        const hit = enemies[j];
        const bulletX = bullets[i].x;
        const bulletY = bullets[i].y;
        bullets.splice(i,1);
        enemies.splice(j,1);
        enemies.push(randomEnemy());
        if (hit.type==='pharos'){
          score++;
          if (score>=5 && !pharosUnlocked){ 
            pharosUnlocked=true; 
            pharosBonus.classList.remove('hidden'); 
            showBonusMessage('BONUS: FOLLOW Pharos on X'); 
          }
          if (score>=10 && pharosUnlocked && !blocksenseUnlocked){ 
            blocksenseUnlocked=true; 
            blocksenseBonus.classList.remove('hidden'); 
            showBonusMessage('BONUS: FOLLOW Blocksense on X'); 
          }
        } else if (hit.type==='letter'){
          shootInterval = Math.max(MIN_SHOOT_INTERVAL, Math.floor(shootInterval*0.85));
          playSound('bonus'); // Bonus alma sesi
          score += 1; showBonusMessage(`FIRE RATE UP! (${shootInterval}ms)`);
        }
        updateScore();
        playSound('hit'); // Vuruş sesi
        
        for (let p = 0; p < 5; p++) {
            dataParticles.push(new DataParticle(bulletX, bulletY));
        }
        
        break;
      }
    }
  }
}

function isColliding(r1,r2){
  return r1.x < r2.x + r2.width &&
         r1.x + r1.width > r2.x &&
         r1.y < r2.y + r2.height &&
         r1.y + r1.height > r2.y;
}

function drawGame(){
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);

  if (playerImage.complete) ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
  else { ctx.fillStyle='#fff'; ctx.fillRect(player.x, player.y, player.width, player.height); }

  bullets.forEach(b=>{
    if (blocksenseImage.complete) ctx.drawImage(blocksenseImage, b.x, b.y, b.width, b.height);
    else { ctx.fillStyle='#f00'; ctx.fillRect(b.x,b.y,b.width,b.height); }
  });

  enemies.forEach(e=>{
    if (e.type==='pharos'){
      if (pharosImage.complete) ctx.drawImage(pharosImage, e.x, e.y, e.width, e.height);
      else { ctx.fillStyle='#00f'; ctx.fillRect(e.x,e.y,e.width,e.height); }
    } else {
      ctx.fillStyle='#333'; ctx.fillRect(e.x,e.y,e.width,e.height);
      ctx.fillStyle='#fff'; ctx.font='24px Arial'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(e.letter, e.x+e.width/2, e.y+e.height/2);
    }
  });
  
  for (let i = dataParticles.length - 1; i >= 0; i--) {
      dataParticles[i].update();
      dataParticles[i].draw(ctx);
      if (dataParticles[i].life <= 0) {
          dataParticles.splice(i, 1);
      }
  }
}

function gameLoop(){
  if (gameRunning && !gamePaused){
    movePlayer(); fireBullet(); moveBullets(); moveEnemies(); checkCollisions(); drawGame();
  }
  requestAnimationFrame(gameLoop);
}

function startGame(){
  if (!walletConnected){ 
    showBonusMessage('Please connect wallet first'); 
    return; 
  }
  if (!gameStarted){
    gameStarted=true; gameRunning=true; gamePaused=false; 
    startScreen.classList.add('hidden');
    playSound('gameStart'); // Oyun başlatma sesi
    spawnInitialEnemies(); updateScore();
  } else if (!gameRunning){
    gameRunning=true; gamePaused=false; gameOverScreen.classList.add('hidden');
  }
}
function resetGame(){
  gameRunning=true; gamePaused=false; gameStarted=true;
  score=0; pharosUnlocked=false; blocksenseUnlocked=false; blockchainSubmitted=false; tweetBonusApplied=false; shootInterval=300;
  pharosBonus.classList.add('hidden'); blocksenseBonus.classList.add('hidden');
  player.x = GAME_WIDTH/2 - 32; player.y = GAME_HEIGHT - 100;
  spawnInitialEnemies(); bullets=[]; bonusMessage.textContent=''; gameOverScreen.classList.add('hidden');

  blockchainStatus.textContent = 'Waiting to submit score...';
  document.getElementById('transactionInfo').classList.add('hidden');

  tweetScoreBtn.classList.remove('hidden');
  verifyTweetBtn.classList.add('hidden');
  verifyTweetBtn.disabled=false;
  verifyTweetBtn.textContent='Verify Tweet (grant bonus)';

  leaderboardLoading.classList.remove('hidden');
  leaderboardLoading.textContent = 'Loading...';
  leaderboardTable.classList.add('hidden');
  leaderboardBody.innerHTML = '';

  updateScore();
}

async function showGameOver(){
  gameRunning=false; gamePaused=false;
  finalScoreDisplay.textContent = score;
  gameOverScreen.classList.remove('hidden');
  playSound('gameOver'); // Oyun bitiş sesi

  leaderboardLoading.classList.remove('hidden');
  leaderboardLoading.textContent = 'Loading...';
  leaderboardTable.classList.add('hidden');
  leaderboardBody.innerHTML = '';

  blockchainStatus.textContent='Submitting score...';
  blockchainStatus.className='info';

  if (typeof submitScoreToBlockchain === 'function') {
    const res = await submitScoreToBlockchain(score);
    if (res.success){
      blockchainStatus.textContent='Score sent successfully!';
      blockchainStatus.className='success';
      blockchainSubmitted = true;
      const transactionLink = document.getElementById('transactionLink');
      transactionLink.textContent = `${res.txHash.substring(0, 20)}...`;
      transactionLink.href = `  https://testnet.pharosscan.xyz/tx/  ${res.txHash}`;
      document.getElementById('transactionInfo').classList.remove('hidden');
    } else {
      blockchainStatus.textContent = `Error: ${res.error}`;
      blockchainStatus.className='error';
    }
  } else {
    blockchainStatus.textContent='Blockchain function not found.';
    blockchainStatus.className='error';
  }

  await loadAndRenderLeaderboard();
}

async function loadAndRenderLeaderboard(){
  try {
    if (typeof getLeaderboardFromBlockchain !== 'function') {
      leaderboardLoading.textContent = 'Leaderboard integration missing.';
      return;
    }
    const res = await getLeaderboardFromBlockchain(50);
    if (!res.success) {
      leaderboardLoading.textContent = `Load error: ${res.error}`;
      leaderboardLoading.className = 'error';
      return;
    }
    renderLeaderboard(res.rows);
  } catch (err) {
    leaderboardLoading.textContent = `Load error: ${err.message || String(err)}`;
    leaderboardLoading.className = 'error';
  }
}
function renderLeaderboard(rows){
  leaderboardBody.innerHTML = '';
  if (!rows || rows.length === 0){
    leaderboardLoading.textContent = 'No scores yet.';
    return;
  }
  leaderboardLoading.classList.add('hidden');
  leaderboardTable.classList.remove('hidden');

  rows.slice(0,50).forEach((entry, idx) => {
    const tr = document.createElement('tr');

    const tdRank = document.createElement('td');
    tdRank.textContent = idx + 1;

    const tdPlayer = document.createElement('td');
    tdPlayer.textContent = `${entry.player.substring(0,6)}...${entry.player.slice(-4)}`;

    const tdScore = document.createElement('td');
    tdScore.textContent = entry.score;

    tr.appendChild(tdRank);
    tr.appendChild(tdPlayer);
    tr.appendChild(tdScore);
    leaderboardBody.appendChild(tr);
  });
}

function applyEnhancedStyles() {
    const buttonStyle = `
        background: linear-gradient(to bottom, #555, #333, #555);
        border: 2px solid #222;
        border-radius: 10px;
        color: #FFD700;
        font-weight: bold;
        padding: 10px 16px;
        cursor: pointer;
        text-shadow: 1px 1px 2px black;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 3px 5px rgba(0,0,0,0.5);
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
    `;
    
    const buttonHoverStyle = `
        background: linear-gradient(to bottom, #666, #444, #666);
        color: #FFEC8B;
        text-shadow: 1px 1px 3px black;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 6px rgba(0,0,0,0.6);
        transform: translateY(-2px);
    `;
    
    const buttonActiveStyle = `
        transform: translateY(1px);
        box-shadow: inset 0 1px 0 rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.3);
    `;
    
    const panelStyle = `
        background: linear-gradient(to bottom, #444, #222, #444);
        border: 3px solid #1a1a1a;
        border-radius: 15px;
        padding: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.7);
        position: relative;
    `;
    
    const buttons = [
        startButton, restartButton, connectWalletBtn, 
        tweetScoreBtn, verifyTweetBtn, pharosFollowBtn, blocksenseFollowBtn
    ];
    
    buttons.forEach(button => {
        if (button) {
            button.style.cssText += buttonStyle;
            
            button.addEventListener('mouseenter', function() {
                this.style.cssText += buttonHoverStyle;
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.cssText = this.style.cssText.replace(/background: linear-gradient\(to bottom, #666, #444, #666\)[^;]*;?|color: #FFEC8B[^;]*;?|text-shadow: 1px 1px 3px black[^;]*;?|box-shadow: inset 0 1px 0 rgba\(255,255,255,0\.4\), 0 4px 6px rgba\(0,0,0,0\.6\)[^;]*;?|transform: translateY\(-2px\)[^;]*;?/g, '');
                this.style.cssText += buttonStyle;
            });
            
            button.addEventListener('mousedown', function() {
                this.style.cssText += buttonActiveStyle;
            });
            
            button.addEventListener('mouseup', function() {
                this.style.cssText = this.style.cssText.replace(/transform: translateY\(1px\)[^;]*;?|box-shadow: inset 0 1px 0 rgba\(0,0,0,0\.2\), 0 1px 2px rgba\(0,0,0,0\.3\)[^;]*;?/g, '');
            });
        }
    });
    
    if (startScreen) {
        startScreen.style.cssText += panelStyle;
        startScreen.style.position = 'relative';
        const innerBorder = document.createElement('div');
        innerBorder.style.cssText = `
            position: absolute;
            top: 3px;
            left: 3px;
            right: 3px;
            bottom: 3px;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 10px;
            pointer-events: none;
        `;
        startScreen.appendChild(innerBorder);
    }
    
    if (gameOverScreen) {
        gameOverScreen.style.cssText += panelStyle;
        gameOverScreen.style.position = 'relative';
        const innerBorder = document.createElement('div');
        innerBorder.style.cssText = `
            position: absolute;
            top: 3px;
            left: 3px;
            right: 3px;
            bottom: 3px;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 10px;
            pointer-events: none;
        `;
        gameOverScreen.appendChild(innerBorder);
    }
    
    if (bonusMessage) {
        bonusMessage.style.color = '#FFD700';
        bonusMessage.style.fontWeight = 'bold';
        bonusMessage.style.textShadow = '1px 1px 2px black';
    }
    
    if (pharosBonus) {
        pharosBonus.style.cssText += `
            background: linear-gradient(to bottom, #1E3A8A, #1E40AF, #1E3A8A);
            border: 2px solid #000;
            border-radius: 10px;
            box-shadow: 0 3px 8px rgba(0,0,0,0.5);
        `;
    }
    
    if (blocksenseBonus) {
        blocksenseBonus.style.cssText += `
            background: linear-gradient(to bottom, #1E3A8A, #1E40AF, #1E3A8A);
            border: 2px solid #000;
            border-radius: 10px;
            box-shadow: 0 3px 8px rgba(0,0,0,0.5);
        `;
    }
    
    if (scoreDisplay) {
        scoreDisplay.style.cssText += `
            background: linear-gradient(to bottom, #000, #333, #000);
            border: 2px solid #222;
            border-radius: 8px;
            padding: 6px 12px;
            font-weight: bold;
            color: #00ff00;
            text-shadow: 0 0 5px #00ff00;
        `;
    }
    
    const leaderboardSection = document.querySelector('#leaderboardSidebar') || 
                             document.querySelector('#gameOverScreen').parentElement;
    if (leaderboardSection) {
        if (!leaderboardSection.dataset.styled) {
            leaderboardSection.style.cssText += `
                background: linear-gradient(to bottom, #444, #222, #444);
                border: 3px solid #111;
                border-radius: 12px;
                padding: 15px;
                box-shadow: inset 0 0 10px rgba(0,0,0,0.8), 0 5px 15px rgba(0,0,0,0.7);
            `;
            leaderboardSection.dataset.styled = "true";
        }
    }
    
    if (blockchainStatus) {
        const style = document.createElement('style');
        style.textContent = `
            .info {
                color: #a8c1ff !important;
                font-weight: bold;
            }
            .success {
                color: #57e389 !important;
                font-weight: bold;
                text-shadow: 0 0 5px #57e389;
            }
            .error {
                color: #ff6b6b !important;
                font-weight: bold;
                text-shadow: 0 0 5px #ff0000;
            }
        `;
        document.head.appendChild(style);
    }
    
    const gameHeader = document.getElementById('gameHeader');
    const gameTitle = gameHeader ? gameHeader.querySelector('h1') : null;
    if (gameTitle) {
        gameTitle.style.cssText += `
            background: linear-gradient(to bottom, #c0c0c0, #808080, #c0c0c0);
            background: linear-gradient(to bottom, #ffd700, #daa520, #ffd700);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            letter-spacing: 1px;
            margin: 0;
            padding: 5px 10px;
            border: 2px solid #b8860b;
            border-radius: 10px;
            display: inline-block;
        `;
    }
}

window.addEventListener('load', () => {
    setTimeout(() => {
        applyEnhancedStyles();
        loadSounds(); // Ses efektlerini yükle
        
        if (typeof initReadOnlyWeb3 === 'function') {
            initReadOnlyWeb3();
            loadAndRenderLeaderboard();
        }
    }, 100);
});

setupFollowButtons();
updateScore();
gameLoop();
