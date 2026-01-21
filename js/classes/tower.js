
class Tower {
    constructor(x, y, img, bullet) {
        this.x = x;
        this.y = y;
        this.size = 65;
        this.fireRate = 2000;
        this.projectiles = 1;
        this.hp = 100;
        this.maxHp = 100;
        this.lastShot = 0;
        this.img = img;
        this.bullet = bullet;
    }

    shotTime() {
        return millis() - this.lastShot >= this.fireRate - 5; // vraci cas od spusteni programu - cas od posledni strely
    }

    // vystreleni projektilu
    doShot() {
        let targets = getClosestEnemies(this.projectiles);

        for (let i = 0; i < this.projectiles; i++) {
            if (!targets[i]) break;

            bullets.push(new Bullet(this.x, this.y, targets[i], this.bullet));
        }

        this.lastShot = millis(); // nastaveni casu posledni strely
    }

    draw() {
        imageMode(CENTER);
        image(this.img, width / 2, height / 2, 100, 100);
        noFill();
        noStroke();
        circle(this.x, this.y, this.size);
    }
}