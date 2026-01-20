class Bullet {
    constructor(x, y, target) {
        this.x = x;
        this.y = y;
        this.size = 8;
        this.speed = 2;
        this.target = target;

    }

    update() {
        if (!this.target) return;

        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const len = sqrt(dx * dx + dy * dy);

        if (len < this.speed) {
            this.target.hit = true;
            return true;
        }

        this.x += (dx / len) * this.speed;
        this.y += (dy / len) * this.speed;

        return false;
    }
    draw() {
        fill(255, 255, 0);
        circle(this.x, this.y, this.size);
    }
}
