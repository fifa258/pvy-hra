let tower;
let enemies = [];
let bullets = [];
let images = {};

let gameState = "start"; // 4 stavy hry "start", "playing", "paused", "gameover"

// promenne pro scoreboard
let playerCoins = 50;
let enemiesKilled = 0;
let difficulty = 1;

// ceny vylepseni
let atkSpeedUpgrade = 50;
let projectilesUpgrade = 150;
let healCost = 100;

// promenna pro rychlost spawnovani nepratel
let spawnRate = 120;    



function preload() {
    images['towerImg'] = loadImage('./img/tower-ball.png'); 
    images['circleImg'] = loadImage('./img/enemy-ball.png');
    images['bulletImg'] = loadImage('./img/bullet.png');
    images['squareImg'] = loadImage('./img/enemySquare.png');

}

function setup() {
    createCanvas(800, 600).parent('game-space');

    // vytvoreni veze
    tower = new Tower(width / 2, height / 2, images['towerImg'], images['bulletImg']);


    // button pro vylepseni attack speed
    document.getElementById("atc-speed-btn").addEventListener("click", function () {
        if (playerCoins >= atkSpeedUpgrade) {
            playerCoins -= atkSpeedUpgrade;
            tower.fireRate = max(100, tower.fireRate - 100);
            atkSpeedUpgrade = round(atkSpeedUpgrade * 1.5);
            document.getElementById("atc-speed-btn").innerText = `Attack Speed (${atkSpeedUpgrade}$)`;
        }
    });

    // button pro vylepseni vice projektilu
    document.getElementById("projectiles-btn").addEventListener("click", function () {
        if (playerCoins >= projectilesUpgrade) {
            playerCoins -= projectilesUpgrade;
            tower.projectiles += 1;
            projectilesUpgrade = round(projectilesUpgrade * 1.5);
            document.getElementById("projectiles-btn").innerText = `Multi projectiles (${projectilesUpgrade}$)`;
        }
    });

    // button pro obnoveni zivotu veze 
    document.getElementById("heal-button").addEventListener("click", function () {
        if (playerCoins >= healCost) {
            playerCoins -= healCost;
            tower.hp = min(tower.maxHp, tower.hp + 20);
            healCost = round(healCost * 1.1);
            document.getElementById("heal-button").innerText = `Heal (${healCost}$)`;
        }
    });
}

// vykresleni stavu hry
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

    // postupne zrychlovani hry
    if (frameCount % 1200 === 0) {
        difficulty = min(15, difficulty + 1);
        spawnRate = max(10, spawnRate - 10);
    }

    // spawn nepratel
    if (frameCount % spawnRate === 0) {
        let side = floor(random(4));
        let x, y;

        // urceni strany ze ktere nepritel prijde
        switch (side) {
            case 0: x = random(0, width); y = -30; break;
            case 1: x = width + 30; y = random(0, height); break;
            case 2: x = random(0, width); y = height + 30; break;
            case 3: x = -30; y = random(0, height); break;
        }

        // nahodny vyber typu nepratele
        let enemyType = round(random(2));

        if (enemyType === 0) {
            enemies.push(new Square(x, y, 30, images['squareImg']));
        } else {
            enemies.push(new Circle(x, y, 20, images['circleImg']));
        }

    }

    // cyklus pro update a vykresleni nepratel
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();
        enemies[i].draw();

        // kontrola zasazeni nepritele
        if (enemies[i].hit) {
            enemiesKilled += 1; // pricteni zabiteho nepratele
            playerCoins += enemies[i].coins; // pricteni coins podle typu nepratele
            enemies.splice(i, 1); // odstraneni nepritele z pole
        }
    }

    // podminka pro vystreleni dalsi streli pokud vyprsel cas mezi strely
    if (tower.shotTime()) {
        tower.doShot();
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
        const hit = bullets[i].update(); // update pozice a kontrola zasazeni
        bullets[i].draw();
        if (hit) bullets.splice(i, 1); // odstraneni streli pokud zasahla
    }

    // pokud dojdou hp hra konci 
    if (tower.hp <= 0) {
        gameState = "gameover";
    }
}

// nalezeni nejblizsich nepratel k vezi
function getClosestEnemies(n) {
    // serazeni nepratel podle vzdalenosti k vezi
    let sorted = enemies.slice().sort((a, b) => dist(tower.x, tower.y, a.x, a.y) - dist(tower.x, tower.y, b.x, b.y));
    return sorted.slice(0, n);
}

// startovaci menu
function drawStartMenu() {
    textAlign(CENTER, CENTER);
    fill(255);
    textFont("Bitcount Single");
    rect(width / 2 - 100, height / 2 - 50, 200, 100);
    textSize(50);
    fill(0);
    text("START", width / 2, height / 2);
}

// zastaveni hry
function drawPauseMenu() {
    textAlign(CENTER, CENTER);
    textSize(100);
    fill(255);
    textFont("Bitcount Single");
    text("PAUSED", width / 2, height / 2 - 140);
    fill(255);
    rect(width / 2 - 100, height / 2 - 50, 200, 100);
    textSize(42);
    fill(0);
    text("RESUME", width / 2, height / 2);
}

// konecne menu
function drawGameOverMenu() {
    textAlign(CENTER, CENTER);
    textSize(100);
    textFont("Bitcount Single");
    fill(255);
    text("GAME OVER", width / 2, height / 2 - 140);
    fill(255);
    rect(width / 2 - 100, height / 2 - 50, 200, 100);
    textSize(42);
    fill(0);
    text("RESTART", width / 2, height / 2);
}

// score
function drawScoreMenu() {
    fill(255);
    textFont("Bitcount Single");
    textAlign(LEFT, TOP);
    textSize(24);
    text(`Coins: ${playerCoins}`, 10, 10);
    text(`Enemies killed: ${enemiesKilled}`, 10, 40);
    text(`Difficulty: ${difficulty}`, 10, 70);
    text (`Tower HP: ${tower.hp}`, 600, 10);
}

function mousePressed() {
    // start
    if (gameState === "start") {
        if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height / 2 - 50 && mouseY < height / 2 + 50) {
            gameState = "playing";
        }
    }
    // pokracovat
    if (gameState === "paused") {
        if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height / 2 - 50 && mouseY < height / 2 + 50) {
            gameState = "playing";
        }
    }
    // restart
    if (gameState === "gameover") {
        if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height / 2 - 50 && mouseY < height / 2 + 50) {
            enemies = [];
            bullets = [];

            tower = new Tower(width / 2, height / 2, images['towerImg']);
            playerCoins = 50;
            enemiesKilled = 0;
            difficulty = 1;

            document.getElementById("atc-speed-btn").innerText = `Attack Speed (${atkSpeedUpgrade}$)`;
            document.getElementById("projectiles-btn").innerText = `Multi projectiles (${projectilesUpgrade}$)`;
            document.getElementById("heal-button").innerText = `Heal (${healCost}$)`;

            gameState = "playing";
        }
    }
}

// funkce pro detekci stisknuti klavesy
function keyPressed() {
    if (key === "Escape") {
        if (gameState === "playing") gameState = "paused";
        else if (gameState === "paused") gameState = "playing";
    }
}
