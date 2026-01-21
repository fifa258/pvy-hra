class Bullet {
    constructor(x, y, target, img) {
        this.x = x;
        this.y = y;
        this.size = 8;
        this.speed = 2;
        this.target = target;
        this.img = img;
    }

    update() {
        if (!this.target) return; // pokud cil neexistuje ukonci

        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const len = sqrt(dx * dx + dy * dy);

        if (len < this.speed) { // pokud je strela blizko cile tak zasahne
            this.target.hit = true;
            return true;
        }

        // pohyb strely k cili
        this.x += (dx / len) * this.speed;
        this.y += (dy / len) * this.speed;

        return false;
    }
    draw() {
        image(this.img, this.x, this.y, 25, 25);
        noStroke();
        noFill();
        circle(this.x, this.y, this.size);
    }
}
