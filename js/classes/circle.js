class Circle {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = 1;
        this.hit = false;
        this.coins = 10;
    }

    update() {
        const dx = tower.x - this.x;
        const dy = tower.y - this.y;

        const len = sqrt(dx * dx + dy * dy);

        this.x += (dx / len) * this.speed;
        this.y += (dy / len) * this.speed;

         if (collideRectRect(
            this.x - this.size / 2, this.y - this.size / 2, this.size, this.size,
            tower.x - tower.size / 2, tower.y - tower.size / 2, tower.size, tower.size
        )) {
            this.hit = true;
        }
    }

    draw() {
        fill(0, 0, 255);
        circle(this.x, this.y, this.size);
    }
}