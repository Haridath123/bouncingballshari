const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const counter = document.getElementById('count');

canvas.width = window.innerWidth * 0.95;
canvas.height = window.innerHeight * 0.75;

let gravity = false;

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor() {
  return `rgb(${random(0,255)},${random(0,255)},${random(0,255)})`;
}

class Ball {
  constructor(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
    this.originalColor = color;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if ((this.x + this.size) >= canvas.width || (this.x - this.size) <= 0) {
      this.velX = -this.velX;
    }

    if ((this.y + this.size) >= canvas.height) {
      this.velY = -this.velY;
    } else if ((this.y - this.size) <= 0) {
      this.velY = -this.velY;
    }

    if (gravity) this.velY += 0.2;

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect(balls) {
    for (let i = 0; i < balls.length; i++) {
      if (this !== balls[i]) {
        const dx = this.x - balls[i].x;
        const dy = this.y - balls[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + balls[i].size) {
          this.color = randomColor();
          balls[i].color = randomColor();
        }
      }
    }
  }
}

const balls = [];

function createBall() {
  const size = random(10, 20);
  const ball = new Ball(
    random(size, canvas.width - size),
    random(size, canvas.height - size),
    random(-4, 4),
    random(-4, 4),
    randomColor(),
    size
  );
  balls.push(ball);
  counter.textContent = balls.length;
}

for (let i = 0; i < 25; i++) createBall();

function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect(balls);
  }

  requestAnimationFrame(loop);
}

loop();

canvas.addEventListener('click', () => {
  for (let i = 0; i < 5; i++) createBall();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'g' || e.key === 'G') {
    gravity = !gravity;
  }
});
