// Double-Edge: Retro 2D Platformer
// Modular ES6 classes, placeholder shapes, and comments for future sprite import

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
  this._attackHit = false;
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
    this.maxEnergy = 90; // 9 jumps, 3 double jumps (30 energy each)
    this.energy = this.maxEnergy;
  this.powerUpCooldown = 0;
  this.maxAmmo = 10;
  this.ammo = this.maxAmmo;
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
    // Jump (energy-based)
    if ((input.isDown('ArrowUp') || input.isDown('KeyW'))) {
      if (this.onGround && this.jumps === 0 && this.energy >= 10) {
        this.vy = -(this.powerUp === 'speed' ? this.jumpPower * 1.3 : this.jumpPower);
        this.onGround = false;
        this.jumps = 1;
        this.energy -= 10;
        playSound('jump');
      } else if (!this.onGround && this.jumps < this.maxJumps && !this._jumpPressed && this.energy >= 30) {
        // Allow double jump if enough energy and not on ground
        this.vy = -(this.powerUp === 'speed' ? this.jumpPower * 1.3 : this.jumpPower);
        this.jumps++;
        this.energy -= 30;
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
        let prevY = this.y - this.vy;
        let prevX = this.x - this.vx;
        // Vertical collision
        if (prevY + this.height <= p.y) {
          this.y = p.y - this.height;
          this.vy = 0;
          this.onGround = true;
          this.jumps = 0;
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
        if (this.x + this.width > h.x && this.x < h.x) this.x = h.x - this.width;
        else if (this.x < h.x + h.width && this.x > h.x) this.x = h.x + h.width;
        if (this.y + this.height > h.y && this.y < h.y) this.y = h.y - this.height;
        else if (this.y < h.y + h.height && this.y > h.y) this.y = h.y + h.height;
      }
    }
    // Enemy collision and resolution
    for (let e of enemies) {
      if (this.collides(e)) {
        let prevX = this.x - this.vx;
        if (prevX + this.width <= e.x) {
          this.x = e.x - this.width;
        } else if (prevX >= e.x + e.width) {
          this.x = e.x + e.width;
        }
        let prevY = this.y - this.vy;
        if (prevY + this.height <= e.y) {
          this.y = e.y - this.height;
          this.vy = 0;
          this.onGround = true;
          this.jumps = 0;
        }
      }
    }
    // Border collision
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
    if (input.isDown('Space') && !this.isAttacking && this.attackCooldown <= 0 && this.ammo > 0) {
      this.isAttacking = true;
  this.attackCooldown = 35; // ~0.58s at 60fps
      this.attackAnimFrames = 30; // 0.5s at 60fps
      this.ammo--;
      this._attackHit = false;
      playSound('attack');
    }
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.attackAnimFrames > 0) this.attackAnimFrames--;
    if (this.attackCooldown === 0) {
      this.isAttacking = false;
      this._attackHit = false;
    }
    // Ammo regeneration
    if (this.ammo < this.maxAmmo) {
      if (!this._ammoRegenTimer) this._ammoRegenTimer = 0;
      this._ammoRegenTimer++;
      if (this._ammoRegenTimer >= 120) { // 2s per ammo
        this.ammo++;
        this._ammoRegenTimer = 0;
      }
    }
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
  if (this.attackAnimFrames > 0) {
      let offsetX = this.facing === 'right' ? this.x + this.width : this.x - 16;
      let offsetAxe = this.facing === 'right' ? this.x + this.width : this.x - 20;
      let offsetSpear = this.facing === 'right' ? this.x + this.width : this.x - 24;
      let offsetBow = this.facing === 'right' ? this.x + this.width : this.x - 16;
  if (this.weapon === 'sword') ctx.fillRect(offsetX, this.y + 16, 32, 8); // wider sword
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
    this.powerUpTimer = 1200; // 20 seconds at 60fps
    this.powerUpCooldown = 1200; // 20 seconds cooldown
    if (type === 'shield') this.invincible = true;
    if (type === 'newWeapon') {
      const weapons = ['sword', 'axe', 'spear', 'bow'];
      this.weapon = weapons[randInt(0, weapons.length - 1)];
    }
    // Restore energy on heart sacrifice
    this.energy = this.maxEnergy;
    playSound('powerup');
  }
  endPowerUp() {
    if (this.powerUp === 'shield') this.invincible = false;
    if (this.powerUp === 'newWeapon') this.weapon = 'sword';
    this.powerUp = null;
    this.powerUpTimer = 0;
    // Cooldown remains until expired
  }
}
// --- End of Player class ---

