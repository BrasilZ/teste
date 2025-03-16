const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

globalThis.gravity = 0.6;

const playerImg = new Image();
playerImg.src = "assets/player.png"; // Substitua por uma imagem real

const cactusImg = new Image();
cactusImg.src = "assets/cactus.png"; // Substitua por uma imagem real

const birdImg = new Image();
birdImg.src = "assets/bird.png"; // Substitua por uma imagem real

const rockImg = new Image();
rockImg.src = "assets/rock.png"; // Substitua por uma imagem real

const cloudImg = new Image();
cloudImg.src = "assets/cloud.png"; // Substitua por uma imagem real

const backgroundImg = new Image();
backgroundImg.src = "assets/background.png"; // Substitua por uma imagem real

const congratsImg = new Image();
congratsImg.src = "assets/congrats.png"; // Substitua por uma imagem real

const retryImg = new Image();
retryImg.src = "assets/retry.png"; // Substitua por uma imagem real

const menuBackgroundImg = new Image();
menuBackgroundImg.src = "assets/menu.png"; // Substitua por uma imagem real

const playImg = new Image();
playImg.src = "assets/play.png"; // Substitua por uma imagem real

const optionsImg = new Image();
optionsImg.src = "assets/options.png"; // Substitua por uma imagem real

const player = {
    x: 50,
    y: canvas.height - 80,
    width: 40,
    height: 40,
    velocityY: 0,
    speed: 5,
    jumping: false,
    alive: true
};

const ground = {
    x: 0,
    y: canvas.height - 30,
    width: canvas.width,
    height: 30,
    color: "green"
};

let obstacles = [];
let score = 0;
let gameRunning = false;
let speed = 5;

const keys = {};

window.addEventListener("keydown", (e) => keys[e.code] = true);
window.addEventListener("keyup", (e) => keys[e.code] = false);

function spawnObstacle() {
    const obstacleType = Math.random();
    const obstacleCount = Math.floor(Math.random() * 8) + 1; // Adicionar de 1 a 5 obstáculos simultâneos
    for (let i = 0; i < obstacleCount; i++) {
        if (obstacleType < 0.25) {
            obstacles.push({
                x: canvas.width + Math.random() * 200,
                y: ground.y - 30,
                width: 30,
                height: 30,
                img: cactusImg
            });
        } else if (obstacleType < 0.5) {
            obstacles.push({
                x: canvas.width + Math.random() * 200,
                y: ground.y - 30,
                width: 30,
                height: 30,
                img: rockImg
            });
        } else if (obstacleType < 0.75) {
            obstacles.push({
                x: canvas.width + Math.random() * 200,
                y: Math.random() * (ground.y - 150),
                width: 30,
                height: 30,
                img: birdImg
            });
        } else {
            obstacles.push({
                x: canvas.width + Math.random() * 200,
                y: Math.random() * (ground.y - 200),
                width: 50,
                height: 30,
                img: cloudImg
            });
        }
    }
}

setInterval(spawnObstacle, 1000);

function update() {
    if (!gameRunning) return;

    // Pulo
    if (keys["KeyW"] && !player.jumping) {
        player.velocityY = -20; // Aumentar a altura do pulo
        player.jumping = true;
    }

    // Aplicar gravidade
    player.velocityY += gravity;
    player.y += player.velocityY;

    // Colisão com o chão
    if (player.y + player.height >= ground.y) {
        player.y = ground.y - player.height;
        player.velocityY = 0;
        player.jumping = false;
    }

    // Atualizar obstáculos
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= speed;

        // Colisão com o jogador
        if (player.x < obstacles[i].x + obstacles[i].width &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height &&
            player.y + player.height > obstacles[i].y) {
            gameRunning = false;
        }
    }

    // Remover obstáculos fora da tela
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

    // Atualizar pontuação
    score++;
    if (score % 50 === 0) {
        speed += 2; // Aumentar a velocidade a cada 50 pontos
    }
    if (score >= 50000) {
        gameRunning = false;
        showCongrats();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar fundo
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    // Desenhar chão
    ctx.fillStyle = ground.color;
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);

    // Desenhar jogador
    if (player.alive) {
        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
    }

    // Desenhar obstáculos
    for (let obstacle of obstacles) {
        ctx.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }

    // Exibir pontuação
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Pontuação: " + score, 10, 20);

    // Marca d'água
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.font = "16px Arial";
    ctx.fillText("Copyright", canvas.width - 100, 20);
}

function resetGame() {
    player.x = 50;
    player.y = canvas.height - 80;
    player.velocityY = 0;
    player.jumping = false;
    player.alive = true;
    obstacles = [];
    score = 0;
    speed = 5;
    gameRunning = true;
    gameLoop();
}

function showCongrats() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(congratsImg, 0, 0, canvas.width, canvas.height);
}

function showMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(menuBackgroundImg, 0, 0, canvas.width, canvas.height);

    const playButton = document.createElement("img");
    playButton.src = playImg.src;
    playButton.style.position = "absolute";
    playButton.style.top = "40%";
    playButton.style.left = "50%";
    playButton.style.transform = "translate(-50%, -50%)";
    playButton.style.cursor = "pointer";
    playButton.onload = () => {
        document.body.appendChild(playButton);
    };
    playButton.onclick = () => {
        document.body.removeChild(playButton);
        document.body.removeChild(optionsButton);
        gameRunning = true;
        gameLoop();
    };

    const optionsButton = document.createElement("img");
    optionsButton.src = optionsImg.src;
    optionsButton.style.position = "absolute";
    optionsButton.style.top = "60%";
    optionsButton.style.left = "50%";
    optionsButton.style.transform = "translate(-50%, -50%)";
    optionsButton.style.cursor = "pointer";
    optionsButton.onload = () => {
        document.body.appendChild(optionsButton);
    };
}

function gameLoop() {
    update();
    draw();
    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    } else {
        if (score < 50000) {
            alert("Game Over! Sua pontuação: " + score);
        }
        const retryButton = document.createElement("img");
        retryButton.src = retryImg.src;
        retryButton.style.position = "absolute";
        retryButton.style.top = "50%";
        retryButton.style.left = "50%";
        retryButton.style.transform = "translate(-50%, -50%)";
        retryButton.style.cursor = "pointer";
        retryButton.onclick = () => {
            document.body.removeChild(retryButton);
            resetGame();
        };
        document.body.appendChild(retryButton);
    }
}

menuBackgroundImg.onload = showMenu;