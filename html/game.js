// Double-Edge: Retro 2D Platformer
// Modular ES6 classes, placeholder shapes, and comments for future sprite import
// :skulk: this thing has so many features compared to mine. alright time to do stuff.
// --- Sound Stub ---
export function playSound(name) {
  // TODO: Insert .wav/.mp3 files later
  // Example: new Audio(`assets/sounds/${name}.wav`).play();
}

// --- Utility ---
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Input Handler ---
class Input {
  constructor() {
    this.keys = {};
    window.addEventListener('keydown', e => this.keys[e.code] = true);
    window.addEventListener('keyup', e => this.keys[e.code] = false);
  }
  isDown(key) { return !!this.keys[key]; }
}

// --- Player Class ---
class Player {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.width = 32; this.height = 48;
    this.color = '#0ff';
    this.maxHearts = 5;
    this.hearts = 5;
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.powerUp = null;
    this.powerUpTimer = 0;
    this.weapon = 'sword';
    this.speed = 3;
    this.jumpPower = 10;
    this.onGround = false;
    this.invincible = false;
    this.cosmetic = null;
    this.facing = 'right'; // 'left' or 'right'
    this.jumps = 0; // double jump counter
    this.maxJumps = 2;
  }
  update(input, platforms, hazards, enemies) {
    // Movement
    let moveSpeed = this.powerUp === 'speed' ? this.speed * 1.7 : this.speed;
    if (input.isDown('ArrowLeft') || input.isDown('KeyA')) {
      this.vx = -moveSpeed;
      this.facing = 'left';
    } else if (input.isDown('ArrowRight') || input.isDown('KeyD')) {
      this.vx = moveSpeed;
      this.facing = 'right';
    } else {
      this.vx = 0;
    }
    // Jump (double jump)
    if ((input.isDown('ArrowUp') || input.isDown('KeyW'))) {
      if (this.onGround && this.jumps === 0) {
        this.vy = -(this.powerUp === 'speed' ? this.jumpPower * 1.3 : this.jumpPower);
        this.onGround = false;
        this.jumps = 1;
        playSound('jump');
      } else if (!this.onGround && this.jumps < this.maxJumps && !this._jumpPressed) {
        this.vy = -(this.powerUp === 'speed' ? this.jumpPower * 1.3 : this.jumpPower);
        this.jumps++;
        playSound('jump');
      }
      this._jumpPressed = true;
    } else {
      this._jumpPressed = false;
    }
    // Gravity
    this.vy += 0.5;
    // Move
    this.x += this.vx;
    this.y += this.vy;
    this.onGround = false;
    // Platform collision and resolution
    for (let p of platforms) {
      if (this.collides(p)) {
        // Resolve collision: move player out of platform
        let prevY = this.y - this.vy;
        let prevX = this.x - this.vx;
        // Vertical collision
        if (prevY + this.height <= p.y) {
          this.y = p.y - this.height;
          this.vy = 0;
          this.onGround = true;
          this.jumps = 0; // reset jumps on landing
        } else if (prevY >= p.y + p.height) {
          this.y = p.y + p.height;
          this.vy = 0;
        } else if (prevX + this.width <= p.x) {
          this.x = p.x - this.width;
        } else if (prevX >= p.x + p.width) {
          this.x = p.x + p.width;
        }
      }
    }
    // Hazard collision and resolution
    for (let h of hazards) {
      if (h.collides(this)) {
        // Move player out of hazard
        if (this.x + this.width > h.x && this.x < h.x) this.x = h.x - this.width;
        else if (this.x < h.x + h.width && this.x > h.x) this.x = h.x + h.width;
        if (this.y + this.height > h.y && this.y < h.y) this.y = h.y - this.height;
        else if (this.y < h.y + h.height && this.y > h.y) this.y = h.y + h.height;
      }
    }
    // Enemy collision and resolution
    for (let e of enemies) {
      if (this.collides(e)) {
        // Move player out of enemy
        if (this.x + this.width > e.x && this.x < e.x) this.x = e.x - this.width;
        else if (this.x < e.x + e.width && this.x > e.x) this.x = e.x + e.width;
        if (this.y + this.height > e.y && this.y < e.y) this.y = e.y - this.height;
        else if (this.y < e.y + e.height && this.y > e.y) this.y = e.y + e.height;
      }
    }
    // --- Border collision ---
    // Canvas size: 800x600
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > 800) this.x = 800 - this.width;
    if (this.y < 0) {
      this.y = 0;
      this.vy = 0;
    }
    if (this.y + this.height > 600) {
      this.y = 600 - this.height;
      this.vy = 0;
      this.onGround = true;
    }
    // Attack
    if (input.isDown('Space') && !this.isAttacking && this.attackCooldown <= 0) {
      this.isAttacking = true;
      this.attackCooldown = 20;
      playSound('attack');
    }
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.attackCooldown === 0) this.isAttacking = false;
    // Power-up timer
    if (this.powerUp && this.powerUpTimer > 0) {
      this.powerUpTimer--;
      if (this.powerUpTimer === 0) this.endPowerUp();
    }
  }
  draw(ctx) {
    // Placeholder: draw rectangle
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // Cosmetic effect
    if (this.cosmetic === 'glow') {
      ctx.shadowColor = '#ff0';
      ctx.shadowBlur = 16;
    }
    // Weapon placeholder
    ctx.fillStyle = '#fff';
    if (this.isAttacking) {
      let offsetX = this.facing === 'right' ? this.x + this.width : this.x - 16;
      let offsetAxe = this.facing === 'right' ? this.x + this.width : this.x - 20;
      let offsetSpear = this.facing === 'right' ? this.x + this.width : this.x - 24;
      let offsetBow = this.facing === 'right' ? this.x + this.width : this.x - 16;
      if (this.weapon === 'sword') ctx.fillRect(offsetX, this.y + 16, 16, 8);
      if (this.weapon === 'axe') ctx.fillRect(offsetAxe, this.y + 12, 20, 12);
      if (this.weapon === 'spear') ctx.fillRect(offsetSpear, this.y + 20, 24, 4);
      if (this.weapon === 'bow') ctx.fillRect(offsetBow, this.y + 24, 16, 4);
    }
    ctx.restore();
  }
  collides(obj) {
    return this.x < obj.x + obj.width && this.x + this.width > obj.x &&
           this.y < obj.y + obj.height && this.y + this.height > obj.y;
  }
  takeDamage(amount) {
    // Immune if invincible or shield power-up is active
    if (this.invincible || this.powerUp === 'shield') return;
    this.hearts -= amount;
    playSound('hurt');
    this.invincible = true;
    setTimeout(() => this.invincible = false, 1000);
    if (this.hearts <= 0) this.hearts = 0;
  }
  startPowerUp(type) {
    this.powerUp = type;
    this.powerUpTimer = 600; // 10 seconds at 60fps
    if (type === 'shield') this.invincible = true;
    if (type === 'newWeapon') {
      const weapons = ['sword', 'axe', 'spear', 'bow'];
      this.weapon = weapons[randInt(0, weapons.length - 1)];
    }
    playSound('powerup');
  }
  endPowerUp() {
    if (this.powerUp === 'shield') this.invincible = false;
    if (this.powerUp === 'newWeapon') this.weapon = 'sword';
    this.powerUp = null;
    this.powerUpTimer = 0;
  }
}

