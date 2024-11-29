class Fruit {
    constructor(scale, rows, columns) {
        this.scale = scale;
        this.rows = rows;
        this.columns = columns;
        this.x;
        this.y;
        this.type = 'normal'; // Mồi bình thường
        this.isEaten = false; // Kiểm tra nếu mồi đã được ăn
    }

    pickLocation() {
        this.x = Math.floor(Math.random() * this.rows) * this.scale;
        this.y = Math.floor(Math.random() * this.columns) * this.scale;

        // Chọn một loại mồi ngẫu nhiên
        const randomType = Math.random();
        if (randomType < 0.1) {
            this.type = 'speed';  // Mồi tăng tốc
        } else if (randomType < 0.2) {
            this.type = 'bonus'; // Mồi thưởng thêm điểm
        } else {
            this.type = 'normal'; // Mồi bình thường
        }

        this.isEaten = false; // Đặt lại trạng thái mồi chưa bị ăn
    }

    draw(ctx) {
        if (this.isEaten) return; // Nếu mồi đã ăn rồi, không vẽ nữa

        if (this.type === 'speed') {
            ctx.fillStyle = "#FF6347";  // Màu đỏ cho mồi tăng tốc
        } else if (this.type === 'bonus') {
            ctx.fillStyle = "#FFD700";  // Màu vàng cho mồi thưởng
        } else {
            ctx.fillStyle = "#4cafab";  // Màu xanh cho mồi bình thường
        }

        // Vẽ mồi
        ctx.fillRect(this.x, this.y, this.scale, this.scale);
    }

    // Hàm này sẽ được gọi khi mồi được ăn
    setEaten() {
        this.isEaten = true;
    }
}