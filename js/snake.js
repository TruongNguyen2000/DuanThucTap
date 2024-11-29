class Snake {
    constructor(scale, canvasWidth, canvasHeight) {
        this.x = 0;
        this.y = 0;
        this.scale = scale;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.xSpeed = scale * 1;
        this.ySpeed = 0;
        this.total = 0;
        this.tail = [];
    }

    draw(ctx) {
        ctx.fillStyle = "#FFFFFF";
        for (let i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, this.scale, this.scale);
        }
        ctx.fillRect(this.x, this.y, this.scale, this.scale);
    }

    update() {
        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }
        this.tail[this.total - 1] = { x: this.x, y: this.y };
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x >= this.canvasWidth) {
            this.x = 0;
        }
        if (this.y >= this.canvasHeight) {
            this.y = 0;
        }
        if (this.x < 0) {
            this.x = this.canvasWidth - this.scale;
        }
        if (this.y < 0) {
            this.y = this.canvasHeight - this.scale;
        }
    }

    changeDirection(direction) {
        switch (direction) {
            case 'Up':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = -this.scale;
                }
                break;
            case 'Down':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = this.scale;
                }
                break;
            case 'Left':
                if (this.xSpeed === 0) {
                    this.xSpeed = -this.scale;
                    this.ySpeed = 0;
                }
                break;
            case 'Right':
                if (this.xSpeed === 0) {
                    this.xSpeed = this.scale;
                    this.ySpeed = 0;
                }
                break;
        }
    }

    eat(fruit) {
        if (this.x === fruit.x && this.y === fruit.y) {
            this.total++;
            return true;
        }
        return false;
    }

    checkCollision() {
        for (let i = 0; i < this.tail.length; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                return true;
            }
        }
        return false;
    }
}
