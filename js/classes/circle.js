class Circle {
    constructor(x, y, size, img) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = 1;
        this.hit = false;
        this.coins = 10;
        this.img = img;
    }

    update() {
        // pohyb k vezi
        const dx = tower.x - this.x;
        const dy = tower.y - this.y;

        const len = sqrt(dx * dx + dy * dy);

        this.x += (dx / len) * this.speed;
        this.y += (dy / len) * this.speed;

        // kontrola kolize s vezi
         if (collideRectRect(
            this.x - this.size / 2, this.y - this.size / 2, this.size, this.size,
            tower.x - tower.size / 2, tower.y - tower.size / 2, tower.size, tower.size
        )) {
            tower.hp = max(0, tower.hp - 10); 
            this.hit = true;
        }
    }

    // vykresleni kruhu
    draw() {
        image(this.img, this.x, this.y, 60, 50);

        noStroke();
        noFill();
        circle(this.x, this.y, this.size);
    }
}