let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');

// สร้าง Player
let player = {
    x: 50,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    speed: 5,
    color: '#FF0000',

    draw: function() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    },

    update: function() {
        if (keys['ArrowUp'] && this.y > 0) this.y -= this.speed;
        if (keys['ArrowDown'] && this.y < canvas.height - this.height) this.y += this.speed;
        if (keys['ArrowLeft'] && this.x > 0) this.x -= this.speed;
        if (keys['ArrowRight'] && this.x < canvas.width - this.width) this.x += this.speed;
    }
};

let keys = {};

document.addEventListener('keydown', function(event) {
    keys[event.key] = true;
});

document.addEventListener('keyup', function(event) {
    keys[event.key] = false;
});

function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    player.update();
    player.draw();

    requestAnimationFrame(update);
}

update();
