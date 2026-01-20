// trida pro vytvoreni veze
class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 200;
        this.size = 40;
        this.fireRate = 2000;
        this.projectiles = 1;
        this.hp = 100;
        this.maxHp = 100;
        this.lastShot = 0;
    }

    shotTime() {
        return millis() - this.lastShot >= this.fireRate - 5;
    }

    doShot() {
        let targets = getClosestEnemies(this.projectiles);

        for (let i = 0; i < this.projectiles; i++) {
            if (!targets[i]) break;
            bullets.push(new Bullet(this.x, this.y, targets[i],));
        }

        this.lastShot = millis();
    }

    draw() {
        //vez
        fill(255, 0, 0);
        circle(this.x, this.y, this.size);
    }
}