// --- Enemy Class ---
class Enemy {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.width = 32; this.height = 32;
    this.color = '#f00';
    this.vx = 1.5;
    this.vy = 0;
    this.health = 3;
    this.knockback = 0;
    this.jumpCooldown = randInt(60, 180); // frames until next jump
    this.onGround = false;
  }
  update(player, platforms) {
    if (this.knockback > 0) {
      this.x += 4;
      this.knockback--;
      return;
    }
    // Simple AI: move toward player
    if (player.x < this.x) this.x -= this.vx;
    else if (player.x > this.x) this.x += this.vx;

    // Random jump logic
    if (this.jumpCooldown > 0) {
      this.jumpCooldown--;
    } else if (this.onGround) {
      this.vy = -10;
      this.onGround = false;
      this.jumpCooldown = randInt(60, 180); // next jump in 1-3 seconds
    }

    // Gravity
    this.vy += 0.5;
    this.y += this.vy;
    this.onGround = false;
    // Platform collision
    for (let p of platforms) {
      if (this.collides(p)) {
        if (this.vy > 0 && this.y + this.height - this.vy <= p.y) {
          this.y = p.y - this.height;
          this.vy = 0;
          this.onGround = true;
        }
      }
    }
    // Attack player
    if (this.collides(player)) {
      player.takeDamage(1);
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
  collides(obj) {
    return this.x < obj.x + obj.width && this.x + this.width > obj.x &&
           this.y < obj.y + obj.height && this.y + this.height > obj.y;
  }
  attackedBy(player) {
    // Attack hitbox based on facing
    if (!player.isAttacking) return false;
    let hitbox = { x: player.facing === 'right' ? player.x + player.width : player.x - 24, y: player.y + 12, width: player.weapon === 'sword' ? 16 : player.weapon === 'axe' ? 20 : player.weapon === 'spear' ? 24 : 16, height: player.weapon === 'sword' ? 24 : player.weapon === 'axe' ? 24 : player.weapon === 'spear' ? 8 : 8 };
    return this.x < hitbox.x + hitbox.width && this.x + this.width > hitbox.x &&
           this.y < hitbox.y + hitbox.height && this.y + this.height > hitbox.y;
  }
  takeDamage(amount) {
    this.health -= amount;
    this.knockback = 10;
    playSound('enemyHurt');
  }
  isDead() { return this.health <= 0; }
}

// --- Platform Class ---
class Platform {
  constructor(x, y, width, height) {
    this.x = x; this.y = y;
    this.width = width; this.height = height;
  }
  draw(ctx) {
    ctx.save();
    ctx.fillStyle = '#888';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}

// --- Hazard Class ---
class Hazard {
  constructor(x, y, width, height) {
    this.x = x; this.y = y;
    this.width = width; this.height = height;
  }
  draw(ctx) {
    ctx.save();
    ctx.fillStyle = '#ff0';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
  collides(obj) {
    return obj.x < this.x + this.width && obj.x + obj.width > this.x &&
           obj.y < this.y + this.height && obj.y + obj.height > this.y;
  }
}

// --- PowerUp System ---
const POWERUPS = ['damage', 'speed', 'shield', 'shockwave', 'newWeapon'];
function getRandomPowerUp() {
  return POWERUPS[randInt(0, POWERUPS.length - 1)];
}

// --- UI ---
class UI {
  constructor(player) {
    this.player = player;
    this.heartsDiv = document.getElementById('hearts');
    this.powerupDiv = document.getElementById('powerup');
  }
  update() {
    // Hearts
    let heartsHTML = '';
    for (let i = 0; i < this.player.maxHearts; i++) {
      heartsHTML += `<span style="color:${i < this.player.hearts ? '#f00' : '#444'};font-size:24px;">&#10084;</span> `;
    }
    this.heartsDiv.innerHTML = heartsHTML;
    // Powerup
    if (this.player.powerUp) {
      let name = this.player.powerUp;
      let time = Math.ceil(this.player.powerUpTimer / 60);
      this.powerupDiv.innerHTML = `Power-Up: <b>${name}</b> (${time}s)`;
    } else {
      this.powerupDiv.innerHTML = '';
    }
  }
}

// --- Game Class ---
class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.input = new Input();
    this.levels = [
      {
        platforms: [
          new Platform(0, 550, 800, 50),
          new Platform(200, 450, 120, 20),
          new Platform(400, 350, 120, 20),
          new Platform(600, 250, 120, 20)
        ],
        hazards: [
          new Hazard(350, 530, 40, 20),
          new Hazard(500, 530, 40, 20)
        ],
        enemies: [
          new Enemy(600, 500),
          new Enemy(300, 500)
        ],
        playerStart: { x: 100, y: 400 }
      },
      {
        platforms: [
          new Platform(0, 550, 800, 50),
          new Platform(100, 400, 100, 20),
          new Platform(300, 300, 150, 20),
          new Platform(600, 200, 120, 20),
          new Platform(500, 500, 80, 20)
        ],
        hazards: [
          new Hazard(250, 530, 40, 20),
          new Hazard(700, 530, 40, 20),
          new Hazard(400, 280, 40, 20)
        ],
        enemies: [
          new Enemy(700, 500),
          new Enemy(150, 380),
          new Enemy(350, 280)
        ],
        playerStart: { x: 50, y: 500 }
      }
    ];
    this.currentLevel = 0;
    this.loadLevel(this.currentLevel);
    this.enemiesKilled = 0;
    this.paused = false;
    this.gameOver = false;
    this.levelComplete = false;
    this.roadUnlocks = { outfits: [], weapons: [], lore: [] };
    this.loadUnlocks();
    this.loop = this.loop.bind(this);
    this.initInput();
    requestAnimationFrame(this.loop);
  }

  loadLevel(levelIdx) {
    const level = this.levels[levelIdx];
    this.platforms = level.platforms.map(p => new Platform(p.x, p.y, p.width, p.height));
    this.hazards = level.hazards.map(h => new Hazard(h.x, h.y, h.width, h.height));
    this.enemies = level.enemies.map(e => new Enemy(e.x, e.y));
    if (!this.player) {
      this.player = new Player(level.playerStart.x, level.playerStart.y);
      this.player.hearts = 5;
      this.player.maxHearts = 5;
      this.ui = new UI(this.player);
    } else {
      this.player.x = level.playerStart.x;
      this.player.y = level.playerStart.y;
      this.player.vx = 0;
      this.player.vy = 0;
      this.player.onGround = false;
      this.player.jumps = 0;
    }
    this.levelComplete = false;
    this.gameOver = false;
  }
  initInput() {
    window.addEventListener('keydown', e => {
      if ((e.code === 'KeyE') && this.player.hearts > 1 && !this.player.powerUp) {
        this.player.hearts--;
        let p = getRandomPowerUp();
        this.player.startPowerUp(p);
        if (p === 'shockwave') {
          for (let enemy of this.enemies) {
            if (Math.abs(enemy.x - this.player.x) < 80) enemy.takeDamage(2);
          }
        }
      }
      if (e.code === 'Escape' || e.code === 'KeyP') {
        this.paused = !this.paused;
      }
      if (e.code === 'KeyN' && this.levelComplete && this.currentLevel < this.levels.length - 1) {
        this.currentLevel++;
        this.loadLevel(this.currentLevel);
        this.levelComplete = false;
        this.gameOver = false;
        requestAnimationFrame(this.loop);
      }
    });
  }
  loop() {
    if (this.paused) {
      this.drawPause();
      requestAnimationFrame(this.loop);
      return;
    }
    if (this.gameOver) {
      this.drawGameOver();
      return;
    }
    if (this.levelComplete) {
      this.drawLevelComplete();
      return;
    }
    this.update();
    this.draw();
    requestAnimationFrame(this.loop);
  }
  update() {
  this.player.update(this.input, this.platforms, this.hazards, this.enemies);
    let killedThisFrame = 0;
    for (let enemy of this.enemies) {
      enemy.update(this.player, this.platforms);
      // Player attack (directional)
      if (enemy.attackedBy(this.player)) {
        let dmg = this.player.powerUp === 'damage' ? 2 : 1;
        enemy.takeDamage(dmg);
      }
      if (enemy.isDead()) {
        killedThisFrame++;
      }
    }
    // Remove dead enemies
    let prevCount = this.enemies.length;
    this.enemies = this.enemies.filter(e => !e.isDead());
    let killed = prevCount - this.enemies.length;
    if (killed > 0) {
      this.enemiesKilled += killed;
      // For every 5 enemies killed, gain 1 heart if under max
      let heartsToAdd = Math.floor(this.enemiesKilled / 5);
      if (heartsToAdd > 0 && this.player.hearts < this.player.maxHearts) {
        this.player.hearts = Math.min(this.player.hearts + heartsToAdd, this.player.maxHearts);
        this.enemiesKilled = this.enemiesKilled % 5;
        playSound('heartGain');
      }
    }
    // Hazards
    for (let hazard of this.hazards) {
      if (hazard.collides(this.player)) {
        this.player.takeDamage(1);
      }
    }
    // Level complete condition
    if (this.enemies.length === 0) {
      this.levelComplete = true;
    }
    // Game over
    if (this.player.hearts <= 0) {
      this.gameOver = true;
    }
    this.ui.update();
  }
  draw() {
    // Clear
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Background
    this.ctx.fillStyle = '#222';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // Platforms
    for (let p of this.platforms) p.draw(this.ctx);
    // Hazards
    for (let h of this.hazards) h.draw(this.ctx);
    // Enemies
    for (let e of this.enemies) e.draw(this.ctx);
    // Player
    this.player.draw(this.ctx);
  }
  drawPause() {
    this.ctx.save();
    this.ctx.globalAlpha = 0.7;
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '32px monospace';
    this.ctx.fillText('PAUSED', 340, 300);
    this.ctx.restore();
  }
  drawGameOver() {
    this.ctx.save();
    this.ctx.globalAlpha = 0.8;
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = '#f00';
    this.ctx.font = '32px monospace';
    this.ctx.fillText('GAME OVER', 320, 300);
    this.ctx.restore();
  }
  drawLevelComplete() {
    this.ctx.save();
    this.ctx.globalAlpha = 0.8;
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = '#0f0';
    this.ctx.font = '32px monospace';
    this.ctx.fillText('LEVEL COMPLETE!', 270, 300);
    this.ctx.font = '18px monospace';
    if (this.currentLevel < this.levels.length - 1) {
      this.ctx.fillText('Press N for Next Level', 270, 340);
    } else {
      this.ctx.fillText('All levels complete!', 270, 340);
    }
    this.ctx.restore();
    // TODO: Implement unlock menu
  }
  loadUnlocks() {
    let data = localStorage.getItem('doubleEdgeUnlocks');
    if (data) this.roadUnlocks = JSON.parse(data);
  }
  saveUnlocks() {
    localStorage.setItem('doubleEdgeUnlocks', JSON.stringify(this.roadUnlocks));
  }
}

// --- Start Game ---
window.onload = () => {
  new Game();
};