// --- Enemy Class ---
class Enemy {
  constructor(x, y) {
  this.x = x; this.y = y;
  this.attackAnimFrames = 0;
    this.width = 32; this.height = 32;
    this.color = '#f00';
    this.vx = 1.5;
    this.vy = 0;
    this.health = 3;
    this.knockback = 0;
    this.jumpCooldown = randInt(60, 180); // frames until next jump
    this.onGround = false;
    this.stunned = 0;
  }
  update(player, platforms, ladders) {
    if (this.stunned > 0) {
      this.stunned--;
      return;
    }
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
      // PowerUp cooldown tick
      if (this.powerUpCooldown > 0) this.powerUpCooldown--;
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // Health bar
    let barWidth = this.width;
    let percent = Math.max(0, this.health / 3);
    ctx.fillStyle = '#222';
    ctx.fillRect(this.x, this.y - 10, barWidth, 6);
    ctx.fillStyle = percent > 0.5 ? '#0f0' : percent > 0.2 ? '#ff0' : '#f00';
    ctx.fillRect(this.x, this.y - 10, barWidth * percent, 6);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(this.x, this.y - 10, barWidth, 6);
    // Sparkles if stunned
    if (this.stunned > 0) {
      for (let i = 0; i < 8; i++) {
        let angle = (Math.PI * 2 * i) / 8;
        let sx = this.x + this.width / 2 + Math.cos(angle) * 18;
        let sy = this.y + this.height / 2 + Math.sin(angle) * 18;
        ctx.save();
        ctx.globalAlpha = 0.7 * (this.stunned / 30);
        ctx.fillStyle = ['#fff', '#ff0', '#0ff', '#f0f'][i % 4];
        ctx.beginPath();
        ctx.arc(sx, sy, 3 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.restore();
  }
  collides(obj) {
    return this.x < obj.x + obj.width && this.x + this.width > obj.x &&
           this.y < obj.y + obj.height && this.y + this.height > obj.y;
  }
  attackedBy(player) {
    // Attack hitbox based on facing
    if (!player.isAttacking) return false;
    let hitbox = {
      x: player.facing === 'right' ? player.x + player.width : player.x - 40,
      y: player.y + 12,
      width: player.weapon === 'sword' ? 32 : player.weapon === 'axe' ? 20 : player.weapon === 'spear' ? 24 : 16,
      height: player.weapon === 'sword' ? 24 : player.weapon === 'axe' ? 24 : player.weapon === 'spear' ? 8 : 8
    };
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
// --- Boss Enemy Class ---
class BossEnemy extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.width = 80;
    this.height = 80;
    this.color = '#f0f';
    this.health = 30;
    this.spawnCooldown = 120; // frames
  }
  update(player, platforms, ladders, game) {
    if (this.stunned > 0) {
      this.stunned--;
      return;
    }
    // Boss moves slower but is bigger
    if (player.x < this.x) this.x -= 1;
    else if (player.x > this.x) this.x += 1;
    // Gravity
    this.vy += 0.5;
    this.y += this.vy;
    this.onGround = false;
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
      player.takeDamage(3);
    }
    // Spawn weak enemies
    if (this.spawnCooldown > 0) {
      this.spawnCooldown--;
    } else {
      if (game && Math.random() < 0.5) { // 50% chance every cooldown
        let spawnX = this.x + randInt(-40, 120);
        // Find nearest platform below spawnX
        let bestPlatform = null;
        let minDist = Infinity;
        for (let p of platforms) {
          if (spawnX >= p.x && spawnX <= p.x + p.width) {
            let dist = Math.abs((this.y + this.height) - p.y);
            if (dist < minDist) {
              minDist = dist;
              bestPlatform = p;
            }
          }
        }
        let spawnY;
        if (bestPlatform) {
          spawnY = bestPlatform.y - 32; // enemy height
        } else {
          spawnY = this.y + this.height; // fallback
        }
        game.enemies.push(new Enemy(spawnX, spawnY));
      }
      this.spawnCooldown = randInt(90, 180); // 1.5-3s
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // Health bar
    let barWidth = this.width;
    let percent = Math.max(0, this.health / 30);
    ctx.fillStyle = '#222';
    ctx.fillRect(this.x, this.y - 14, barWidth, 10);
    ctx.fillStyle = percent > 0.5 ? '#0f0' : percent > 0.2 ? '#ff0' : '#f00';
    ctx.fillRect(this.x, this.y - 14, barWidth * percent, 10);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(this.x, this.y - 14, barWidth, 10);
    // Sparkles if stunned
    if (this.stunned > 0) {
      for (let i = 0; i < 16; i++) {
        let angle = (Math.PI * 2 * i) / 16;
        let sx = this.x + this.width / 2 + Math.cos(angle) * 40;
        let sy = this.y + this.height / 2 + Math.sin(angle) * 40;
        ctx.save();
        ctx.globalAlpha = 0.7 * (this.stunned / 30);
        ctx.fillStyle = ['#fff', '#ff0', '#0ff', '#f0f'][i % 4];
        ctx.beginPath();
        ctx.arc(sx, sy, 5 + Math.random() * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.restore();
  }
}

// --- Platform Class ---
// --- Ladder Class ---
class Ladder {
  constructor(x, y, width, height) {
    this.x = x; this.y = y;
    this.width = width; this.height = height;
  }
  draw(ctx) {
    ctx.save();
    ctx.fillStyle = '#0ff';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
  collides(obj) {
    return obj.x + obj.width > this.x && obj.x < this.x + this.width &&
           obj.y + obj.height > this.y && obj.y < this.y + this.height;
  }
}
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

// --- Shockwave Effect ---
class Shockwave {
  constructor(x, y, radius, duration = 30) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.duration = duration;
    this.frame = 0;
  }
  draw(ctx) {
    if (this.frame < this.duration) {
      ctx.save();
      ctx.globalAlpha = 0.5 * (1 - this.frame / this.duration);
      let grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius + this.frame * 2);
      grad.addColorStop(0, '#fff');
      grad.addColorStop(0.3, '#0ff');
      grad.addColorStop(0.7, '#f0f');
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + this.frame * 2, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
      // Sparkles
      for (let i = 0; i < 12; i++) {
        let angle = (Math.PI * 2 * i) / 12;
        let sx = this.x + Math.cos(angle) * (this.radius + this.frame * 2);
        let sy = this.y + Math.sin(angle) * (this.radius + this.frame * 2);
        ctx.save();
        ctx.globalAlpha = 0.7 * (1 - this.frame / this.duration);
        ctx.fillStyle = ['#fff', '#ff0', '#0ff', '#f0f'][i % 4];
        ctx.beginPath();
        ctx.arc(sx, sy, 3 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }
  update() {
    this.frame++;
  }
  isDone() {
    return this.frame >= this.duration;
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
    this.energyDiv = document.getElementById('energybar');
    this.powerupDiv = document.getElementById('powerup');
  }
  update() {
    // Hearts
    let heartsHTML = '';
    for (let i = 0; i < this.player.maxHearts; i++) {
      heartsHTML += `<span style="color:${i < this.player.hearts ? '#f00' : '#444'};font-size:24px;">&#10084;</span> `;
    }
    this.heartsDiv.innerHTML = heartsHTML;
    // Energy bar
    let percent = Math.floor((this.player.energy / this.player.maxEnergy) * 100);
    let gradient = this.player.powerUp ?
      `linear-gradient(270deg, #ff0, #f0f, #0ff, #ff0)` :
      `linear-gradient(90deg, #0ff 60%, #ff0 100%)`;
    this.energyDiv.innerHTML = `<div id='energybar-inner' style='width:${percent}%;background:${gradient}'></div>`;
    // Ammo bar
    let ammoPercent = Math.floor((this.player.ammo / this.player.maxAmmo) * 100);
    let ammoGradient = `linear-gradient(90deg, #fff 60%, #f00 100%)`;
    if (!document.getElementById('ammobar')) {
      let bar = document.createElement('div');
      bar.id = 'ammobar';
      bar.style.height = '6px';
      bar.style.marginBottom = '2px';
      this.energyDiv.parentNode.insertBefore(bar, this.energyDiv.nextSibling);
    }
    document.getElementById('ammobar').innerHTML = `<div id='ammobar-inner' style='width:${ammoPercent}%;background:${ammoGradient};height:100%;'></div>`;
    // Powerup
    if (this.player.powerUp) {
      let name = this.player.powerUp;
      let time = Math.ceil(this.player.powerUpTimer / 60);
      this.powerupDiv.innerHTML = `Power-Up: <b>${name}</b> (${time}s)`;
    } else if (this.player.powerUpCooldown > 0) {
      let cd = Math.ceil(this.player.powerUpCooldown / 60);
      this.powerupDiv.innerHTML = `Power-Up Cooldown: <b>${cd}s</b>`;
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
    },
        // Level 3: Boss Level
        {
          platforms: [
            new Platform(0, 550, 800, 50),
            new Platform(200, 400, 120, 20),
            new Platform(500, 300, 120, 20),
            new Platform(350, 200, 200, 20)
          ],
          hazards: [
            new Hazard(400, 530, 40, 20),
            new Hazard(600, 530, 40, 20)
          ],
          enemies: [
            { boss: true, x: 600, y: 470 }
          ],
          playerStart: { x: 100, y: 500 }
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
    this.shockwaves = [];
    requestAnimationFrame(this.loop);
  }

  loadLevel(levelIdx) {
    const level = this.levels[levelIdx];
    this.platforms = level.platforms.map(p => new Platform(p.x, p.y, p.width, p.height));
    this.hazards = level.hazards.map(h => new Hazard(h.x, h.y, h.width, h.height));
    this.ladders = level.ladders ? level.ladders.map(l => new Ladder(l.x, l.y, l.width, l.height)) : [];
  this.enemies = level.enemies.map(e => e.boss ? new BossEnemy(e.x, e.y) : new Enemy(e.x, e.y));
    if (!this.player) {
      this.player = new Player(level.playerStart.x, level.playerStart.y);
      this.player.hearts = 5;
      this.player.maxHearts = 5;
      this.ui = new UI(this.player);
      this.initFullscreen();
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
  initFullscreen() {
    const btn = document.getElementById('fullscreen-btn');
    btn.addEventListener('click', () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    });
  }
  initInput() {
    window.addEventListener('keydown', e => {
      if ((e.code === 'KeyE') && this.player.hearts > 1 && !this.player.powerUp && this.player.powerUpCooldown <= 0) {
        this.player.hearts--;
        let p = getRandomPowerUp();
        this.player.startPowerUp(p);
        if (p === 'shockwave') {
          // Add visible shockwave effect
          this.shockwaves.push(new Shockwave(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, 60, 30));
          for (let enemy of this.enemies) {
            if (Math.abs(enemy.x - this.player.x) < 80) {
              enemy.takeDamage(2);
              enemy.stunned = 30; // 0.5 seconds at 60fps
            }
          }
        }
      }
      if (e.code === 'Escape' || e.code === 'KeyP') {
        this.paused = !this.paused;
      }
      if (e.code === 'KeyN' && this.levelComplete && this.currentLevel < this.levels.length - 1) {
  this.currentLevel++;
  // Gain 1 heart to both max and current health
  this.player.maxHearts++;
  this.player.hearts = this.player.maxHearts; // Fully restore health
  this.player.ammo = this.player.maxAmmo; // Fully restore ammo
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
    this.player.update(this.input, this.platforms, this.hazards, this.enemies, this.ladders);
    let killedThisFrame = 0;
    for (let enemy of this.enemies) {
      if (enemy instanceof BossEnemy) {
        enemy.update(this.player, this.platforms, this.ladders, this);
      } else {
        enemy.update(this.player, this.platforms, this.ladders);
      }
      // Player attack (directional)
      if (enemy.attackedBy(this.player) && !this.player._attackHit) {
        let dmg = this.player.powerUp === 'damage' ? 2 : 1;
        enemy.takeDamage(dmg);
        this.player._attackHit = true;
        // Knockback player unless touching wall
        let touchingWall = false;
        for (let p of this.platforms) {
          if (this.player.x <= p.x || this.player.x + this.player.width >= p.x + p.width) {
            touchingWall = true;
            break;
          }
        }
        if (!touchingWall) {
          // Fling player back
          let kb = this.player.facing === 'right' ? -8 : 8;
          this.player.vx = kb;
        }
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
    // Update shockwaves
    this.shockwaves = this.shockwaves.filter(sw => {
      sw.update();
      return !sw.isDone();
    });
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
    // Shockwaves
    for (let sw of this.shockwaves) sw.draw(this.ctx);
    // Platforms
    for (let p of this.platforms) p.draw(this.ctx);
    // Hazards
    for (let h of this.hazards) h.draw(this.ctx);
    // Ladders
    for (let l of this.ladders || []) l.draw(this.ctx);
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
