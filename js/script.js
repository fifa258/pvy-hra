let tower;
let enemies = [];
let bullets = [];
let gameState = "start"; // "start", "playing", "paused", "gameover"

let playerCoins = 50;
let enemiesKilled = 0;
let difficulty = 1;

let atkSpeedUpgrade = 50;
let projectilesUpgrade = 150;
let healCost = 100;

let spawnRate = 180;

function setup() {
    const space = createCanvas(800, 600);
    space.parent('game-space');
    tower = new Tower(width / 2, height / 2);


    // ATTACK SPEED button
    document.getElementById("atc-speed-btn").addEventListener("click", () => {
        if (playerCoins >= atkSpeedUpgrade) {
            playerCoins -= atkSpeedUpgrade;
            tower.fireRate = max(100, tower.fireRate - 100);
            atkSpeedUpgrade = round(atkSpeedUpgrade * 1.5);
            document.getElementById("atc-speed-btn").innerText = `Attack Speed (${atkSpeedUpgrade}$)`;
        }
    });

    // PROJECTILES button
    document.getElementById("range-btn").addEventListener("click", () => {
        if (playerCoins >= projectilesUpgrade) {
            playerCoins -= projectilesUpgrade;
            tower.projectiles += 1;
            projectilesUpgrade = round(projectilesUpgrade * 1.5);
            document.getElementById("range-btn").innerText = `Projectiles (${projectilesUpgrade}$)`;
        }
    });

    // HEAL button
    document.getElementById("upgrade-button").addEventListener("click", () => {
        if (playerCoins >= healCost) {
            playerCoins -= healCost;
            tower.hp = min(tower.maxHp, tower.hp + 20);
            healCost = round(healCost * 1.5);
            document.getElementById("upgrade-button").innerText = `Heal (${healCost}$)`;
        }
    });
}

function draw() {
    background(0);
    if (gameState === "start") {
        drawStartMenu();
    }
    if (gameState === "playing") {
        playGame();
        drawScoreMenu();
    }
    if (gameState === "paused") {
        drawPauseMenu();
    }
    if (gameState === "gameover") {
        drawGameOverMenu();
    }
}

function playGame() {
    tower.draw();

    if (frameCount % 1200 === 0) {
        difficulty += 1;
        spawnRate = max(10, spawnRate - 10);
    }

    // spawn nepřátel
    if (frameCount % spawnRate === 0) {
        const side = floor(random(4));
        let x, y;
        switch (side) {
            case 0: x = random(0, width); y = -30; break;
            case 1: x = width + 30; y = random(0, height); break;
            case 2: x = random(0, width); y = height + 30; break;
            case 3: x = -30; y = random(0, height); break;
        }
        const type = floor(random(2));
        if (type === 0) enemies.push(new Square(x, y, 30));
        else enemies.push(new Circle(x, y, 20));
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();
        enemies[i].draw();
        if (enemies[i].hit) {
            enemiesKilled += 1;
            playerCoins += enemies[i].coins;
            enemies.splice(i, 1);
        }
    }

    if (tower.shotTime()) {
        tower.doShot();
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
        const hit = bullets[i].update();
        bullets[i].draw();
        if (hit) bullets.splice(i, 1);
    }
}

// nalezení nejbližšího nepřítele
function getClosestEnemies(n) {
    let sorted = enemies.slice().sort((a, b) => dist(tower.x, tower.y, a.x, a.y) - dist(tower.x, tower.y, b.x, b.y));
    return sorted.slice(0, n);
}

// MENU
function drawStartMenu() {
    textAlign(CENTER, CENTER);
    fill(255);
    rect(width / 2 - 100, height / 2 - 50, 200, 100);
    textSize(50);
    fill(0);
    text("START", width / 2, height / 2);
}

function drawPauseMenu() {
    textAlign(CENTER, CENTER);
    textSize(100);
    fill(255);
    text("PAUSED", width / 2, height / 2 - 140);
    fill(255);
    rect(width / 2 - 100, height / 2 - 50, 200, 100);
    textSize(42);
    fill(0);
    text("RESUME", width / 2, height / 2);
}

function drawGameOverMenu() {
    textAlign(CENTER, CENTER);
    textSize(100);
    fill(255);
    text("GAME OVER", width / 2, height / 2 - 140);
    fill(255);
    rect(width / 2 - 100, height / 2 - 50, 200, 100);
    textSize(42);
    fill(0);
    text("RESTART", width / 2, height / 2);
}

function drawScoreMenu() {
    fill(255);
    textAlign(LEFT, TOP);
    textSize(24);
    text(`Coins: ${playerCoins}`, 10, 10);
    text(`Enemies killed: ${enemiesKilled}`, 10, 40);
    text(`Difficulty: ${difficulty}`, 10, 70);
}

function mousePressed() {
    // START
    if (gameState === "start") {
        if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height / 2 - 50 && mouseY < height / 2 + 50) {
            gameState = "playing";
        }
    }
    // RESUME
    if (gameState === "paused") {
        if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height / 2 - 50 && mouseY < height / 2 + 50) {
            gameState = "playing";
        }
    }
    // RESTART
    if (gameState === "gameover") {
        if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height / 2 - 50 && mouseY < height / 2 + 50) {
            enemies = [];
            bullets = [];
            
            tower = new Tower(width / 2, height / 2);
            playerCoins = 50;
            enemiesKilled = 0;
            difficulty = 1;

            document.getElementById("atc-speed-btn").innerText = `Attack Speed (${atkSpeedUpgrade})`;
            document.getElementById("range-btn").innerText = `Multi Bullet (${projectilesUpgrade})`;
            document.getElementById("upgrade-button").innerText = `Heal (${healCost})`;

            gameState = "playing";
        }
    }
}

function keyPressed() {
    if (key === "Escape") {
        if (gameState === "playing") gameState = "paused";
        else if (gameState === "paused") gameState = "playing";
    }
}
