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
    this.maxHearts = 5; // Default for level 1, will be updated by loadLevel
    this.hearts = 5; // Default for level 1, will be updated by loadLevel
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.attackMomentum = 0; // For forward momentum when hitting enemies
    this.attackMomentumTimer = 0;
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
    this.maxEnergy = 180; // 18 jumps, 6 double jumps (30 energy each) - 2x the original
    this.energy = this.maxEnergy;
    this.powerUpCooldown = 0;
    this.maxAmmo = 10;
    this.ammo = this.maxAmmo;
    this.healingStun = 0; // For healing spell - makes player stationary
    this.spellCooldown = 0; // Cooldown for spellcaster abilities (0.5s = 30 frames)
    this.healingCooldown = 0; // Separate cooldown for healing spell (10s = 600 frames)
    
    // Casting system
    this.isCasting = false;
    this.castingTimer = 0;
    this.castingSpell = null; // 'fireball', 'iceShard', or 'healingWave'
    this.castingDuration = 30; // 0.5 seconds at 60 FPS
    
    // Bow system
    this.isChargingBow = false;
    this.bowChargeTime = 0;
    this.maxBowCharge = 120; // 2 seconds at 60 FPS
    this.bowAimHeight = 0; // -1 to 1, affects trajectory angle
    this.maxAimHeight = 1; // Maximum aim adjustment
    
    // Sprite animation for idle
    this.idleFrame = 0;
    this.idleFrameCounter = 0;
    this.idleImages = [new Image(), new Image()];
    this.idleImages[0].src = 'assets/player/Normal Idle/0.png';
    this.idleImages[1].src = 'assets/player/Normal Idle/1.png';
    // Sprite animation for jumping
    this.jumpFrame = 0;
    this.jumpFrameCounter = 0;
    this.jumpImages = [new Image(), new Image(), new Image(), new Image()];
    this.jumpImages[0].src = 'assets/player/Normal Jump/daydream_assets-10.png.png';
    this.jumpImages[1].src = 'assets/player/Normal Jump/daydream_assets-11.png.png';
    this.jumpImages[2].src = 'assets/player/Normal Jump/daydream_assets-12.png.png';
    this.jumpImages[3].src = 'assets/player/Normal Jump/daydream_assets-13.png.png';
    // Sprite animation for normal running
    this.runFrame = 0;
    this.runFrameCounter = 0;
    this.runImages = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
    this.runImages[0].src = 'assets/player/Normal Run/daydream_assets-4.png.png';
    this.runImages[1].src = 'assets/player/Normal Run/daydream_assets-5.png.png';
    this.runImages[2].src = 'assets/player/Normal Run/daydream_assets-6.png.png';
    this.runImages[3].src = 'assets/player/Normal Run/daydream_assets-7.png.png';
    this.runImages[4].src = 'assets/player/Normal Run/daydream_assets-8.png.png';
    this.runImages[5].src = 'assets/player/Normal Run/daydream_assets-9.png.png';
    
    // Sprite animation for normal attack
    this.attackFrame = 0;
    this.attackFrameCounter = 0;
    this.attackImages = [new Image(), new Image(), new Image()];
    this.attackImages[0].src = 'assets/player/Normal Attack/0.png';
    this.attackImages[1].src = 'assets/player/Normal Attack/1.png';
    this.attackImages[2].src = 'assets/player/Normal Attack/2.png';
    
    // Sprite animation for scythe idle
    this.scytheIdleFrame = 0;
    this.scytheIdleFrameCounter = 0;
    this.scytheIdleImages = [new Image(), new Image(), new Image(), new Image()];
    this.scytheIdleImages[0].src = 'assets/player/Scythe Idle/0.png';
    this.scytheIdleImages[1].src = 'assets/player/Scythe Idle/1.png';
    this.scytheIdleImages[2].src = 'assets/player/Scythe Idle/2.png';
    this.scytheIdleImages[3].src = 'assets/player/Scythe Idle/3.png';
    
    // Sprite animation for scythe run 
    this.scytheRunFrame = 0;
    this.scytheRunFrameCounter = 0;
    this.scytheRunImages = [new Image(), new Image(), new Image(), new Image()];
    this.scytheRunImages[0].src = 'assets/player/Scythe Run/0.png';
    this.scytheRunImages[1].src = 'assets/player/Scythe Run/1.png';
    this.scytheRunImages[2].src = 'assets/player/Scythe Run/2.png';
    this.scytheRunImages[3].src = 'assets/player/Scythe Run/3.png';
    
    // Sprite animation for scythe jump
    this.scytheJumpFrame = 0;
    this.scytheJumpFrameCounter = 0;
    this.scytheJumpImages = [new Image(), new Image(), new Image(), new Image()];
    this.scytheJumpImages[0].src = 'assets/player/Scythe Jump/0.png';
    this.scytheJumpImages[1].src = 'assets/player/Scythe Jump/1.png';
    this.scytheJumpImages[2].src = 'assets/player/Scythe Jump/2.png';
    this.scytheJumpImages[3].src = 'assets/player/Scythe Jump/3.png';
    
    // Sprite animation for scythe attack
    this.scytheAttackFrame = 0;
    this.scytheAttackFrameCounter = 0;
    this.scytheAttackImages = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
    this.scytheAttackImages[0].src = 'assets/player/Scythe Attack/0.png';
    this.scytheAttackImages[1].src = 'assets/player/Scythe Attack/1.png';
    this.scytheAttackImages[2].src = 'assets/player/Scythe Attack/2.png';
    this.scytheAttackImages[3].src = 'assets/player/Scythe Attack/3.png';
    this.scytheAttackImages[4].src = 'assets/player/Scythe Attack/4.png';
    this.scytheAttackImages[5].src = 'assets/player/Scythe Attack/5.png';
    
    // Sprite animation for shockwave idle (spellcaster weapon)
    this.shockwaveIdleFrame = 0;
    this.shockwaveIdleFrameCounter = 0;
    this.shockwaveIdleImages = [new Image(), new Image(), new Image(), new Image()];
    this.shockwaveIdleImages[0].src = 'assets/player/Shockwave Idle/0.png';
    this.shockwaveIdleImages[1].src = 'assets/player/Shockwave Idle/1.png';
    this.shockwaveIdleImages[2].src = 'assets/player/Shockwave Idle/2.png';
    this.shockwaveIdleImages[3].src = 'assets/player/Shockwave Idle/3.png';
    
    // Sprite animation for shockwave run (spellcaster weapon)
    this.shockwaveRunFrame = 0;
    this.shockwaveRunFrameCounter = 0;
    this.shockwaveRunImages = [new Image(), new Image(), new Image(), new Image()];
    this.shockwaveRunImages[0].src = 'assets/player/Shockwave Run/0.png';
    this.shockwaveRunImages[1].src = 'assets/player/Shockwave Run/1.png';
    this.shockwaveRunImages[2].src = 'assets/player/Shockwave Run/2.png';
    this.shockwaveRunImages[3].src = 'assets/player/Shockwave Run/3.png';
    
    // Sprite animation for shockwave jump (spellcaster weapon)
    this.shockwaveJumpFrame = 0;
    this.shockwaveJumpFrameCounter = 0;
    this.shockwaveJumpImages = [new Image(), new Image(), new Image(), new Image()];
    this.shockwaveJumpImages[0].src = 'assets/player/Shockwave Jump/0.png';
    this.shockwaveJumpImages[1].src = 'assets/player/Shockwave Jump/1.png';
    this.shockwaveJumpImages[2].src = 'assets/player/Shockwave Jump/2.png';
    this.shockwaveJumpImages[3].src = 'assets/player/Shockwave Jump/3.png';
    
    // Sprite animation for bow idle
    this.bowIdleFrame = 0;
    this.bowIdleFrameCounter = 0;
    this.bowIdleImages = [new Image(), new Image()];
    this.bowIdleImages[0].src = 'assets/player/Bow Idle/0.png';
    this.bowIdleImages[1].src = 'assets/player/Bow Idle/1.png';
    
    // Initialize attack animation frame counters
    this.bowAttackFrame = 0;
    this.bowAttackFrameCounter = 0;
    this.shockwaveAttackFrame = 0;
    this.shockwaveAttackFrameCounter = 0;
    
    // Sprite animation for bow run
    this.bowRunFrame = 0;
    this.bowRunFrameCounter = 0;
    this.bowRunImages = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
    this.bowRunImages[0].src = 'assets/player/Bow Run/0.png';
    this.bowRunImages[1].src = 'assets/player/Bow Run/1.png';
    this.bowRunImages[2].src = 'assets/player/Bow Run/2.png';
    this.bowRunImages[3].src = 'assets/player/Bow Run/3.png';
    this.bowRunImages[4].src = 'assets/player/Bow Run/4.png';
    this.bowRunImages[5].src = 'assets/player/Bow Run/5.png';
    
    // Sprite animation for bow jump
    this.bowJumpFrame = 0;
    this.bowJumpFrameCounter = 0;
    this.bowJumpImages = [new Image(), new Image(), new Image(), new Image()];
    this.bowJumpImages[0].src = 'assets/player/Bow Jump/0.png';
    this.bowJumpImages[1].src = 'assets/player/Bow Jump/1.png';
    this.bowJumpImages[2].src = 'assets/player/Bow Jump/2.png';
    this.bowJumpImages[3].src = 'assets/player/Bow Jump/3.png';
    
    // Sprite animation for bow attack (charging)
    this.bowAttackFrame = 0;
    this.bowAttackFrameCounter = 0;
    this.bowAttackImages = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
    this.bowAttackImages[0].src = 'assets/player/Bow Attack/0.png';
    this.bowAttackImages[1].src = 'assets/player/Bow Attack/1.png';
    this.bowAttackImages[2].src = 'assets/player/Bow Attack/2.png';
    this.bowAttackImages[3].src = 'assets/player/Bow Attack/3.png';
    this.bowAttackImages[4].src = 'assets/player/Bow Attack/4.png';
    this.bowAttackImages[5].src = 'assets/player/Bow Attack/5.png';
    this.bowAttackImages[6].src = 'assets/player/Bow Attack/6.png';
    
    // Sprite animation for shockwave attack (spellcaster casting)
    this.shockwaveAttackFrame = 0;
    this.shockwaveAttackFrameCounter = 0;
    this.shockwaveAttackImages = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
    this.shockwaveAttackImages[0].src = 'assets/player/Shockwave Attack/0.png';
    this.shockwaveAttackImages[1].src = 'assets/player/Shockwave Attack/1.png';
    this.shockwaveAttackImages[2].src = 'assets/player/Shockwave Attack/2.png';
    this.shockwaveAttackImages[3].src = 'assets/player/Shockwave Attack/3.png';
    this.shockwaveAttackImages[4].src = 'assets/player/Shockwave Attack/4.png';
    this.shockwaveAttackImages[5].src = 'assets/player/Shockwave Attack/5.png';
    this.shockwaveAttackImages[6].src = 'assets/player/Shockwave Attack/6.png';
  }
  
  findNearestPlatformBelow(platforms) {
    let nearestPlatform = null;
    let nearestDistance = Infinity;
    
    for (let platform of platforms) {
      // Check if platform is below player and within horizontal bounds
      if (platform.y > this.y + this.height && 
          platform.x < this.x + this.width && 
          platform.x + platform.width > this.x) {
        let distance = platform.y - (this.y + this.height);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestPlatform = platform;
        }
      }
    }
    
    return nearestPlatform;
  }
  
  releaseSpell(game) {
    if (!this.castingSpell) return null;
    
    let spellX = this.x + this.width / 2;
    let spellY = this.y + this.height / 2;
    let spell = null;
    let spellType = this.castingSpell;
    
    switch (spellType) {
      case 'fireball':
        spell = new Fireball(spellX, spellY, this.facing);
        break;
        
      case 'iceShard':
        spell = new IceShard(spellX, spellY, this.facing);
        break;
        
      case 'healingWave':
        spell = new HealingWave(spellX, spellY);
        this.healingStun = 60; // 1 second of being stationary
        break;
    }
    
    this.castingSpell = null;
    return { spell: spell, type: spellType };
  }
  
  createArrow() {
    if (!this.releaseArrow) return null;
    
    let arrowX = this.x + this.width / 2;
    let arrowY = this.y + this.height / 2;
    let chargePercent = Math.min(this.bowChargeTime / this.maxBowCharge, 1.0);
    
    let arrow = new Arrow(arrowX, arrowY, this.facing, chargePercent, this.bowAimHeight);
    
    this.releaseArrow = false;
    this.bowChargeTime = 0;
    return arrow;
  }
  
  update(input, platforms, hazards, enemies) {
    // Update healing stun
    if (this.healingStun > 0) {
      this.healingStun--;
    }
    
    // Movement (disabled during healing, casting, and slowed while bow charging)
    let moveSpeed = this.powerUp === 'speed' ? this.speed * 1.7 : this.speed;
    if (this.isChargingBow) {
      moveSpeed *= 0.3; // Move 30% speed while charging bow
    }
    
    if (this.healingStun <= 0 && !this.isCasting) {
      if (input.isDown('ArrowLeft') || input.isDown('KeyA')) {
        this.vx = -moveSpeed;
        this.facing = 'left';
      } else if (input.isDown('ArrowRight') || input.isDown('KeyD')) {
        this.vx = moveSpeed;
        this.facing = 'right';
      } else {
        this.vx = 0;
      }
      
      // Apply attack momentum if active
      if (this.attackMomentumTimer > 0) {
        this.vx = this.attackMomentum;
        this.attackMomentumTimer--;
      }
    } else {
      this.vx = 0; // Can't move while healing or casting
    }
    // Jump (energy-based, disabled while casting or bow charging)
    if ((input.isDown('ArrowUp') || input.isDown('KeyW')) && !this.isCasting && !this.isChargingBow) {
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
    // Attack / Bow Charging
    if (this.weapon === 'bow') {
      // Bow charging system
      if (input.isDown('Space') && !this.isChargingBow && this.attackCooldown <= 0 && this.ammo > 0) {
        this.isChargingBow = true;
        this.bowChargeTime = 0;
      }
      
      if (this.isChargingBow) {
        if (input.isDown('Space') && this.bowChargeTime < this.maxBowCharge) {
          this.bowChargeTime++;
        } else {
          // Release arrow
          this.releaseArrow = true;
          this.isChargingBow = false;
          this.attackCooldown = 35;
          this.ammo--;
          playSound('attack');
        }
      }
    } else if (this.weapon !== 'spellcaster') {
      // Normal weapon attack (exclude spellcaster - it uses Z/C/R keys instead)
      if (input.isDown('Space') && !this.isAttacking && this.attackCooldown <= 0 && this.ammo > 0) {
        this.isAttacking = true;
        this.attackCooldown = 35; // ~0.58s at 60fps
        this.attackAnimFrames = 30; // 0.5s at 60fps
        this.ammo--;
        this._attackHit = false;
        playSound('attack');
      }
    }
    
    // Bow aiming (F key for height adjustment)
    if (this.weapon === 'bow') {
      if (input.isDown('KeyF') && !this._aimPressed) {
        this.bowAimHeight += 0.2;
        if (this.bowAimHeight > this.maxAimHeight) this.bowAimHeight = -this.maxAimHeight;
        this._aimPressed = true;
      } else if (!input.isDown('KeyF')) {
        this._aimPressed = false;
      }
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
    // Power-up cooldown decrement
    if (this.powerUpCooldown > 0) {
      this.powerUpCooldown--;
    }
    // Spell cooldown decrement
    if (this.spellCooldown > 0) {
      this.spellCooldown--;
    }
    // Healing cooldown decrement
    if (this.healingCooldown > 0) {
      this.healingCooldown--;
    }
    
    // Handle casting system
    if (this.isCasting) {
      this.castingTimer++;
      
      // Ground attraction - move quickly towards nearest platform below
      let nearestPlatform = this.findNearestPlatformBelow(platforms);
      if (nearestPlatform) {
        let targetY = nearestPlatform.y - this.height;
        let distanceToGround = targetY - this.y;
        
        if (distanceToGround > 5) {
          // Move quickly towards ground (faster than normal gravity)
          this.vy = Math.min(this.vy + 2, 15); // Accelerated downward movement
        } else {
          // Snap to ground and stop vertical movement
          this.y = targetY;
          this.vy = 0;
          this.onGround = true;
        }
      }
      
      // Stop horizontal movement while casting
      this.vx = 0;
      
      // Check if casting is complete
      if (this.castingTimer >= this.castingDuration) {
        this.completeCasting = true; // Flag to trigger spell release after this frame
        this.isCasting = false;
        this.castingTimer = 0;
      }
    }
  }
  draw(ctx) {
    ctx.save();
    let img;
    
    // Determine which animation to use based on weapon and state
    if (this.weapon === 'scythe') {
      if (this.isAttacking) {
        // Use scythe attack animation when attacking with scythe
        this.scytheAttackFrameCounter++;
        if (this.scytheAttackFrameCounter > 8) { // Change frame every 8 frames for attack animation
          this.scytheAttackFrame = (this.scytheAttackFrame + 1) % 6;
          this.scytheAttackFrameCounter = 0;
        }
        img = this.scytheAttackImages[this.scytheAttackFrame];
        // Reset other animations
        this.scytheIdleFrameCounter = 0;
        this.scytheIdleFrame = 0;
        this.scytheRunFrameCounter = 0;
        this.scytheRunFrame = 0;
        this.scytheJumpFrameCounter = 0;
        this.scytheJumpFrame = 0;
        this.idleFrameCounter = 0;
        this.jumpFrameCounter = 0;
        this.shockwaveIdleFrameCounter = 0;
        this.shockwaveRunFrameCounter = 0;
        this.shockwaveJumpFrameCounter = 0;
        this.attackFrameCounter = 0;
        this.attackFrame = 0;
        this.bowIdleFrameCounter = 0;
        this.bowRunFrameCounter = 0;
        this.bowJumpFrameCounter = 0;
      } else if (!this.onGround) {
        // Use scythe jump animation when jumping with scythe
        this.scytheJumpFrameCounter++;
        if (this.scytheJumpFrameCounter > 12) { // Change frame every 12 frames (0.2s at 60fps)
          this.scytheJumpFrame = (this.scytheJumpFrame + 1) % 4;
          this.scytheJumpFrameCounter = 0;
        }
        img = this.scytheJumpImages[this.scytheJumpFrame];
        // Reset other animations
        this.scytheIdleFrameCounter = 0;
        this.scytheIdleFrame = 0;
        this.scytheRunFrameCounter = 0;
        this.scytheRunFrame = 0;
        this.idleFrameCounter = 0;
        this.jumpFrameCounter = 0;
        this.shockwaveIdleFrameCounter = 0;
        this.shockwaveRunFrameCounter = 0;
        this.shockwaveJumpFrameCounter = 0;
        this.attackFrameCounter = 0;
        this.attackFrame = 0;
        this.bowIdleFrameCounter = 0;
        this.bowRunFrameCounter = 0;
        this.bowJumpFrameCounter = 0;
      } else if (this.vx === 0 && this.onGround && !this.isAttacking) {
        // Use scythe idle animation when standing still with scythe
        this.scytheIdleFrameCounter++;
        if (this.scytheIdleFrameCounter > 20) { // Change frame every 20 frames
          this.scytheIdleFrame = (this.scytheIdleFrame + 1) % 4;
          this.scytheIdleFrameCounter = 0;
        }
        img = this.scytheIdleImages[this.scytheIdleFrame];
        // Reset other animations
        this.scytheRunFrameCounter = 0;
        this.scytheRunFrame = 0;
        this.scytheJumpFrameCounter = 0;
        this.scytheJumpFrame = 0;
        this.idleFrameCounter = 0;
        this.jumpFrameCounter = 0;
        this.shockwaveIdleFrameCounter = 0;
        this.shockwaveRunFrameCounter = 0;
        this.shockwaveJumpFrameCounter = 0;
        this.attackFrameCounter = 0;
        this.attackFrame = 0;
        this.bowIdleFrameCounter = 0;
        this.bowRunFrameCounter = 0;
        this.bowJumpFrameCounter = 0;
      } else {
        // Use scythe run animation when moving/running with scythe
        this.scytheRunFrameCounter++;
        if (this.scytheRunFrameCounter > 10) { // Change frame every 10 frames for running animation
          this.scytheRunFrame = (this.scytheRunFrame + 1) % 4;
          this.scytheRunFrameCounter = 0;
        }
        img = this.scytheRunImages[this.scytheRunFrame];
        // Reset other animations
        this.scytheIdleFrameCounter = 0;
        this.scytheIdleFrame = 0;
        this.scytheJumpFrameCounter = 0;
        this.scytheJumpFrame = 0;
        this.idleFrameCounter = 0;
        this.jumpFrameCounter = 0;
        this.shockwaveIdleFrameCounter = 0;
        this.shockwaveRunFrameCounter = 0;
        this.shockwaveJumpFrameCounter = 0;
        this.attackFrameCounter = 0;
        this.attackFrame = 0;
        this.bowIdleFrameCounter = 0;
        this.bowRunFrameCounter = 0;
        this.bowJumpFrameCounter = 0;
      }
    } else if (this.weapon === 'spellcaster') {
      // Spellcaster weapon uses shockwave animations
      if (this.isCasting) {
        // Use shockwave attack animation when casting spells
        this.shockwaveAttackFrameCounter++;
        if (this.shockwaveAttackFrameCounter > 8) { // Change frame every 8 frames for attack animation
          if (this.shockwaveAttackFrame < 6) { // Only advance if not at last frame
            this.shockwaveAttackFrame++;
          }
          this.shockwaveAttackFrameCounter = 0;
        }
        img = this.shockwaveAttackImages[this.shockwaveAttackFrame];
        // Reset other animations
        this.shockwaveIdleFrameCounter = 0;
        this.shockwaveIdleFrame = 0;
        this.shockwaveRunFrameCounter = 0;
        this.shockwaveRunFrame = 0;
        this.shockwaveJumpFrameCounter = 0;
        this.idleFrameCounter = 0;
        this.attackFrameCounter = 0;
        this.attackFrame = 0;
        this.bowIdleFrameCounter = 0;
        this.bowRunFrameCounter = 0;
        this.bowJumpFrameCounter = 0;
        this.bowAttackFrameCounter = 0;
        this.bowAttackFrame = 0;
        this.shockwaveAttackFrameCounter = 0;
        this.shockwaveAttackFrame = 0;
      } else if (!this.onGround) {
        // Use shockwave jump animation when jumping with spellcaster
        this.shockwaveJumpFrameCounter++;
        if (this.shockwaveJumpFrameCounter > 12) { // Change frame every 12 frames (0.2s at 60fps)
          this.shockwaveJumpFrame = (this.shockwaveJumpFrame + 1) % 4;
          this.shockwaveJumpFrameCounter = 0;
        }
        img = this.shockwaveJumpImages[this.shockwaveJumpFrame];
        // Reset other animations
        this.shockwaveIdleFrameCounter = 0;
        this.shockwaveIdleFrame = 0;
        this.shockwaveRunFrameCounter = 0;
        this.shockwaveRunFrame = 0;
        this.idleFrameCounter = 0;
        this.attackFrameCounter = 0;
        this.attackFrame = 0;
        this.bowIdleFrameCounter = 0;
        this.bowRunFrameCounter = 0;
        this.bowJumpFrameCounter = 0;
      } else if (this.vx === 0 && this.onGround && !this.isAttacking) {
        // Use shockwave idle animation when standing still with spellcaster
        this.shockwaveIdleFrameCounter++;
        if (this.shockwaveIdleFrameCounter > 12) { // Change frame every 12 frames (0.2s at 60fps)
          this.shockwaveIdleFrame = (this.shockwaveIdleFrame + 1) % 4;
          this.shockwaveIdleFrameCounter = 0;
        }
        img = this.shockwaveIdleImages[this.shockwaveIdleFrame];
        // Reset other animations
        this.shockwaveRunFrameCounter = 0;
        this.shockwaveRunFrame = 0;
        this.shockwaveJumpFrameCounter = 0;
        this.idleFrameCounter = 0;
        this.jumpFrameCounter = 0;
        this.attackFrameCounter = 0;
        this.attackFrame = 0;
        this.bowIdleFrameCounter = 0;
        this.bowRunFrameCounter = 0;
        this.bowJumpFrameCounter = 0;
      } else {
        // Use shockwave run animation when moving/running with spellcaster
        this.shockwaveRunFrameCounter++;
        if (this.shockwaveRunFrameCounter > 12) { // Change frame every 12 frames (0.2s at 60fps)
          this.shockwaveRunFrame = (this.shockwaveRunFrame + 1) % 4;
          this.shockwaveRunFrameCounter = 0;
        }
        img = this.shockwaveRunImages[this.shockwaveRunFrame];
        // Reset other animations
        this.shockwaveIdleFrameCounter = 0;
        this.shockwaveIdleFrame = 0;
        this.shockwaveJumpFrameCounter = 0;
        this.idleFrameCounter = 0;
        this.jumpFrameCounter = 0;
        this.attackFrameCounter = 0;
        this.attackFrame = 0;
        this.bowIdleFrameCounter = 0;
        this.bowRunFrameCounter = 0;
        this.bowJumpFrameCounter = 0;
      }
    } else if (this.weapon === 'bow') {
      // Bow weapon uses bow animations
      if (this.isChargingBow) {
        // Use bow attack animation when charging bow
        this.bowAttackFrameCounter++;
        if (this.bowAttackFrameCounter > 8) { // Change frame every 8 frames for attack animation
          this.bowAttackFrame = (this.bowAttackFrame + 1) % 7;
          this.bowAttackFrameCounter = 0;
        }
        img = this.bowAttackImages[this.bowAttackFrame];
        // Reset other animations
        this.bowIdleFrameCounter = 0;
        this.bowIdleFrame = 0;
        this.bowRunFrameCounter = 0;
        this.bowRunFrame = 0;
        this.bowJumpFrameCounter = 0;
        this.idleFrameCounter = 0;
        this.attackFrameCounter = 0;
        this.attackFrame = 0;
      } else if (!this.onGround) {
        // Use bow jump animation when jumping with bow
        this.bowJumpFrameCounter++;
        if (this.bowJumpFrameCounter > 12) { // Change frame every 12 frames (0.2s at 60fps)
          this.bowJumpFrame = (this.bowJumpFrame + 1) % 4;
          this.bowJumpFrameCounter = 0;
        }
        img = this.bowJumpImages[this.bowJumpFrame];
        // Reset other animations
        this.bowIdleFrameCounter = 0;
        this.bowIdleFrame = 0;
        this.bowRunFrameCounter = 0;
        this.bowRunFrame = 0;
        this.idleFrameCounter = 0;
        this.attackFrameCounter = 0;
        this.attackFrame = 0;
        this.scytheIdleFrameCounter = 0;
        this.scytheRunFrameCounter = 0;
        this.scytheJumpFrameCounter = 0;
      } else if (this.vx === 0 && this.onGround && !this.isAttacking) {
        // Use bow idle animation when standing still with bow
        this.bowIdleFrameCounter++;
        if (this.bowIdleFrameCounter > 12) { // Change frame every 12 frames (0.2s at 60fps)
          this.bowIdleFrame = (this.bowIdleFrame + 1) % 2;
          this.bowIdleFrameCounter = 0;
        }
        img = this.bowIdleImages[this.bowIdleFrame];
        // Reset other animations
        this.bowRunFrameCounter = 0;
        this.bowRunFrame = 0;
        this.bowJumpFrameCounter = 0;
        this.idleFrameCounter = 0;
        this.jumpFrameCounter = 0;
        this.attackFrameCounter = 0;
        this.attackFrame = 0;
        this.scytheIdleFrameCounter = 0;
        this.scytheRunFrameCounter = 0;
        this.scytheJumpFrameCounter = 0;
      } else {
        // Use bow run animation when moving/running with bow
        this.bowRunFrameCounter++;
        if (this.bowRunFrameCounter > 12) { // Change frame every 12 frames (0.2s at 60fps)
          this.bowRunFrame = (this.bowRunFrame + 1) % 6;
          this.bowRunFrameCounter = 0;
        }
        img = this.bowRunImages[this.bowRunFrame];
        // Reset other animations
        this.bowIdleFrameCounter = 0;
        this.bowIdleFrame = 0;
        this.bowJumpFrameCounter = 0;
        this.idleFrameCounter = 0;
        this.jumpFrameCounter = 0;
        this.attackFrameCounter = 0;
        this.attackFrame = 0;
      }
    } else {
      // Normal weapon animations (sword, bow, etc.)
      if (this.isAttacking) {
        // Use normal attack animation when attacking
        this.attackFrameCounter++;
        if (this.attackFrameCounter > 12) { // Change frame every 12 frames (0.2s at 60fps)
          this.attackFrame = (this.attackFrame + 1) % 3;
          this.attackFrameCounter = 0;
        }
        img = this.attackImages[this.attackFrame];
        // Reset other animations
        this.idleFrameCounter = 0;
        this.idleFrame = 0;
        this.jumpFrameCounter = 0;
        this.jumpFrame = 0;
        this.runFrameCounter = 0;
        this.runFrame = 0;
        this.scytheIdleFrameCounter = 0;
        this.scytheRunFrameCounter = 0;
        this.shockwaveIdleFrameCounter = 0;
        this.shockwaveRunFrameCounter = 0;
        this.shockwaveJumpFrameCounter = 0;
      } else if (!this.onGround) {
        // Jump animation when in the air
        this.jumpFrameCounter++;
        if (this.jumpFrameCounter > 8) { // Change frame every 8 frames for faster jump animation
          this.jumpFrame = (this.jumpFrame + 1) % 4;
          this.jumpFrameCounter = 0;
        }
        img = this.jumpImages[this.jumpFrame];
        // Reset other animations
        this.idleFrameCounter = 0;
        this.idleFrame = 0;
        this.scytheIdleFrameCounter = 0;
        this.scytheRunFrameCounter = 0;
        this.shockwaveIdleFrameCounter = 0;
        this.shockwaveRunFrameCounter = 0;
        this.shockwaveJumpFrameCounter = 0;
        this.attackFrameCounter = 0;
        this.attackFrame = 0;
      } else if (this.vx === 0 && this.onGround && !this.isAttacking) {
        // Idle animation when standing still
        this.idleFrameCounter++;
        if (this.idleFrameCounter > 30) { // Change frame every 30 frames (~0.5s at 60fps)
          this.idleFrame = (this.idleFrame + 1) % 2;
          this.idleFrameCounter = 0;
        }
        img = this.idleImages[this.idleFrame];
        // Reset other animations
        this.jumpFrameCounter = 0;
        this.jumpFrame = 0;
        this.runFrameCounter = 0;
        this.runFrame = 0;
        this.scytheIdleFrameCounter = 0;
        this.scytheRunFrameCounter = 0;
        this.shockwaveIdleFrameCounter = 0;
        this.shockwaveRunFrameCounter = 0;
        this.shockwaveJumpFrameCounter = 0;
        this.attackFrameCounter = 0;
        this.attackFrame = 0;
      } else {
        // Normal run animation when moving on ground with non-scythe weapons
        this.runFrameCounter++;
        if (this.runFrameCounter > 12) { // Change frame every 12 frames (0.2s at 60fps)
          this.runFrame = (this.runFrame + 1) % 6;
          this.runFrameCounter = 0;
        }
        img = this.runImages[this.runFrame];
        // Reset other animations
        this.idleFrameCounter = 0;
        this.jumpFrameCounter = 0;
        this.idleFrame = 0;
        this.jumpFrame = 0;
        this.scytheIdleFrameCounter = 0;
        this.scytheRunFrameCounter = 0;
        this.scytheIdleFrame = 0;
        this.scytheRunFrame = 0;
        this.shockwaveIdleFrameCounter = 0;
        this.shockwaveRunFrameCounter = 0;
        this.shockwaveJumpFrameCounter = 0;
        this.attackFrameCounter = 0;
        this.attackFrame = 0;
      }
    }
    
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = false;
      
      // Handle sprite flipping based on facing direction
      if (this.facing === 'left') {
        // Flip horizontally for left-facing
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(img, -(this.x + this.width), this.y, 32, 48);
        ctx.restore();
      } else {
        // Draw normally for right-facing
        ctx.drawImage(img, this.x, this.y, 32, 48);
      }
    }
    // Cosmetic effect
    if (this.cosmetic === 'glow') {
      ctx.shadowColor = '#ff0';
      ctx.shadowBlur = 16;
    }
    // Weapon placeholder
    if (this.attackAnimFrames > 0) {
      ctx.fillStyle = '#fff';
      let offsetX = this.facing === 'right' ? this.x + this.width : this.x - 16;
      let offsetAxe = this.facing === 'right' ? this.x + this.width : this.x - 20;
      let offsetSpear = this.facing === 'right' ? this.x + this.width : this.x - 24;
      let offsetBow = this.facing === 'right' ? this.x + this.width : this.x - 16;
      // Sword placeholder removed - Normal Attack animation already shows sword
      // Scythe placeholder removed - Scythe Attack animation already shows scythe
      if (this.weapon === 'axe') ctx.fillRect(offsetAxe, this.y + 12, 20, 12);
      if (this.weapon === 'spear') ctx.fillRect(offsetSpear, this.y + 20, 24, 4);
      if (this.weapon === 'bow') ctx.fillRect(offsetBow, this.y + 24, 16, 4);
    }
    
    // Bow charging and aiming indicator
    if (this.weapon === 'bow' && this.isChargingBow) {
      let chargePercent = Math.min(this.bowChargeTime / this.maxBowCharge, 1.0);
      
      // Charge bar
      ctx.fillStyle = '#444';
      ctx.fillRect(this.x - 5, this.y - 20, 42, 6);
      ctx.fillStyle = chargePercent < 0.5 ? '#ff0' : chargePercent < 0.8 ? '#fa0' : '#0f0';
      ctx.fillRect(this.x - 4, this.y - 19, 40 * chargePercent, 4);
      
      // Aim trajectory preview
      let baseSpeed = 3 + (chargePercent * 12);
      let angle = -0.3 + (this.bowAimHeight * 0.8);
      let vx = (this.facing === 'right' ? 1 : -1) * baseSpeed * Math.cos(angle);
      let vy = baseSpeed * Math.sin(angle);
      
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      
      let x = this.x + this.width/2;
      let y = this.y + this.height/2;
      ctx.moveTo(x, y);
      
      // Draw trajectory arc (simplified)
      for (let t = 1; t <= 20; t++) {
        x += vx * 2;
        y += vy * 2 + (0.3 * t * 2); // gravity effect
        ctx.lineTo(x, y);
        if (x < 0 || x > 800 || y > 600) break;
      }
      ctx.stroke();
      ctx.globalAlpha = 1.0;
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
    // Restore energy on heart sacrifice
    this.energy = this.maxEnergy;
    playSound('powerup');
  }
  endPowerUp() {
    if (this.powerUp === 'shield') this.invincible = false;
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
    this.frozen = 0; // For ice shard spell
  }
  update(player, platforms, ladders) {
    if (this.stunned > 0) {
      this.stunned--;
      return;
    }
    if (this.frozen > 0) {
      this.frozen--;
      return; // Can't move while frozen
    }
    if (this.knockback > 0) {
      this.x += 4;
      this.knockback--;
      return;
    }
    // Simple AI: move toward player
    if (player.x < this.x) this.x -= this.vx;
    else if (player.x > this.x) this.x += this.vx;

    // Random jump logic (reduced jump height)
    if (this.jumpCooldown > 0) {
      this.jumpCooldown--;
    } else if (this.onGround) {
      this.vy = -5; // Reduced from -10 to make enemies jump lower
      this.onGround = false;
      this.jumpCooldown = randInt(60, 180); // next jump in 1-3 seconds
    }

    // Gravity
    this.vy += 0.5;
    this.y += this.vy;
    
    // Ground collision - land on the light gray platform
    this.onGround = false;
    if (this.y + this.height > 550) { // Ground platform is at y=550
      this.y = 550 - this.height;
      this.vy = 0;
      this.onGround = true;
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
    // Ice crystals if frozen
    if (this.frozen > 0) {
      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = '#88ddff';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      
      // Draw ice overlay on enemy
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      
      // Draw ice crystals around enemy
      for (let i = 0; i < 6; i++) {
        let angle = (Math.PI * 2 * i) / 6;
        let cx = this.x + this.width / 2 + Math.cos(angle) * 20;
        let cy = this.y + this.height / 2 + Math.sin(angle) * 20;
        
        ctx.strokeStyle = '#00ccff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - 4, cy);
        ctx.lineTo(cx + 4, cy);
        ctx.moveTo(cx, cy - 4);
        ctx.lineTo(cx, cy + 4);
        ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();
  }
  collides(obj) {
    return this.x < obj.x + obj.width && this.x + this.width > obj.x &&
           this.y < obj.y + obj.height && this.y + this.height > obj.y;
  }
  attackedBy(player) {
    // Attack hitbox based on facing (spellcaster has no melee attack)
    if (!player.isAttacking || player.weapon === 'spellcaster') return false;
    let hitbox = {
      x: player.facing === 'right' ? player.x + player.width : player.x - (player.weapon === 'scythe' ? 72 : 40),
      y: player.weapon === 'scythe' ? player.y + 4 : player.y + 12,
      width: player.weapon === 'scythe' ? 72 : player.weapon === 'sword' ? 32 : player.weapon === 'axe' ? 20 : player.weapon === 'spear' ? 24 : 16,
      height: player.weapon === 'scythe' ? 32 : player.weapon === 'sword' ? 24 : player.weapon === 'axe' ? 24 : player.weapon === 'spear' ? 8 : 8
    };
    return this.x < hitbox.x + hitbox.width && this.x + this.width > hitbox.x &&
      this.y < hitbox.y + hitbox.height && this.y + this.height > hitbox.y;
  }
  takeDamage(amount) {
    // Don't take damage while frozen
    if (this.frozen > 0) return;
    
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
    
    // Ground collision - land on the light gray platform
    this.onGround = false;
    if (this.y + this.height > 550) { // Ground platform is at y=550
      this.y = 550 - this.height;
      this.vy = 0;
      this.onGround = true;
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
        let spawnY = 600 - 32; // Spawn on ground level
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

// --- SuperBoss Class (Level 4) ---
class SuperBoss extends BossEnemy {
  constructor(x, y) {
    super(x, y);
    this.width = 120;
    this.height = 120;
    this.color = '#8A2BE2'; // Blue violet
    this.health = 50;
    this.maxHealth = 50;
    
    // Attack patterns and timers
    this.asteroidCooldown = 0;
    this.asteroidAttackRate = 240; // 4 seconds
    this.laserCooldown = 0;
    this.laserAttackRate = 180; // 3 seconds
    this.minionCooldown = 0;
    this.minionSpawnRate = 300; // 5 seconds
    
    // Attack pattern cycling
    this.attackPattern = 0; // 0: asteroids, 1: lasers, 2: minions
    this.patternTimer = 0;
    this.patternDuration = 360; // 6 seconds per pattern
  }
  
  update(player, platforms, ladders, game) {
    if (this.stunned > 0) {
      this.stunned--;
      return;
    }
    
    // Don't attack if dead
    if (this.isDead()) {
      return;
    }
    
    // Movement - slower and more deliberate
    if (player.x < this.x) this.x -= 0.5;
    else if (player.x > this.x) this.x += 0.5;
    
    // Gravity
    this.vy += 0.4;
    this.y += this.vy;
    
    // Platform collision
    for (let platform of platforms) {
      if (this.x < platform.x + platform.width && this.x + this.width > platform.x &&
          this.y < platform.y + platform.height && this.y + this.height > platform.y) {
        if (this.vy > 0 && this.y < platform.y) {
          this.y = platform.y - this.height;
          this.vy = 0;
        }
      }
    }
    
    // Update attack pattern
    this.patternTimer++;
    if (this.patternTimer >= this.patternDuration) {
      this.attackPattern = (this.attackPattern + 1) % 3;
      this.patternTimer = 0;
    }
    
    // Execute attacks based on current pattern
    switch (this.attackPattern) {
      case 0: // Asteroid attacks
        this.asteroidCooldown--;
        if (this.asteroidCooldown <= 0) {
          this.summonAsteroid(player, game);
          this.asteroidCooldown = this.asteroidAttackRate;
        }
        break;
        
      case 1: // Laser attacks
        this.laserCooldown--;
        if (this.laserCooldown <= 0) {
          this.fireLaser(game);
          this.laserCooldown = this.laserAttackRate;
        }
        break;
        
      case 2: // Minion spawning
        this.minionCooldown--;
        if (this.minionCooldown <= 0) {
          this.spawnMinion(game);
          this.minionCooldown = this.minionSpawnRate;
        }
        break;
    }
    
    // Take damage from player
    if (this.attackedBy(player) && !player._attackHit) {
      let dmg = player.powerUp === 'damage' ? 3 : 2;
      this.takeDamage(dmg);
      player._attackHit = true;
    }
  }
  
  summonAsteroid(player, game) {
    // Create asteroid aimed at player's current position
    let asteroid = new Asteroid(this.x + this.width/2, player.x, player.y);
    game.asteroids.push(asteroid);
  }
  
  fireLaser(game) {
    // Fire random scanning laser
    let direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
    let x = direction === 'horizontal' ? -50 : Math.random() * 750;
    let y = direction === 'horizontal' ? Math.random() * 550 : -50;
    
    let laser = new Laser(x, y, direction);
    game.lasers.push(laser);
  }
  
  spawnMinion(game) {
    // Spawn weaker enemy near the boss
    let minionX = this.x + (Math.random() < 0.5 ? -60 : this.width + 20);
    let minionY = this.y;
    
    let minion = new Enemy(minionX, minionY);
    minion.health = 2; // Weaker than normal enemies
    minion.color = '#9370DB'; // Medium slate blue (related to boss color)
    game.enemies.push(minion);
  }
  
  draw(ctx) {
    ctx.save();
    
    // Pulsing effect based on health
    let healthPercent = this.health / this.maxHealth;
    let pulse = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
    ctx.globalAlpha = healthPercent * pulse;
    
    // Draw boss body with gradient effect
    let gradient = ctx.createRadialGradient(
      this.x + this.width/2, this.y + this.height/2, 0,
      this.x + this.width/2, this.y + this.height/2, this.width/2
    );
    gradient.addColorStop(0, '#9932CC'); // Dark orchid
    gradient.addColorStop(1, this.color);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Attack pattern indicator
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px "Press Start 2P"';
    let patternText = ['ASTEROID', 'LASER', 'MINION'][this.attackPattern];
    ctx.fillText(patternText, this.x, this.y - 10);
    
    // Health bar
    let healthBarWidth = this.width;
    let healthBarHeight = 8;
    let healthBarY = this.y - 20;
    
    ctx.fillStyle = '#222';
    ctx.fillRect(this.x, healthBarY, healthBarWidth, healthBarHeight);
    ctx.fillStyle = healthPercent > 0.5 ? '#0f0' : healthPercent > 0.25 ? '#ff0' : '#f00';
    ctx.fillRect(this.x, healthBarY, healthBarWidth * healthPercent, healthBarHeight);
    
    // Stunned sparkles
    if (this.stunned > 0) {
      for (let i = 0; i < 20; i++) {
        let angle = (Math.PI * 2 * i) / 20;
        let sx = this.x + this.width / 2 + Math.cos(angle) * 60;
        let sy = this.y + this.height / 2 + Math.sin(angle) * 60;
        ctx.save();
        ctx.globalAlpha = 0.8 * (this.stunned / 30);
        ctx.fillStyle = ['#fff', '#ff0', '#0ff', '#f0f', '#8A2BE2'][i % 5];
        ctx.beginPath();
        ctx.arc(sx, sy, 6 + Math.random() * 4, 0, Math.PI * 2);
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

// --- Spell Classes ---
class Fireball {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 16;
    this.speed = 8;
    // Set velocity based on direction ('left' or 'right')
    this.vx = direction === 'right' ? this.speed : -this.speed;
    this.vy = 0; // Travel horizontally
    this.lifetime = 300; // 5 seconds at 60fps
    this.exploded = false;
    this.hasHitEnemy = false; // Track if it has hit an enemy
  }
  
  update(platforms, enemies, player) {
    if (this.exploded || this.hasHitEnemy) return null;
    
    this.x += this.vx;
    this.y += this.vy;
    this.lifetime--;
    
    // Check collision with platforms - explode on wall hit
    for (let p of platforms) {
      if (this.collides(p)) {
        return this.explode(enemies, player);
      }
    }
    
    // Check collision with enemies - hit only one enemy with direct damage
    for (let enemy of enemies) {
      if (this.collides(enemy)) {
        enemy.takeDamage(2); // Direct damage, single target
        this.hasHitEnemy = true;
        this.exploded = true;
        return null;
      }
    }
    
    // Check bounds - explode when hitting screen boundaries
    if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 600 || this.lifetime <= 0) {
      return this.explode(enemies, player);
    }
    
    return null;
  }
  
  explode(enemies, player) {
    this.exploded = true;
    
    // Small area damage when hitting walls - affects all entities within explosion radius
    const explosionRadius = 40; // Smaller radius than before
    const explosionDamage = 1; // Lower damage than direct hit
    
    // Damage all enemies within radius
    for (let enemy of enemies) {
      let dx = enemy.x + enemy.width/2 - (this.x + this.width/2);
      let dy = enemy.y + enemy.height/2 - (this.y + this.height/2);
      let distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= explosionRadius) {
        enemy.takeDamage(explosionDamage);
        // Add visual feedback for explosion hit
        enemy.stunned = Math.max(enemy.stunned, 10); // 0.17 seconds
      }
    }
    
    // Also damage player if they're too close (friendly fire)
    let playerDx = player.x + player.width/2 - (this.x + this.width/2);
    let playerDy = player.y + player.height/2 - (this.y + this.height/2);
    let playerDistance = Math.sqrt(playerDx * playerDx + playerDy * playerDy);
    
    if (playerDistance <= explosionRadius) {
      player.takeDamage(1); // Light damage to player
    }
    
    // Return explosion effect for visual display
    return new Explosion(this.x + this.width/2, this.y + this.height/2);
  }
  
  collides(obj) {
    return this.x < obj.x + obj.width &&
           this.x + this.width > obj.x &&
           this.y < obj.y + obj.height &&
           this.y + this.height > obj.y;
  }
  
  draw(ctx) {
    if (this.exploded) return;
    
    ctx.save();
    ctx.fillStyle = '#ff4400';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 10;
    
    // Draw fireball with flame effect
    ctx.beginPath();
    ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner bright core
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  
  isDone() {
    return this.exploded;
  }
}

class IceShard {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.width = 12;
    this.height = 12;
    this.speed = 10;
    // Set velocity based on direction ('left' or 'right')
    this.vx = direction === 'right' ? this.speed : -this.speed;
    this.vy = 0; // Travel horizontally
    this.lifetime = 240; // 4 seconds at 60fps
    this.broken = false;
  }
  
  update(platforms, enemies, player) {
    if (this.broken) return;
    
    this.x += this.vx;
    this.y += this.vy;
    this.lifetime--;
    
    // Check collision with platforms - breaks on contact
    for (let p of platforms) {
      if (this.collides(p)) {
        this.break();
        return;
      }
    }
    
    // Check collision with enemies - freezes them
    for (let enemy of enemies) {
      if (this.collides(enemy)) {
        enemy.frozen = 120; // 2 seconds at 60fps
        this.break();
        return;
      }
    }
    
    // Check bounds
    if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 600 || this.lifetime <= 0) {
      this.break();
    }
  }
  
  break() {
    this.broken = true;
    playSound('ice_break');
  }
  
  collides(obj) {
    return this.x < obj.x + obj.width &&
           this.x + this.width > obj.x &&
           this.y < obj.y + obj.height &&
           this.y + this.height > obj.y;
  }
  
  draw(ctx) {
    if (this.broken) return;
    
    ctx.save();
    ctx.fillStyle = '#00ccff';
    ctx.shadowColor = '#0088cc';
    ctx.shadowBlur = 8;
    
    // Draw ice shard as diamond shape
    ctx.beginPath();
    ctx.moveTo(this.x + this.width/2, this.y);
    ctx.lineTo(this.x + this.width, this.y + this.height/2);
    ctx.lineTo(this.x + this.width/2, this.y + this.height);
    ctx.lineTo(this.x, this.y + this.height/2);
    ctx.closePath();
    ctx.fill();
    
    // Inner bright core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(this.x + this.width/2, this.y + this.height/4);
    ctx.lineTo(this.x + 3*this.width/4, this.y + this.height/2);
    ctx.lineTo(this.x + this.width/2, this.y + 3*this.height/4);
    ctx.lineTo(this.x + this.width/4, this.y + this.height/2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  
  isDone() {
    return this.broken;
  }
}

class HealingWave {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = 120;
    this.duration = 60; // 1 second at 60fps
    this.frame = 0;
    this.healed = new Set(); // Track what we've already healed
  }
  
  update(enemies, player) {
    this.frame++;
    this.radius = (this.frame / this.duration) * this.maxRadius;
    
    // Heal nearby entities (only once per wave)
    const healAmount = randInt(1, 5);
    
    // Heal player if nearby and not already healed
    if (!this.healed.has('player')) {
      let distToPlayer = Math.sqrt((player.x - this.x) ** 2 + (player.y - this.y) ** 2);
      if (distToPlayer <= this.radius) {
        player.hearts = Math.min(player.hearts + healAmount, player.maxHearts);
        this.healed.add('player');
        playSound('heal');
      }
    }
    
    // Heal nearby enemies
    enemies.forEach((enemy, index) => {
      if (!this.healed.has(`enemy_${index}`)) {
        let distToEnemy = Math.sqrt((enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2);
        if (distToEnemy <= this.radius) {
          enemy.health = Math.min(enemy.health + healAmount, 3);
          this.healed.add(`enemy_${index}`);
        }
      }
    });
  }
  
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = 0.6 * (1 - this.frame / this.duration);
    
    // Draw healing wave as expanding green circles
    let gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    gradient.addColorStop(0, '#00ff00');
    gradient.addColorStop(0.5, '#88ff88');
    gradient.addColorStop(1, 'transparent');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner healing sparkles
    ctx.fillStyle = '#00ff00';
    for (let i = 0; i < 8; i++) {
      let angle = (i / 8) * Math.PI * 2 + (this.frame * 0.1);
      let sparkleRadius = this.radius * 0.7;
      let sparkleX = this.x + Math.cos(angle) * sparkleRadius;
      let sparkleY = this.y + Math.sin(angle) * sparkleRadius;
      ctx.beginPath();
      ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
  
  isDone() {
    return this.frame >= this.duration;
  }
}

class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = 60;
    this.duration = 20; // Short explosion animation
    this.frame = 0;
  }
  
  update() {
    this.frame++;
    this.radius = (this.frame / this.duration) * this.maxRadius;
  }
  
  draw(ctx) {
    if (this.frame >= this.duration) return;
    
    ctx.save();
    let alpha = 0.8 * (1 - this.frame / this.duration);
    ctx.globalAlpha = alpha;
    
    // Draw expanding explosion circles
    let gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.3, '#ffff00');
    gradient.addColorStop(0.6, '#ff4400');
    gradient.addColorStop(1, '#ff0000');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Outer shockwave ring
    ctx.strokeStyle = '#ff8800';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
  }
  
  isDone() {
    return this.frame >= this.duration;
  }
}

class Arrow {
  constructor(x, y, direction, charge, aimHeight) {
    this.x = x;
    this.y = y;
    this.width = 8;
    this.height = 3;
    this.damage = Math.floor(charge * 5); // 0-5 damage based on charge
    
    // Calculate trajectory based on charge and aim height
    let chargePercent = charge; // 0 to 1
    let baseSpeed = 3 + (chargePercent * 12); // 3-15 speed
    let angle = -0.3 + (aimHeight * 0.8); // Angle from -1.1 to 0.5 radians
    
    this.vx = (direction === 'right' ? 1 : -1) * baseSpeed * Math.cos(angle);
    this.vy = baseSpeed * Math.sin(angle);
    this.gravity = 0.3;
    this.lifetime = 600; // 10 seconds max
    this.stuck = false;
  }
  
  update(platforms, enemies, player) {
    if (this.stuck) return;
    
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity; // Parabolic trajectory
    this.lifetime--;
    
    // Check collision with platforms
    for (let p of platforms) {
      if (this.collides(p)) {
        this.stuck = true;
        return;
      }
    }
    
    // Check collision with enemies
    for (let enemy of enemies) {
      if (this.collides(enemy)) {
        enemy.takeDamage(this.damage);
        this.stuck = true;
        return;
      }
    }
    
    // Check bounds
    if (this.x < -50 || this.x > 850 || this.y > 650 || this.lifetime <= 0) {
      this.stuck = true;
    }
  }
  
  collides(obj) {
    return this.x < obj.x + obj.width &&
           this.x + this.width > obj.x &&
           this.y < obj.y + obj.height &&
           this.y + this.height > obj.y;
  }
  
  draw(ctx) {
    if (this.stuck) return;
    
    ctx.save();
    ctx.fillStyle = '#8B4513'; // Brown arrow shaft
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Arrow tip
    ctx.fillStyle = '#C0C0C0'; // Silver arrowhead
    ctx.beginPath();
    if (this.vx > 0) {
      // Right-facing arrow
      ctx.moveTo(this.x + this.width, this.y + this.height/2);
      ctx.lineTo(this.x + this.width + 4, this.y + this.height/2 - 2);
      ctx.lineTo(this.x + this.width + 4, this.y + this.height/2 + 2);
    } else {
      // Left-facing arrow
      ctx.moveTo(this.x, this.y + this.height/2);
      ctx.lineTo(this.x - 4, this.y + this.height/2 - 2);
      ctx.lineTo(this.x - 4, this.y + this.height/2 + 2);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  
  isDone() {
    return this.stuck;
  }
}

// --- Asteroid Class ---
class Asteroid {
  constructor(targetX, targetY) {
    this.x = targetX; // Start at boss X coordinate
    this.y = -50; // Start above screen
    
    // Random size affects speed
    this.sizeType = Math.random() < 0.5 ? 'medium' : 'large';
    this.size = this.sizeType === 'medium' ? 20 : 35;
    this.width = this.size;
    this.height = this.size;
    
    // Speed based on size (smaller = faster)
    this.baseSpeed = this.sizeType === 'medium' ? 6 : 3;
    
    // Calculate direction to player position when summoned
    let dx = targetX - this.x;
    let dy = targetY - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize direction and apply speed
    this.vx = (dx / distance) * this.baseSpeed * 0.3; // Horizontal component
    this.vy = this.baseSpeed; // Mainly downward movement
    
    this.damage = this.sizeType === 'medium' ? 2 : 3;
    this.rotation = 0;
    this.rotationSpeed = 0.1;
    this.lifetime = 600; // 10 seconds max
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.lifetime--;
  }
  
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width/2, this.y + this.height/2);
    ctx.rotate(this.rotation);
    
    // Draw pixelated asteroid
    ctx.fillStyle = '#8B4513'; // Brown/rocky color
    ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
    
    // Add some detail for pixelated look
    ctx.fillStyle = '#654321'; // Darker brown details
    let detail = this.size / 5;
    ctx.fillRect(-this.width/2 + detail, -this.height/2 + detail, detail, detail);
    ctx.fillRect(this.width/2 - detail*2, -this.height/2 + detail*2, detail, detail);
    ctx.fillRect(-this.width/2 + detail*2, this.height/2 - detail*2, detail, detail);
    
    ctx.restore();
  }
  
  isDone() {
    return this.lifetime <= 0 || this.y > 650; // Off screen or expired
  }
  
  collidesWith(obj) {
    return this.x < obj.x + obj.width && this.x + this.width > obj.x &&
           this.y < obj.y + obj.height && this.y + this.height > obj.y;
  }
}

// --- Laser Class ---
class Laser {
  constructor(startX, startY, direction) {
    this.x = startX;
    this.y = startY;
    this.width = 8;
    this.height = 400; // Long scanning beam
    this.direction = direction; // 'horizontal' or 'vertical'
    
    if (this.direction === 'horizontal') {
      this.width = 400;
      this.height = 8;
      this.vx = (Math.random() < 0.5 ? -1 : 1) * 2; // Random horizontal movement
      this.vy = 0;
    } else {
      this.vx = 0;
      this.vy = (Math.random() < 0.5 ? -1 : 1) * 2; // Random vertical movement
    }
    
    this.damage = 2;
    this.lifetime = 180; // 3 seconds
    this.opacity = 1.0;
    this.flashTimer = 0;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.lifetime--;
    
    // Fade out near end of lifetime
    if (this.lifetime < 60) {
      this.opacity = this.lifetime / 60;
    }
    
    // Flash effect
    this.flashTimer++;
    if (this.flashTimer > 10) {
      this.flashTimer = 0;
    }
  }
  
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    
    // Main laser beam
    ctx.fillStyle = this.flashTimer < 5 ? '#FF0000' : '#FF6666'; // Red flashing
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Inner bright core
    let coreOffset = 2;
    ctx.fillStyle = '#FFFFFF';
    if (this.direction === 'horizontal') {
      ctx.fillRect(this.x + coreOffset, this.y + coreOffset, this.width - coreOffset*2, this.height - coreOffset*2);
    } else {
      ctx.fillRect(this.x + coreOffset, this.y + coreOffset, this.width - coreOffset*2, this.height - coreOffset*2);
    }
    
    ctx.restore();
  }
  
  isDone() {
    return this.lifetime <= 0;
  }
  
  collidesWith(obj) {
    return this.x < obj.x + obj.width && this.x + this.width > obj.x &&
           this.y < obj.y + obj.height && this.y + this.height > obj.y;
  }
}

// --- PowerUp System ---
const POWERUPS = ['damage', 'speed', 'shield', 'shockwave'];
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
      heartsHTML += `<span style="color:${i < this.player.hearts ? '#f00' : '#444'};font-size:36px;font-family:'Press Start 2P','Courier New',monospace;">&#10084;</span> `;
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
    } else if (this.player.healingCooldown > 0 && this.player.weapon === 'spellcaster') {
      let cd = Math.ceil(this.player.healingCooldown / 60);
      this.powerupDiv.innerHTML = `Heal Cooldown: <b>${cd}s</b>`;
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
        },
        // Level 4: Super Boss Level with 3 SuperBosses
        {
          platforms: [
            new Platform(0, 550, 800, 50),
            new Platform(150, 450, 100, 20),
            new Platform(350, 350, 100, 20),
            new Platform(550, 450, 100, 20),
            new Platform(250, 250, 120, 20),
            new Platform(450, 150, 120, 20)
          ],
          hazards: [
            new Hazard(300, 530, 40, 20),
            new Hazard(460, 530, 40, 20)
          ],
          enemies: [
            { superBoss: true, x: 200, y: 420 },
            { superBoss: true, x: 400, y: 320 },
            { superBoss: true, x: 600, y: 420 }
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
    this.shockwaves = [];
    this.fireballs = [];
    this.iceShards = [];
    this.healingWaves = [];
    this.explosions = [];
    this.arrows = [];
    this.asteroids = [];
    this.lasers = [];
    requestAnimationFrame(this.loop);
  }

  loadLevel(levelIdx) {
    const level = this.levels[levelIdx];
    this.platforms = level.platforms.map(p => new Platform(p.x, p.y, p.width, p.height));
    this.hazards = level.hazards.map(h => new Hazard(h.x, h.y, h.width, h.height));
    this.ladders = level.ladders ? level.ladders.map(l => new Ladder(l.x, l.y, l.width, l.height)) : [];
  this.enemies = level.enemies.map(e => {
    if (e.superBoss) {
      return new SuperBoss(e.x, e.y);
    } else if (e.boss) {
      return new BossEnemy(e.x, e.y);
    } else {
      return new Enemy(e.x, e.y);
    }
  });
    
    // Set hearts based on level: Level 1 = 5 hearts, Level 2 = 10 hearts, Level 3 = 15 hearts, Level 4 = 20 hearts
    let heartsForLevel;
    switch (levelIdx) {
      case 0: // Level 1
        heartsForLevel = 5;
        break;
      case 1: // Level 2
        heartsForLevel = 10;
        break;
      case 2: // Level 3
        heartsForLevel = 15;
        break;
      case 3: // Level 4
        heartsForLevel = 20;
        break;
      default: // Any additional levels default to 5 hearts
        heartsForLevel = 5;
        break;
    }
    
    if (!this.player) {
      this.player = new Player(level.playerStart.x, level.playerStart.y);
      this.player.hearts = heartsForLevel;
      this.player.maxHearts = heartsForLevel;
      this.ui = new UI(this.player);
      this.initFullscreen();
    } else {
      this.player.x = level.playerStart.x;
      this.player.y = level.playerStart.y;
      this.player.vx = 0;
      this.player.vy = 0;
      this.player.onGround = false;
      this.player.jumps = 0;
      // Update hearts when progressing to a new level
      this.player.hearts = heartsForLevel;
      this.player.maxHearts = heartsForLevel;
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
  
  findNearestEnemy() {
    if (this.enemies.length === 0) return null;
    
    let nearestEnemy = null;
    let shortestDistance = Infinity;
    
    for (let enemy of this.enemies) {
      let dx = enemy.x - this.player.x;
      let dy = enemy.y - this.player.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestEnemy = enemy;
      }
    }
    
    return nearestEnemy;
  }
  
  initInput() {
    window.addEventListener('keydown', e => {
      if ((e.code === 'KeyE') && this.player.hearts > 1 && this.player.powerUpCooldown <= 0) {
        this.player.hearts--;
        let p = getRandomPowerUp();
        this.player.startPowerUp(p);
        if (p === 'shockwave') {
          // Add visible shockwave effect (made bigger)
          this.shockwaves.push(new Shockwave(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, 120, 40));
          for (let enemy of this.enemies) {
            if (Math.abs(enemy.x - this.player.x) < 150) {
              enemy.takeDamage(2);
              enemy.stunned = 30; // 0.5 seconds at 60fps
            }
          }
        }
      }
      
      // Spellcaster abilities (Z, C, R keys) - with cooldown and casting system
      if (this.player.weapon === 'spellcaster' && this.player.spellCooldown <= 0 && !this.player.isCasting) {
        if (e.code === 'KeyZ') {
          // Start fireball casting
          let nearestEnemy = this.findNearestEnemy();
          if (nearestEnemy) {
            this.player.isCasting = true;
            this.player.castingTimer = 0;
            this.player.castingSpell = 'fireball';
            this.player.spellCooldown = 30; // 0.5 seconds at 60fps
            this.player.shockwaveAttackFrame = 0; // Reset animation
            this.player.shockwaveAttackFrameCounter = 0;
          }
        }
        
        if (e.code === 'KeyC') {
          // Start ice shard casting
          let nearestEnemy = this.findNearestEnemy();
          if (nearestEnemy) {
            this.player.isCasting = true;
            this.player.castingTimer = 0;
            this.player.castingSpell = 'iceShard';
            this.player.spellCooldown = 30; // 0.5 seconds at 60fps
            this.player.shockwaveAttackFrame = 0; // Reset animation
            this.player.shockwaveAttackFrameCounter = 0;
          }
        }
        
        if (e.code === 'KeyR') {
          // Start healing wave casting (with 10-second cooldown)
          if (this.player.healingStun <= 0 && this.player.healingCooldown <= 0) {
            this.player.isCasting = true;
            this.player.castingTimer = 0;
            this.player.castingSpell = 'healingWave';
            this.player.spellCooldown = 30; // 0.5 seconds at 60fps
            this.player.healingCooldown = 600; // 10 seconds at 60fps
            this.player.shockwaveAttackFrame = 0; // Reset animation
            this.player.shockwaveAttackFrameCounter = 0;
          }
        }
      }
      
      if (e.code === 'Escape' || e.code === 'KeyP') {
        this.paused = !this.paused;
      }
      if (e.code === 'KeyN' && this.levelComplete && this.currentLevel < this.levels.length - 1) {
        console.log('Debug: currentLevel=', this.currentLevel, 'levels.length=', this.levels.length);
  this.currentLevel++;
  // Hearts will be set automatically by loadLevel based on the new level
  this.player.ammo = this.player.maxAmmo; // Fully restore ammo
  this.loadLevel(this.currentLevel);
  this.levelComplete = false;
  this.gameOver = false;
  requestAnimationFrame(this.loop);
      } else if (e.code === 'KeyN') {
        console.log('Debug: N pressed but conditions not met - levelComplete:', this.levelComplete, 'currentLevel:', this.currentLevel, 'levels.length:', this.levels.length);
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
    
    // Check if player completed casting and release spell
    if (this.player.completeCasting) {
      let spellResult = this.player.releaseSpell(this);
      if (spellResult && spellResult.spell) {
        switch (spellResult.type) {
          case 'fireball':
            this.fireballs.push(spellResult.spell);
            break;
          case 'iceShard':
            this.iceShards.push(spellResult.spell);
            break;
          case 'healingWave':
            this.healingWaves.push(spellResult.spell);
            break;
        }
      }
      this.player.completeCasting = false;
    }
    
    // Check if player released an arrow
    let arrow = this.player.createArrow();
    if (arrow) {
      this.arrows.push(arrow);
    }
    
    let killedThisFrame = 0;
    for (let enemy of this.enemies) {
      if (enemy instanceof BossEnemy || enemy instanceof SuperBoss) {
        enemy.update(this.player, this.platforms, this.ladders, this);
      } else {
        enemy.update(this.player, this.platforms, this.ladders);
      }
      // Player attack (directional)
      if (enemy.attackedBy(this.player) && !this.player._attackHit) {
        let dmg = this.player.powerUp === 'damage' ? 2 : 1;
        enemy.takeDamage(dmg);
        this.player._attackHit = true;
        
        // Set attack momentum for forward movement (sword only)
        if (this.player.weapon === 'sword') {
          let kb = this.player.facing === 'right' ? 10 : -10;
          this.player.attackMomentum = kb;
          this.player.attackMomentumTimer = 8; // 8 frames of momentum (about 0.13 seconds at 60fps)
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
    
    // Update spells
    this.fireballs = this.fireballs.filter(fireball => {
      let explosion = fireball.update(this.platforms, this.enemies, this.player);
      if (explosion) {
        this.explosions.push(explosion);
      }
      return !fireball.isDone();
    });
    
    this.iceShards = this.iceShards.filter(iceShard => {
      iceShard.update(this.platforms, this.enemies, this.player);
      return !iceShard.isDone();
    });
    
    this.healingWaves = this.healingWaves.filter(wave => {
      wave.update(this.enemies, this.player);
      return !wave.isDone();
    });
    
    // Update arrows
    this.arrows = this.arrows.filter(arrow => {
      arrow.update(this.platforms, this.enemies, this.player);
      return !arrow.isDone();
    });
    
    // Update explosions
    this.explosions = this.explosions.filter(explosion => {
      explosion.update();
      return !explosion.isDone();
    });
    
    // Update asteroids
    this.asteroids = this.asteroids.filter(asteroid => {
      asteroid.update(this.platforms);
      // Check collision with player
      if (asteroid.collides(this.player)) {
        this.player.takeDamage(2); // Asteroids deal 2 damage
        return false; // Remove asteroid after hit
      }
      return !asteroid.isDone();
    });
    
    // Update lasers
    this.lasers = this.lasers.filter(laser => {
      laser.update();
      // Check collision with player
      if (laser.collides(this.player)) {
        this.player.takeDamage(3); // Lasers deal 3 damage
        return false; // Remove laser after hit
      }
      return !laser.isDone();
    });
    
    // Level complete condition
    if (this.currentLevel >= 2) { // Boss levels (Level 3 and 4)
      // Level completes when all boss enemies are defeated
      let bossEnemies = this.enemies.filter(e => e instanceof BossEnemy || e instanceof SuperBoss);
      console.log('Debug: Level', this.currentLevel + 1, 'boss enemies remaining:', bossEnemies.length);
      if (bossEnemies.length === 0) {
        this.levelComplete = true;
        console.log('Debug: Level completed!');
      }
    } else {
      // Regular levels complete when all enemies are defeated
      if (this.enemies.length === 0) {
        this.levelComplete = true;
      }
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
    // Spells
    for (let fireball of this.fireballs) fireball.draw(this.ctx);
    for (let iceShard of this.iceShards) iceShard.draw(this.ctx);
    for (let wave of this.healingWaves) wave.draw(this.ctx);
    // Arrows
    for (let arrow of this.arrows) arrow.draw(this.ctx);
    // Explosions
    for (let explosion of this.explosions) explosion.draw(this.ctx);
    // Asteroids
    for (let asteroid of this.asteroids) asteroid.draw(this.ctx);
    // Lasers
    for (let laser of this.lasers) laser.draw(this.ctx);
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
  setupPixelArtText(size = 48, color = '#fff') {
    this.ctx.font = `${size}px "Press Start 2P", "Courier New", monospace`;
    this.ctx.fillStyle = color;
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.textBaseline = 'middle';
    // Additional pixelation settings
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled = false;
  }
  drawPause() {
    this.ctx.save();
    this.ctx.globalAlpha = 0.7;
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
    this.setupPixelArtText(48, '#fff');
    this.ctx.fillText('PAUSED', 300, 300);
    this.ctx.restore();
  }
  drawGameOver() {
    this.ctx.save();
    this.ctx.globalAlpha = 0.8;
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
    this.setupPixelArtText(48, '#f00');
    this.ctx.fillText('GAME OVER', 240, 300);
    this.ctx.restore();
  }
  drawLevelComplete() {
    this.ctx.save();
    this.ctx.globalAlpha = 0.8;
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
    this.setupPixelArtText(42, '#0f0');
    this.ctx.fillText('LEVEL COMPLETE!', 150, 300);
    this.setupPixelArtText(24, '#0f0');
    if (this.currentLevel < this.levels.length - 1) {
      this.ctx.fillText('Press N for Next Level', 200, 350);
    } else {
      this.ctx.fillText('All levels complete!', 220, 350);
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
  window.game = new Game();
};
