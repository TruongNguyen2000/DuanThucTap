class Snake {
    constructor(scale, canvasWidth, canvasHeight) {
        this.x = 0;
        this.y = 0;
        this.scale = scale;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.xSpeed = scale; // Tốc độ ban đầu là 1 bước dài
        this.ySpeed = 0;
        this.total = 0; // Tổng số điểm
        this.tail = []; // Danh sách các phần tử của đuôi
        this.color = "#FFFFFF"; // Màu sắc của rắn
        this.speedBoost = false; // Cờ cho việc tăng tốc
    }

    // Phương thức vẽ rắn
    draw(ctx) {
        ctx.fillStyle = this.color;
        for (let i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, this.scale, this.scale);
        }
        ctx.fillRect(this.x, this.y, this.scale, this.scale);
    }

    // Phương thức cập nhật vị trí và đuôi của rắn
    update() {
        // Cập nhật đuôi của rắn
        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }
    
        if (this.total > 0) {
            this.tail[this.total - 1] = { x: this.x, y: this.y };
        }
    
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    
        // Đảm bảo rắn di chuyển qua biên và quay lại từ phía đối diện
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

    // Phương thức thay đổi hướng di chuyển của rắn
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

    // Phương thức kiểm tra nếu rắn ăn được mồi
    eat(fruit) {
        if (this.x === fruit.x && this.y === fruit.y) {
            this.total++;
            if (fruit.type === 'speed') {
                this.activateSpeedBoost(); // Kích hoạt tăng tốc khi ăn mồi tăng tốc
            } else if (fruit.type === 'bonus') {
                // Thêm điểm thưởng một cách mượt mà
                this.addBonusPoints();
            }
            fruit.setEaten(); // Đánh dấu mồi đã bị ăn
            return true;
        }
        return false;
    }
    
    // Thêm phương thức cho điểm thưởng
    addBonusPoints() {
        this.total += 5;  // Thêm điểm thưởng ngay lập tức
    }

    // Phương thức kích hoạt tăng tốc cho rắn
    activateSpeedBoost() {
        // Tăng tốc độ của rắn
        this.xSpeed *= 4;  
        this.ySpeed *= 4; 
     
    }

    // Phương thức kiểm tra va chạm với chính đuôi của rắn
    checkCollision() {
        for (let i = 0; i < this.tail.length; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                return true;
            }
        }
        return false;
    }
}