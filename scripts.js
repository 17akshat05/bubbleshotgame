document.getElementById('play-button').addEventListener('click', startGame);

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

let score = 0;
let lives = 5;
let bubbles = [];
let gameInterval;

function startGame() {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    resetGame();
    gameInterval = setInterval(gameLoop, 1000 / 60);
}

function resetGame() {
    score = 0;
    lives = 5;
    bubbles = [];
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('lives').textContent = `Lives: ${lives}`;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (Math.random() < 0.02) {
        createBubble();
    }
    updateBubbles();
    drawBubbles();
    checkGameOver();
}

function createBubble() {
    const radius = Math.random() * 20 + 10;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = canvas.height + radius;
    const speed = Math.random() * 2 + 1;
    const bubble = { x, y, radius, speed, burst: false, burstTime: 0 };
    bubbles.push(bubble);
}

function updateBubbles() {
    bubbles.forEach(bubble => {
        if (!bubble.burst) {
            bubble.y -= bubble.speed;
            if (bubble.y + bubble.radius <= 0) {
                lives--;
                document.getElementById('lives').textContent = `Lives: ${lives}`;
            }
        } else if (Date.now() - bubble.burstTime > 200) {
            // Remove burst bubbles after 200ms
            bubbles = bubbles.filter(b => b !== bubble);
        }
    });
    bubbles = bubbles.filter(bubble => bubble.y + bubble.radius > 0 || bubble.burst);
}

function drawBubbles() {
    bubbles.forEach(bubble => {
        if (bubble.burst) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        } else {
            ctx.fillStyle = 'rgba(0, 162, 255, 0.5)';
        }
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    bubbles.forEach(bubble => {
        const distance = Math.hypot(bubble.x - mouseX, bubble.y - mouseY);
        if (distance < bubble.radius && !bubble.burst) {
            score++;
            document.getElementById('score').textContent = `Score: ${score}`;
            bubble.burst = true;
            bubble.burstTime = Date.now();
        }
    });
});

function checkGameOver() {
    if (lives <= 0) {
        clearInterval(gameInterval);
        alert(`Game Over! Your score: ${score}`);
        document.getElementById('menu').classList.remove('hidden');
        document.getElementById('game').classList.add('hidden');
    }
}
