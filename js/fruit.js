class Fruit {
    constructor(scale, rows, columns) {
        this.scale = scale;
        this.rows = rows;
        this.columns = columns;
        this.x;
        this.y;
    }

    pickLocation() {
        this.x = Math.floor(Math.random() * this.rows) * this.scale;
        this.y = Math.floor(Math.random() * this.columns) * this.scale;
    }

    draw(ctx) {
        ctx.fillStyle = "#4cafab";
        ctx.fillRect(this.x, this.y, this.scale, this.scale);
    }
}
