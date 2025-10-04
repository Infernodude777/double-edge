// Double-Edge: Retro 2D Platformer
// Modular ES6 classes, placeholder shapes, and comments for future sprite import

// --- Sound Stub ---
function playSound(name) {
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
  
  clear() {
    this.keys = {};
  }
}

// --- Player Class ---
class Player {
  constructor(x, y) {
    this.x = x; this.y = y;
    this._attackHit = false;
    this.vx = 0; this.vy = 0;
  this.width = 50; this.height = 75;
    this.color = '#0ff';
    this.maxHearts = 5; // Default for level 1, will be updated by loadLevel
    this.hearts = 5; // Default for level 1, will be updated by loadLevel
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.attackMomentum = 0; // For forward momentum when hitting enemies
    this.attackMomentumTimer = 0;
    this.isDashing = false; // Track if player is in dash state
    this.dashHitEnemies = new Set(); // Track enemies hit during current dash
    this.powerUp = null;
    this.powerUpTimer = 0;
    this.weapon = 'sword';
    this.speed = 3;
  this.jumpPower = 11;
    this.onGround = false;
    this.invincible = false;
    this.cosmetic = null;
    this.facing = 'right'; // 'left' or 'right'
    this.jumps = 0; // double jump counter
    this.maxJumps = 2; // Allow double jumps
    // Removed energy system for infinite jumps
    this.energy = Infinity; // Set energy to infinite for jumps
    this.maxEnergy = Infinity; // Set max energy to infinite as well
    this.powerUpCooldown = 0;
    this.maxAmmo = 5;
    this.ammo = this.maxAmmo;
    this.healingStun = 0; // For healing spell - makes player stationary
    this.spellCooldown = 0; // Cooldown for spellcaster abilities (0.5s = 30 frames)
    this.healingCooldown = 0; // Separate cooldown for healing spell (10s = 600 frames)
    this._ePressed = false; // Track E key state for power-ups
    this.standingOnPlatform = null; // Track which platform player is standing on
    this.platformLastY = null; // Track last platform Y position
    
    // Casting system
    this.isCasting = false;
    this.castingTimer = 0;
    this.castingSpell = null; // 'fireball', 'iceShard', or 'healingWave'
    this.castingDuration = 60; // 1.0 seconds at 60 FPS
    
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
    console.log('releaseSpell called, castingSpell:', this.castingSpell);
    if (!this.castingSpell) return null;
    
    let spellX = this.x + this.width / 2;
    let spellY = this.y + this.height / 2;
    let spell = null;
    let spellType = this.castingSpell;
    console.log('Creating spell:', spellType, 'at position:', spellX, spellY, 'facing:', this.facing);
    
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
    console.log('Spell created:', spell);
    return { spell: spell, type: spellType };
  }
  
  startCasting(spellType) {
    console.log('startCasting called with:', spellType);
    this.isCasting = true;
    this.castingTimer = 0;
    this.castingSpell = spellType;
    this.spellCooldown = 30; // 0.5 second cooldown
    this.ammo--; // Consume ammo for spell casting
    
    // Update ammo display when ammo changes
    if (game && game.updateAmmoDisplay) {
      game.updateAmmoDisplay();
    }
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
    
    // Handle spellcaster abilities
    if (this.weapon === 'spellcaster' && !this.isCasting && this.spellCooldown <= 0 && this.ammo > 0) {
      if (input.isDown('KeyZ')) { // Fireball
        console.log('Fireball key pressed, starting cast');
        this.startCasting('fireball');
      } else if (input.isDown('KeyC')) { // Ice Shard
        console.log('Ice shard key pressed, starting cast');
        this.startCasting('iceShard');
      } else if (input.isDown('KeyR') && this.healingCooldown <= 0) { // Healing Wave
        console.log('Healing wave key pressed, starting cast');
        this.startCasting('healingWave');
        this.healingCooldown = 600; // 10 second cooldown
      }
    } else if (this.weapon === 'spellcaster') {
      // Debug why spells can't be cast
      if (this.isCasting) console.log('Cannot cast: already casting');
      if (this.spellCooldown > 0) console.log('Cannot cast: spell on cooldown:', this.spellCooldown);
      if (this.ammo <= 0) console.log('Cannot cast: no ammo available');
    }
    
    // Press E to sacrifice heart for power-up
    // On boss level (level 3), allow activation even with only 1 heart remaining
    const minHearts = (game && game.currentLevel === 2) ? 0 : 1; // Boss level allows going to 0, others require > 1
    if (input.isDown('KeyE') && !this._ePressed && this.powerUpCooldown <= 0 && this.hearts > minHearts && !this.powerUp) {
      this._ePressed = true;
      this.hearts--; // Sacrifice a heart
      this.powerUpCooldown = 600; // 10 second cooldown
      
      // Random power-up with debug logging
      const powerUps = ['speed', 'shield', 'damage'];
      const randomValue = Math.random();
      const randomIndex = Math.floor(randomValue * powerUps.length);
      const randomPowerUp = powerUps[randomIndex];
      console.log(`Power-up selection: random value: ${randomValue}, index ${randomIndex}, power-up: ${randomPowerUp}, available: [${powerUps.join(', ')}]`);
      this.startPowerUp(randomPowerUp);
      
      // Update UI to show active power-up
      const powerupElement = document.getElementById('powerup');
      if (powerupElement) {
        powerupElement.textContent = `Power-up: ${randomPowerUp.toUpperCase()}`;
        powerupElement.style.display = 'block';
        powerupElement.style.color = '#0f0';
        powerupElement.style.fontWeight = 'bold';
      }
      
      // Update prompt to show cooldown
      const promptElement = document.getElementById('prompt');
      if (promptElement) {
        promptElement.textContent = 'Power-up on cooldown (10s)';
        promptElement.style.color = '#f80';
      }
      
      console.log(`Power-up activated: ${randomPowerUp}, Hearts remaining: ${this.hearts}`);
    }
    
    // Reset E press flag when key is released
    if (!input.isDown('KeyE')) {
      this._ePressed = false;
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
        
        // Mark that we're dashing for damage detection
        this.isDashing = true;
      } else {
        this.isDashing = false;
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
    
    // Handle moving platform synchronization BEFORE moving the player
    if (this.standingOnPlatform && this.standingOnPlatform.update && this.platformLastY !== null) {
      // Player is standing on a moving platform - move with it
      let platformDeltaY = this.standingOnPlatform.y - this.platformLastY;
      this.y += platformDeltaY;
      console.log(`Moving player with platform: deltaY=${platformDeltaY}, newY=${this.y}`);
    }
    
    // Move
    this.x += this.vx;
    this.y += this.vy;
    this.onGround = false;
    
    // Reset platform tracking for this frame
    let wasStandingOnPlatform = this.standingOnPlatform;
    this.standingOnPlatform = null;
    
    // Platform collision and resolution
    for (let p of platforms) {
      if (this.collides(p)) {
        let prevY = this.y - this.vy;
        let prevX = this.x - this.vx;
        // Vertical collision
        if (prevY + this.height <= p.y) {
          // Check for fall distance
          let fallDistance = Math.abs(this.vy);
          this.y = p.y - this.height;
          this.vy = 0;
          if (!this.onGround && fallDistance > 32 * 5) { // 5 tiles
            // Landed with a boom
            playSound('boom');
            // Create shockwave effect (visual)
            if (window.game) {
              window.game.shockwaves.push({x: this.x + this.width/2, y: this.y + this.height, radius: 80, timer: 20});
            }
            // Damage nearby enemies
            if (window.game && window.game.enemies) {
              for (let enemy of window.game.enemies) {
                let dx = (enemy.x + enemy.width/2) - (this.x + this.width/2);
                let dy = (enemy.y + enemy.height/2) - (this.y + this.height);
                if (Math.sqrt(dx*dx + dy*dy) < 100) {
                  if (enemy.takeDamage) enemy.takeDamage(1);
                }
              }
            }
          }
          this.onGround = true;
          this.jumps = 0;
          // Track which platform player is standing on
          this.standingOnPlatform = p;
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
    
    // Update platform tracking for next frame
    if (this.standingOnPlatform && this.standingOnPlatform.update) {
      // Player is standing on a moving platform - store current position for next frame
      this.platformLastY = this.standingOnPlatform.y;
    } else {
      // Player not on moving platform - reset tracking
      this.platformLastY = null;
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
          // Update ammo display when ammo changes
          if (game && game.updateAmmoDisplay) {
            game.updateAmmoDisplay();
          }
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
        
        // Play sword swing sound with random pitch for sword weapon
        if (this.weapon === 'sword' && window.playSwordSwingSound) {
          window.playSwordSwingSound();
        }
        
        // Play scythe swing sound for scythe weapon
        if (this.weapon === 'scythe' && window.playScytheSwingSound) {
          window.playScytheSwingSound();
        }
        
        // Update ammo display when ammo changes
        if (game && game.updateAmmoDisplay) {
          game.updateAmmoDisplay();
        }
        
        playSound('attack');
      }
    }
    
    // Bow aiming (Arrow keys for height adjustment)
    if (this.weapon === 'bow') {
      if (input.isDown('ArrowUp')) {
        this.bowAimHeight = Math.max(this.bowAimHeight - 0.03, -1);
      } else if (input.isDown('ArrowDown')) {
        this.bowAimHeight = Math.min(this.bowAimHeight + 0.03, 1);
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
        // Update ammo display when ammo changes
        if (game && game.updateAmmoDisplay) {
          game.updateAmmoDisplay();
        }
      }
    }
    // Power-up timer
    if (this.powerUp && this.powerUpTimer > 0) {
      this.powerUpTimer--;
      if (this.powerUpTimer === 0) this.endPowerUp();
    }
    // Power-up cooldown decrement and UI update
    if (this.powerUpCooldown > 0) {
      this.powerUpCooldown--;
      
      // Update prompt with cooldown timer
      const promptElement = document.getElementById('prompt');
      if (promptElement) {
        const seconds = Math.ceil(this.powerUpCooldown / 60);
        promptElement.textContent = `Power-up cooldown: ${seconds}s`;
        promptElement.style.color = '#f80';
      }
    } else {
      // Update prompt availability based on hearts and power-up status
      const promptElement = document.getElementById('prompt');
      if (promptElement && !this.powerUp) {
        const minHearts = (game && game.currentLevel === 2) ? 0 : 1;
        if (this.hearts > minHearts) {
          promptElement.textContent = 'Press E to sacrifice a heart for a power-up';
          promptElement.style.color = '#0f0';
        } else {
          const needed = minHearts + 1;
          promptElement.textContent = `Need ${needed}+ hearts for power-up`;
          promptElement.style.color = '#f00';
        }
      }
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
        // Reset shockwave attack animation when casting completes
        this.shockwaveAttackFrame = 0;
        this.shockwaveAttackFrameCounter = 0;
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
        if (this.shockwaveAttackFrameCounter >= 12) { // Change frame every 12 frames (0.2s at 60fps)
          this.shockwaveAttackFrame = (this.shockwaveAttackFrame + 1) % 7; // Cycle through all 7 frames (0-6)
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
        // Note: Don't reset shockwave attack animation while casting
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
  ctx.drawImage(img, -(this.x + this.width), this.y, this.width, this.height);
  ctx.restore();
      } else {
  // Draw normally for right-facing
  ctx.drawImage(img, this.x, this.y, this.width, this.height);
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
      let arrowSpeed = 8 + (chargePercent * 6); // Match Arrow constructor
      let vx = (this.facing === 'right' ? 1 : -1) * arrowSpeed;
      let vy = (this.bowAimHeight * 3) + (chargePercent * -4); // Match Arrow constructor with charge bonus
      
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      
      let x = this.x + this.width/2;
      let y = this.y + this.height/2;
      ctx.moveTo(x, y);
      
      // Draw trajectory arc matching actual arrow physics
      for (let t = 1; t <= 20; t++) {
        x += vx;
        y += vy;
        vy += 0.2; // Match gravity in Arrow.update
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
    this.powerUpTimer = 300; // 5 seconds at 60fps (reduced from 1200/20 seconds)
    this.powerUpCooldown = 1200; // 20 seconds cooldown
    if (type === 'shield') this.invincible = true;
    // Maintain infinite energy for jumping
    this.energy = Infinity;
    playSound('powerup');
  }
  endPowerUp() {
    if (this.powerUp === 'shield') this.invincible = false;
    this.powerUp = null;
    this.powerUpTimer = 0;
    // Hide power-up UI
    const powerupElement = document.getElementById('powerup');
    if (powerupElement) {
      powerupElement.style.display = 'none';
    }
    // Cooldown remains until expired
  }
}
// --- End of Player class ---

// --- Enemy Class ---
class Enemy {
  constructor(x, y) {
  this.x = x; this.y = y;
  this.attackAnimFrames = 0;
  this.width = 64; this.height = 64;
    this.color = '#f00';
    this.vx = 1.5;
    this.vy = 0;
    this.health = 3;
    this.maxHealth = 3; // Add maxHealth property
    this.knockback = 0;
    this.knockbackDirection = 'right'; // Default direction
    this.jumpCooldown = randInt(60, 180); // frames until next jump
    this.onGround = false;
    this.stunned = 0;
    this.frozen = 0; // For ice shard spell
    
    // Animation state
    this.facing = 'right'; // Track facing direction
    this.currentState = 'idle'; // idle, running, jumping, attacking
    
    // Sprite loading for enemy animations
    this.idleFrame = 0;
    this.idleFrameCounter = 0;
    this.idleImages = [new Image(), new Image(), new Image(), new Image()];
    this.idleImages[0].src = 'assets/enemies/Enemy/Idle/0.png';
    this.idleImages[1].src = 'assets/enemies/Enemy/Idle/1.png';
    this.idleImages[2].src = 'assets/enemies/Enemy/Idle/2.png';
    this.idleImages[3].src = 'assets/enemies/Enemy/Idle/3.png';
    
    this.runFrame = 0;
    this.runFrameCounter = 0;
    this.runImages = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
    this.runImages[0].src = 'assets/enemies/Enemy/Run/0.png';
    this.runImages[1].src = 'assets/enemies/Enemy/Run/1.png';
    this.runImages[2].src = 'assets/enemies/Enemy/Run/2.png';
    this.runImages[3].src = 'assets/enemies/Enemy/Run/3.png';
    this.runImages[4].src = 'assets/enemies/Enemy/Run/4.png';
    this.runImages[5].src = 'assets/enemies/Enemy/Run/5.png';
    
    this.jumpFrame = 0;
    this.jumpFrameCounter = 0;
    this.jumpImages = [new Image(), new Image(), new Image(), new Image()];
    this.jumpImages[0].src = 'assets/enemies/Enemy/Jump/0.png';
    this.jumpImages[1].src = 'assets/enemies/Enemy/Jump/1.png';
    this.jumpImages[2].src = 'assets/enemies/Enemy/Jump/2.png';
    this.jumpImages[3].src = 'assets/enemies/Enemy/Jump/3.png';
    
    this.attackFrame = 0;
    this.attackFrameCounter = 0;
    this.attackImages = [new Image(), new Image(), new Image()];
    this.attackImages[0].src = 'assets/enemies/Enemy/Attack/0.png';
    this.attackImages[1].src = 'assets/enemies/Enemy/Attack/1.png';
    this.attackImages[2].src = 'assets/enemies/Enemy/Attack/2.png';
    
    this.deathFrame = 0;
    this.deathFrameCounter = 0;
    this.deathImages = [new Image(), new Image(), new Image(), new Image()];
    this.deathImages[0].src = 'assets/enemies/Enemy/Death/0.png';
    this.deathImages[1].src = 'assets/enemies/Enemy/Death/1.png';
    this.deathImages[2].src = 'assets/enemies/Enemy/Death/2.png';
    this.deathImages[3].src = 'assets/enemies/Enemy/Death/3.png';
    
    // Death animation state
    this.isPlayingDeathAnimation = false;
    this.deathAnimationComplete = false;
  }
  update(player, platforms, ladders, hazards) {
    // If health is 0 or below, start death animation
    if (this.health <= 0 && !this.isPlayingDeathAnimation) {
      this.isPlayingDeathAnimation = true;
      this.currentState = 'death';
      this.deathFrame = 0;
      this.deathFrameCounter = 0;
    }
    
    // If playing death animation, only update death frames
    if (this.isPlayingDeathAnimation) {
      this.updateAnimationFrames();
      return; // Don't do any other updates during death
    }
    
    if (this.stunned > 0) {
      this.stunned--;
      return;
    }
    if (this.frozen > 0) {
      this.frozen--;
      return; // Can't move while frozen
    }
    if (this.knockback > 0) {
      // Move in the direction of the knockback
      let knockbackAmount = this.knockbackDirection === 'right' ? 4 : -4;
      this.x += knockbackAmount;
      this.knockback--;
      return;
    }
    
    let wasMoving = false;
    // Simple AI: move toward player and track facing direction
    let movingLeft = false, movingRight = false;
    if (player.x < this.x) {
      this.x -= this.vx;
      this.facing = 'left';
      wasMoving = true;
      movingLeft = true;
    } else if (player.x > this.x) {
      this.x += this.vx;
      this.facing = 'right'; 
      wasMoving = true;
      movingRight = true;
    }

    // Jump over hazards if colliding
    if (hazards && this.onGround) {
      for (let h of hazards) {
        if (this.x + this.width > h.x && this.x < h.x + h.width && this.y + this.height > h.y && this.y < h.y + h.height) {
          // Only jump if moving toward hazard
          if ((movingLeft && this.x > h.x) || (movingRight && this.x < h.x + h.width)) {
            this.vy = -10; // Jump height for enemies
            this.onGround = false;
            break;
          }
        }
      }
    }

    // Determine current animation state
    if (!this.onGround) {
      this.currentState = 'jumping';
    } else if (wasMoving) {
      this.currentState = 'running';
    } else {
      this.currentState = 'idle';
    }

    // Update animation frames based on current state
    this.updateAnimationFrames();

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
  
  updateAnimationFrames() {
    // Update animation frames based on current state
    switch (this.currentState) {
      case 'idle':
        this.idleFrameCounter++;
        if (this.idleFrameCounter >= 15) { // Slower idle animation
          this.idleFrame = (this.idleFrame + 1) % this.idleImages.length;
          this.idleFrameCounter = 0;
        }
        break;
      case 'running':
        this.runFrameCounter++;
        if (this.runFrameCounter >= 8) { // Running animation speed
          this.runFrame = (this.runFrame + 1) % this.runImages.length;
          this.runFrameCounter = 0;
        }
        break;
      case 'jumping':
        this.jumpFrameCounter++;
        if (this.jumpFrameCounter >= 10) { // Jump animation speed
          this.jumpFrame = (this.jumpFrame + 1) % this.jumpImages.length;
          this.jumpFrameCounter = 0;
        }
        break;
      case 'attacking':
        this.attackFrameCounter++;
        if (this.attackFrameCounter >= 12) { // Attack animation speed
          this.attackFrame = (this.attackFrame + 1) % this.attackImages.length;
          this.attackFrameCounter = 0;
        }
        break;
      case 'death':
        this.deathFrameCounter++;
        if (this.deathFrameCounter >= 15) { // Death animation speed (slower)
          if (this.deathFrame < this.deathImages.length - 1) {
            this.deathFrame++;
          } else {
            this.deathAnimationComplete = true; // Mark animation as complete
          }
          this.deathFrameCounter = 0;
        }
        break;
    }
  }
  
  draw(ctx) {
    ctx.save();
    
    // Get the current sprite based on animation state
    let currentSprite = null;
    let currentFrame = 0;
    
    switch (this.currentState) {
      case 'idle':
        currentSprite = this.idleImages[this.idleFrame];
        break;
      case 'running':
        currentSprite = this.runImages[this.runFrame];
        break;
      case 'jumping':
        currentSprite = this.jumpImages[this.jumpFrame];
        break;
      case 'attacking':
        currentSprite = this.attackImages[this.attackFrame];
        break;
      case 'death':
        currentSprite = this.deathImages[this.deathFrame];
        break;
      default:
        currentSprite = this.idleImages[0]; // Fallback
    }
    
    // Set up transformation for sprite direction
    if (this.facing === 'left') {
      ctx.scale(-1, 1);
      ctx.translate(-this.x * 2 - this.width, 0);
    }
    
    // Draw the sprite if loaded
    if (currentSprite && currentSprite.complete) {
  ctx.drawImage(currentSprite, this.x, this.y, this.width, this.height);
    } else {
      // Fallback to colored rectangle if sprite not loaded
      ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    // Reset transformation for UI elements
    if (this.facing === 'left') {
      ctx.scale(-1, 1);
      ctx.translate(-this.x * 2 - this.width, 0);
    }
    
    // Health bar
    let barWidth = this.width;
    let percent = Math.max(0, this.health / this.maxHealth);
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
  takeDamage(amount, direction = 'right', weapon = null) {
    // Don't take damage while frozen
    if (this.frozen > 0) return;
    
    this.health -= amount;
    
    // Double knockback for bow
    if (weapon === 'bow') {
      this.knockback = 20; // Double the standard 10 knockback
    } else {
      this.knockback = 10; // Standard knockback
    }
    
    this.knockbackDirection = direction; // Store the direction
    playSound('enemyHurt');
  }
  isDead() { 
    return this.health <= 0 && this.deathAnimationComplete; 
  }
}
// --- Boss Enemy Class ---
class BossEnemy extends Enemy {
  constructor(x, y) {
    super(x, y);
  this.width = 160;
  this.height = 160;
    this.color = '#f0f';
    this.health = 20;
    this.maxHealth = 20; // Reduced health for new attack system
    this.spawnCooldown = 120; // frames
    this.attackCooldown = 0; // Add attack cooldown
    
    // Attack stage system with cooldown phases
    this.attackStage = 0; // 0: cooldown, 1: asteroids, 2: jump/shockwave, 3: laser, 4: minions
    this.stageTimer = 0;
    this.stageDuration = 480; // 8 seconds per stage (longer intervals)
    this.cooldownDuration = 300; // 5 seconds cooldown between phases
    this.attackExecuted = false; // Track if current stage attack was executed
    this.inCooldown = false; // Track if in cooldown phase
    
    // Movement properties
    this.moveSpeed = 1.5;
    this.attackRange = 60; // Range for normal attacks
    
    // Asteroid attack properties
    this.asteroidCount = 0;
    this.asteroidCooldown = 0;
    
    // Jump/shockwave properties
    this.isJumping = false;
    this.jumpStartY = y;
    this.jumpVelocity = 0;
    this.shockwaveActive = false;
    this.groundSpikes = [];
    
    // Minion summoning properties
    this.minionsCooldown = 0;
    this.minionsToSummon = 0;
    this.minionSummonDelay = 60; // 1 second between summons
    
    // Laser properties
    this.laserCharging = false;
    this.laserActive = false;
    this.laserChargeTime = 0;
    this.laserDuration = 0;
    this.laserStartX = 0;
    this.laserTargetX = 0;
    
    // Override Enemy sprites with Boss1 sprites
    this.idleImages = [new Image(), new Image(), new Image(), new Image()];
    this.idleImages[0].src = 'assets/enemies/Boss1/Idle/0.png';
    this.idleImages[1].src = 'assets/enemies/Boss1/Idle/1.png';
    this.idleImages[2].src = 'assets/enemies/Boss1/Idle/2.png';
    this.idleImages[3].src = 'assets/enemies/Boss1/Idle/3.png';
    
    this.runImages = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
    this.runImages[0].src = 'assets/enemies/Boss1/Run/0.png';
    this.runImages[1].src = 'assets/enemies/Boss1/Run/1.png';
    this.runImages[2].src = 'assets/enemies/Boss1/Run/2.png';
    this.runImages[3].src = 'assets/enemies/Boss1/Run/3.png';
    this.runImages[4].src = 'assets/enemies/Boss1/Run/4.png';
    this.runImages[5].src = 'assets/enemies/Boss1/Run/5.png';
    
    this.jumpImages = [new Image(), new Image(), new Image(), new Image()];
    this.jumpImages[0].src = 'assets/enemies/Boss1/Jump/0.png';
    this.jumpImages[1].src = 'assets/enemies/Boss1/Jump/1.png';
    this.jumpImages[2].src = 'assets/enemies/Boss1/Jump/2.png';
    this.jumpImages[3].src = 'assets/enemies/Boss1/Jump/3.png';
    
    this.attackImages = [new Image(), new Image(), new Image()];
    this.attackImages[0].src = 'assets/enemies/Boss1/Attack/0.png';
    this.attackImages[1].src = 'assets/enemies/Boss1/Attack/1.png';
    this.attackImages[2].src = 'assets/enemies/Boss1/Attack/2.png';
    
    this.deathImages = [new Image(), new Image(), new Image(), new Image()];
    this.deathImages[0].src = 'assets/enemies/Boss1/Death/0.png';
    this.deathImages[1].src = 'assets/enemies/Boss1/Death/1.png';
    this.deathImages[2].src = 'assets/enemies/Boss1/Death/2.png';
    this.deathImages[3].src = 'assets/enemies/Boss1/Death/3.png';
    
    // Load asteroid sprite
    this.asteroidSprite = new Image();
    this.asteroidSprite.src = 'assets/enemies/Boss1/weapon sprites/asteroid.png';
    
    // Load spike sprite
    this.spikeSprite = new Image();
    this.spikeSprite.src = 'assets/enemies/Boss1/weapon sprites/spike.png';
  }
  update(player, platforms, ladders, game) {
    // If health is 0 or below, start death animation
    if (this.health <= 0 && !this.isPlayingDeathAnimation) {
      this.isPlayingDeathAnimation = true;
      this.currentState = 'death';
      this.deathFrame = 0;
      this.deathFrameCounter = 0;
    }
    
    // If playing death animation, only update death frames
    if (this.isPlayingDeathAnimation) {
      this.updateAnimationFrames();
      return;
    }
    
    if (this.stunned > 0) {
      this.stunned--;
      return;
    }
    
    // Update stage timer and cycle through attack stages
    this.stageTimer++;
    
    // Phase system: cooldown -> attack phase -> cooldown -> next attack phase
    if (this.stageTimer >= (this.inCooldown ? this.cooldownDuration : this.stageDuration)) {
      if (this.inCooldown) {
        // End cooldown, start next attack phase
        this.inCooldown = false;
        this.attackStage = (this.attackStage % 4) + 1; // Cycle through 1, 2, 3, 4 (skip 0 which is cooldown)
        if (this.attackStage > 4) this.attackStage = 1; // Reset to first attack after minions
      } else {
        // End attack phase, start cooldown
        this.inCooldown = true;
        this.attackStage = 0; // Cooldown phase
      }
      
      this.stageTimer = 0;
      this.attackExecuted = false;
      
      // Reset stage-specific properties
      this.asteroidCount = 0;
      this.asteroidCooldown = 0;
      this.laserCharging = false;
      this.laserBlinking = false;
      this.laserActive = false;
      this.laserChargeTime = 0;
      this.shockwaveActive = false;
      this.minionsToSummon = 0;
      this.minionsCooldown = 0;
    }
    
    // Handle movement and normal attacks during cooldown phase
    if (this.inCooldown || this.attackStage === 0) {
      this.handleMovementAndNormalAttacks(player, game);
    } else {
      // Execute current attack stage
      switch(this.attackStage) {
        case 1: // Asteroid attack stage
          this.executeAsteroidAttack(player, game);
          this.currentState = 'attacking';
          break;
          
        case 2: // Jump and shockwave stage
          this.executeJumpShockwaveAttack(player, game);
          break;
          
        case 3: // Laser attack stage
          this.executeLaserAttack(player, game);
          this.currentState = 'attacking';
          break;
          
        case 4: // Minion summoning stage
          this.executeMinionSummon(player, game);
          this.currentState = 'attacking';
          break;
      }
    }
    
    // Handle gravity and ground collision for jumping stage
    if (this.attackStage === 1) {
      this.vy += 0.5;
      this.y += this.vy;
      
      // Ground collision
      this.onGround = false;
      if (this.y + this.height >= 550) {
        this.y = 550 - this.height;
        this.vy = 0;
        this.onGround = true;
        
        // Create shockwave when landing
        if (this.isJumping && this.onGround) {
          this.createShockwaveAndSpikes(game);
          this.isJumping = false;
        }
      }
    } else {
      // Normal ground positioning for other stages
      this.y = 550 - this.height;
      this.onGround = true;
    }
    
    // Update animation frames
    this.updateAnimationFrames();
    
    // Update ground spikes timer
    this.updateGroundSpikes(game);
  }
  
  handleMovementAndNormalAttacks(player, game) {
    // Move toward player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Move toward player if not too close
    if (distance > this.attackRange) {
      if (dx > 0) {
        this.x += this.moveSpeed;
        this.facing = 'right';
        this.currentState = 'running';
      } else if (dx < 0) {
        this.x -= this.moveSpeed;
        this.facing = 'left';
        this.currentState = 'running';
      }
    } else {
      // Close enough for normal attacks
      this.currentState = 'idle';
      
      // Perform normal attack occasionally
      if (this.stageTimer % 120 === 0) { // Attack every 2 seconds during cooldown
        this.currentState = 'attacking';
        // Deal damage if player is in range
        if (distance <= this.attackRange) {
          player.takeDamage(1);
        }
      }
    }
    
    // Keep boss on screen
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > 800) this.x = 800 - this.width;
  }
  
  executeMinionSummon(player, game) {
    if (!this.attackExecuted) {
      // Determine number of minions (1-3)
      this.minionsToSummon = Math.floor(Math.random() * 3) + 1;
      this.attackExecuted = true;
      this.minionsCooldown = 60; // Delay before first summon
    }
    
    // Summon minions with delays
    if (this.minionsToSummon > 0 && this.minionsCooldown <= 0) {
      this.summonMinion(game);
      this.minionsToSummon--;
      this.minionsCooldown = this.minionSummonDelay; // Delay between summons
    }
    
    if (this.minionsCooldown > 0) {
      this.minionsCooldown--;
    }
  }
  
  summonMinion(game) {
    if (!game) return;
    
    // Spawn minion at random position near boss
    const minionX = this.x + (Math.random() - 0.5) * 200; // Within 200 pixels of boss
    const clampedX = Math.max(50, Math.min(750, minionX)); // Keep on screen
    
    const minion = new Enemy(clampedX, 475);
    game.enemies.push(minion);
  }
  
  executeAsteroidAttack(player, game) {
    if (!this.attackExecuted) {
      // Determine number of asteroids (3-6)
      this.asteroidCount = Math.floor(Math.random() * 4) + 3;
      this.attackExecuted = true;
      this.asteroidCooldown = 30; // Delay between asteroids
    }
    
    // Spawn asteroids with delays
    if (this.asteroidCount > 0 && this.asteroidCooldown <= 0) {
      this.spawnAsteroid(player, game);
      this.asteroidCount--;
      this.asteroidCooldown = 20; // 0.33 second delay between asteroids
    }
    
    if (this.asteroidCooldown > 0) {
      this.asteroidCooldown--;
    }
  }
  
  executeJumpShockwaveAttack(player, game) {
    if (!this.attackExecuted) {
      // Start jump
      this.isJumping = true;
      this.vy = -15; // Jump velocity
      this.attackExecuted = true;
      this.currentState = 'jumping';
    }
  }
  
  executeLaserAttack(player, game) {
    if (!this.attackExecuted) {
      // Start laser blinking
      this.laserBlinking = true;
      this.laserBlinkTime = 0;
      this.laserBlinkCount = 0;
      this.laserVisible = true;
      this.laserStartX = this.x + this.width / 2;
      this.laserStartY = this.y + this.height / 2;
      // Capture target position when attack starts
      this.laserTargetX = player.x + player.width / 2;
      this.laserTargetY = player.y + player.height / 2;
      this.attackExecuted = true;
    }
    
    if (this.laserBlinking) {
      this.laserBlinkTime++;
      
      // Blink every 20 frames (0.33 seconds)
      if (this.laserBlinkTime >= 20) {
        this.laserBlinkTime = 0;
        this.laserVisible = !this.laserVisible;
        this.laserBlinkCount++;
        
        // After 2 blinks (4 visibility changes), fire laser
        if (this.laserBlinkCount >= 4) {
          this.laserBlinking = false;
          this.laserActive = true;
          this.laserDuration = 90; // 1.5 seconds
          this.fireLaser(player, game);
        }
      }
    }
    
    if (this.laserActive) {
      this.laserDuration--;
      if (this.laserDuration <= 0) {
        this.laserActive = false;
      }
    }
  }
  
  spawnAsteroid(player, game) {
    if (!game) return;
    
    // Spawn asteroid at random X position at top of screen
    const asteroidX = Math.random() * 800;
    const asteroidY = -50;
    
    // Calculate direction towards player (not homing, just initial direction)
    const directionX = (player.x - asteroidX) * 0.02; // Slow horizontal movement
    const directionY = 2 + Math.random() * 3; // Varied downward speed (2-5)
    
    // Create asteroid projectile with sprite and bouncing (2x bigger)
    const asteroid = {
      x: asteroidX,
      y: asteroidY,
      width: 60, // 2x bigger
      height: 60, // 2x bigger
      vx: directionX,
      vy: directionY,
      color: '#8B4513',
      type: 'asteroid',
      sprite: this.asteroidSprite,
      facingLeft: directionX < 0, // Mirror sprite if moving left
      damage: 2 // 2 hearts damage
    };
    
    if (!game.projectiles) game.projectiles = [];
    game.projectiles.push(asteroid);
  }
  
  createShockwaveAndSpikes(game) {
    if (!game) return;
    
    this.shockwaveActive = true;
    
    // Initialize sequential spike system
    this.groundSpikes = [];
    this.spikeSequence = {
      active: true,
      currentX: this.x + this.width, // Start right in front of boss
      direction: this.x < 400 ? 1 : -1, // Go right if boss is on left, left if on right
      timer: 0,
      spikeDelay: 10 // Frames between spike spawns
    };
  }
  
  updateGroundSpikes(game) {
    // Handle sequential spike spawning
    if (this.spikeSequence && this.spikeSequence.active) {
      this.spikeSequence.timer++;
      
      // Spawn new spike every spikeDelay frames
      if (this.spikeSequence.timer >= this.spikeSequence.spikeDelay) {
        this.spikeSequence.timer = 0;
        
        // Check if we hit a wall or edge
        if (this.spikeSequence.currentX >= 0 && this.spikeSequence.currentX <= 800) {
          // Create new spike
          this.groundSpikes.push({
            x: this.spikeSequence.currentX,
            y: 530, // Just above ground
            width: 30,
            height: 20,
            timer: 60, // 1 second at 60fps
            color: '#666'
          });
          
          // Move to next position
          this.spikeSequence.currentX += this.spikeSequence.direction * 40;
        } else {
          // Hit wall, stop spawning
          this.spikeSequence.active = false;
        }
      }
    }
    
    // Update existing spikes (don't remove on hit, just timer)
    this.groundSpikes = this.groundSpikes.filter(spike => {
      spike.timer--;
      return spike.timer > 0;
    });
  }
  
  fireLaser(player, game) {
    if (!game) return;
    
    // Calculate laser direction from boss to target
    const dx = this.laserTargetX - this.laserStartX;
    const dy = this.laserTargetY - this.laserStartY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize direction
    const dirX = dx / distance;
    const dirY = dy / distance;
    
    // Create laser beam extending from boss towards target
    const laser = {
      x: this.laserStartX,
      y: this.laserStartY,
      width: 15,
      height: distance,
      color: '#FF0000',
      type: 'laser',
      damage: 2,
      angle: Math.atan2(dy, dx), // Store angle for proper rendering
      dirX: dirX,
      dirY: dirY
    };
    
    if (!game.projectiles) game.projectiles = [];
    game.projectiles.push(laser);
  }
}

// --- SuperBoss Class (Level 4) ---
class SuperBoss extends BossEnemy {
  constructor(x, y) {
    super(x, y);
  this.width = 120;
  this.height = 120;
    this.color = '#8A2BE2'; // Blue violet
    this.health = 38;
    this.maxHealth = 38;
    
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
    if (this.health <= 0) {
      return;
    }
    
    // Movement toward player - more aggressive
    let dx = player.x - this.x;
    let dy = player.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 80) { // Only move if not too close
      if (dx < -10) this.x -= 1;
      else if (dx > 10) this.x += 1;
    }
    
    // Gravity and ground collision
    this.vy += 0.4;
    this.y += this.vy;
    
    // Platform collision
    for (let platform of platforms) {
      if (this.x < platform.x + platform.width && this.x + this.width > platform.x &&
          this.y + this.height > platform.y && this.y < platform.y + platform.height) {
        if (this.vy > 0) {
          this.y = platform.y - this.height;
          this.vy = 0;
        }
      }
    }
    
    // Keep on screen
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > 800) this.x = 800 - this.width;
    
    // Update attack pattern timing
    this.patternTimer++;
    if (this.patternTimer >= this.patternDuration) {
      this.attackPattern = (this.attackPattern + 1) % 3;
      this.patternTimer = 0;
    }
    
    // Execute attacks based on current pattern
    try {
      switch (this.attackPattern) {
        case 0: // Asteroid attacks
          this.asteroidCooldown--;
          if (this.asteroidCooldown <= 0) {
            // Use existing summonAsteroid method
            this.summonAsteroid(player, game);
            this.asteroidCooldown = this.asteroidAttackRate;
          }
          break;
          
        case 1: // Laser attacks  
          this.laserCooldown--;
          if (this.laserCooldown <= 0) {
            // Use existing fireLaser method
            this.fireLaser(game);
            this.laserCooldown = this.laserAttackRate;
          }
          break;
          
        case 2: // Minion spawning - ENABLED (safest)
          this.minionCooldown--;
          if (this.minionCooldown <= 0) {
            if (this.spawnMinion && game.enemies) {
              this.spawnMinion(game);
            }
            this.minionCooldown = this.minionSpawnRate;
          }
          break;
      }
    } catch (error) {
      console.error('SuperBoss attack error:', error);
    }
    
    // Take damage from player attacks
    if (this.attackedBy && this.attackedBy(player) && !player._attackHit) {
      let dmg = player.powerUp === 'damage' ? 3 : 2;
      this.health -= dmg;
      this.stunned = 30;
      player._attackHit = true;
    }
    
    // Deal damage to player on contact
    if (distance < 40 && !player.invincible) {
      player.takeDamage(2);
      player.invincible = true;
      setTimeout(() => player.invincible = false, 1000); // 1 second invincibility
    }
  }
  
  // Override takeDamage to ensure dash and all attacks work
  takeDamage(amount) {
    if (this.stunned > 0) return; // Don't take damage while stunned
    
    this.health -= amount;
    this.stunned = 15; // Shorter stun than regular enemies
  }
  
  summonAsteroid(player, game) {
    // Create asteroid aimed at player's current position
    let asteroid = new Asteroid(player.x, player.y);
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
    
    // Simple solid drawing - make SuperBosses very visible
    ctx.fillStyle = this.color; // Use the boss color directly
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // White border for visibility
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // Attack pattern indicator
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px monospace';
    let patternText = ['ASTEROID', 'LASER', 'MINION'][this.attackPattern];
    ctx.fillText(patternText, this.x, this.y - 10);
    
    // Health bar
    let healthPercent = this.health / this.maxHealth;
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
    
    // Get tile images from the game instance (passed via global reference)
    const game = window.game;
    
    if (game && game.tileBottomLoaded && game.tileTopLoaded) {
      // Draw tiled platforms using the PNG images
      
      // Get actual image dimensions for tiling
      const tileSize = 32; // Standard tile size
      
      // Draw tiles row by row
      for (let x = this.x; x < this.x + this.width; x += tileSize) {
        for (let y = this.y; y < this.y + this.height; y += tileSize) {
          const drawWidth = Math.min(tileSize, this.x + this.width - x);
          const drawHeight = Math.min(tileSize, this.y + this.height - y);
          
          // Check if this tile is exposed to air (top surface)
          const isTopSurface = (y === this.y); // First row is always top surface
          const isExposedToAir = this.isExposedToAir(x, y, game);
          
          if (isTopSurface || isExposedToAir) {
            // Use 1.png for surface tiles (exposed to air)
            ctx.drawImage(
              game.tileTopImage, 
              x, y, drawWidth, drawHeight
            );
          } else {
            // Use 0.png for underground tiles (not exposed to air)
            ctx.drawImage(
              game.tileBottomImage, 
              x, y, drawWidth, drawHeight
            );
          }
        }
      }
    } else {
      // Fallback to solid color if images not loaded
      ctx.fillStyle = '#888';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    ctx.restore();
  }
  
  // Check if a tile position is exposed to air
  isExposedToAir(tileX, tileY, game) {
    const tileSize = 32;
    
    // Check if there's empty space above this tile
    const checkY = tileY - tileSize;
    
    // If checking above the platform bounds, it's exposed to air
    if (checkY < this.y) {
      return true;
    }
    
    // Check if any other platform occupies the space above
    for (let platform of game.platforms) {
      if (platform !== this && 
          tileX >= platform.x && 
          tileX < platform.x + platform.width &&
          checkY >= platform.y && 
          checkY < platform.y + platform.height) {
        return false; // Space above is occupied by another platform
      }
    }
    
    return true; // No platform above, so exposed to air
  }
}

// --- Moving Platform Class ---
class MovingPlatform extends Platform {
  constructor(x, y, width, height, minX = 0, maxX = 800, speed = 0.5) {
    super(x, y, width, height);
    this.minX = minX;
    this.maxX = maxX - width; // Subtract width so platform doesn't go off screen
    this.speed = speed;
    this.direction = 1; // 1 for right, -1 for left
    this.startX = x;
  }
  
  update() {
    // Move the platform
    this.x += this.speed * this.direction;
    
    // Reverse direction when hitting boundaries
    if (this.x <= this.minX) {
      this.x = this.minX;
      this.direction = 1;
    } else if (this.x >= this.maxX) {
      this.x = this.maxX;
      this.direction = -1;
    }
  }
  
  // Override draw to handle moving platform rendering
  draw(ctx) {
    super.draw(ctx); // Use parent Platform draw method
  }
}

// --- Vertical Moving Platform Class ---
class VerticalMovingPlatform extends Platform {
  constructor(x, y, width, height, minY = 200, maxY = 500, speed = 0.3) {
    super(x, y, width, height);
    this.minY = minY;
    this.maxY = maxY;
    this.speed = speed;
    this.direction = 1; // 1 for down, -1 for up
    this.startY = y;
  }
  
  update() {
    // Move the platform vertically
    this.y += this.speed * this.direction;
    
    // Reverse direction when hitting boundaries
    if (this.y <= this.minY) {
      this.y = this.minY;
      this.direction = 1;
    } else if (this.y >= this.maxY) {
      this.y = this.maxY;
      this.direction = -1;
    }
  }
  
  // Override draw to handle moving platform rendering
  draw(ctx) {
    super.draw(ctx); // Use parent Platform draw method
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
        // Knockback direction based on fireball's velocity
        let knockDirection = this.vx > 0 ? 'right' : 'left';
        enemy.takeDamage(4.5, knockDirection); // Direct damage, 1.5x increased from 3 to 4.5
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
    
    // Create explosion effect at fireball location
    return new Explosion(this.x, this.y, 60); // Radius 60, damage nearby enemies
  }
  
  collides(obj) {
    return this.x < obj.x + obj.width && this.x + this.width > obj.x &&
           this.y < obj.y + obj.height && this.y + this.height > obj.y;
  }
  
  draw(ctx) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const radius = this.width / 2;
    
    // Draw flame effect with circles
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.globalAlpha = 0.7 - (i * 0.2);
      ctx.fillStyle = ['#f40', '#f80', '#fc0'][i];
      let currentRadius = radius + (i * 2);
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  
  isDone() {
    return this.exploded || this.hasHitEnemy || this.lifetime <= 0;
  }
}

// --- Ice Shard Class ---
class IceShard {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.width = 12;
    this.height = 12;
    this.speed = 10;
    this.vx = direction === 'right' ? this.speed : -this.speed;
    this.vy = 0;
    this.lifetime = 180; // 3 seconds at 60fps
    this.exploded = false;
  }
  
  update(platforms, enemies, player) {
    if (this.exploded) return;
    
    this.x += this.vx;
    this.y += this.vy;
    this.lifetime--;
    
    // Check collision with platforms
    for (let p of platforms) {
      if (this.collides(p)) {
        this.exploded = true;
        return;
      }
    }
    
    // Check collision with enemies - freeze them
    for (let enemy of enemies) {
      if (this.collides(enemy)) {
        // Freeze for longer if it's a boss
        const freezeDuration = enemy.constructor.name === 'BossEnemy' ? 360 : 180; // 6 seconds for bosses, 3 for normal enemies
        enemy.frozen = freezeDuration;
        this.exploded = true;
        return;
      }
    }
    
    // Check bounds
    if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 600 || this.lifetime <= 0) {
      this.exploded = true;
    }
  }
  
  collides(obj) {
    return this.x < obj.x + obj.width && this.x + this.width > obj.x &&
           this.y < obj.y + obj.height && this.y + this.height > obj.y;
  }
  
  draw(ctx) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const radius = this.width / 2;
    
    // Draw ice ball as a circle
    ctx.fillStyle = '#88ddff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw ice crystal effect
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 4, centerY);
    ctx.lineTo(centerX + 4, centerY);
    ctx.moveTo(centerX, centerY - 4);
    ctx.lineTo(centerX, centerY + 4);
    ctx.stroke();
  }
  
  isDone() {
    return this.exploded || this.lifetime <= 0;
  }
}

// --- Healing Wave Class ---
class HealingWave {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 20;
    this.maxRadius = 120;
    this.lifetime = 60; // 1 second at 60fps
    this.healAmount = 2;
    this.hasHealed = false;
  }
  
  update(enemies, player) {
    this.radius += 3; // Expand outward
    this.lifetime--;
    
    // Heal the player when they cast the healing spell
    if (!this.hasHealed && this.distanceTo(player) <= this.radius) {
      if (player.hearts < player.maxHearts) {
        player.hearts = Math.min(player.hearts + this.healAmount, player.maxHearts);
        console.log(`Player healed! Hearts: ${player.hearts}/${player.maxHearts}`);
        this.hasHealed = true;
      }
    }
  }
  
  distanceTo(obj) {
    let dx = (obj.x + obj.width/2) - this.x;
    let dy = (obj.y + obj.height/2) - this.y;
    return Math.sqrt(dx*dx + dy*dy);
  }
  
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner healing particles
    for (let i = 0; i < 8; i++) {
      let angle = (Math.PI * 2 * i) / 8;
      let px = this.x + Math.cos(angle) * (this.radius * 0.7);
      let py = this.y + Math.sin(angle) * (this.radius * 0.7);
      ctx.fillStyle = '#0f0';
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  
  isDone() {
    return this.lifetime <= 0 || this.radius >= this.maxRadius;
  }
}

// --- Arrow Class ---
class Arrow {
  constructor(x, y, direction, chargePercent, aimHeight) {
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 4;
    this.speed = 8 + (chargePercent * 6); // 8-14 speed based on charge
    this.damage = 1 + Math.floor(chargePercent * 2); // 1-3 damage based on charge
    this.vx = direction === 'right' ? this.speed : -this.speed;
    // Base aim height, plus extra upward velocity for charged shots
    this.vy = (aimHeight * 3) + (chargePercent * -4); // Charged shots get extra upward velocity
    this.lifetime = 300;
    this.stuck = false;
    this.hasHitEnemy = false;
  }
  
  update(platforms, enemies, player) {
    if (this.stuck || this.hasHitEnemy) return;
    
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.2; // Gravity
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
        let knockDirection = this.vx > 0 ? 'right' : 'left';
        
        // Double damage against bosses
        let actualDamage = this.damage;
        if (enemy.constructor.name === 'BossEnemy' || enemy.constructor.name === 'SuperBoss') {
          actualDamage = this.damage * 2;
          console.log(`Bow deals double damage to boss: ${actualDamage} (base: ${this.damage})`);
        }
        
        enemy.takeDamage(actualDamage, knockDirection, 'bow'); // Pass 'bow' for double knockback
        this.hasHitEnemy = true;
        return;
      }
    }
    
    // Check bounds
    if (this.x < 0 || this.x > 800 || this.y > 600 || this.lifetime <= 0) {
      this.stuck = true;
    }
  }
  
  collides(obj) {
    return this.x < obj.x + obj.width && this.x + this.width > obj.x &&
           this.y < obj.y + obj.height && this.y + this.height > obj.y;
  }
  
  draw(ctx) {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Arrow tip
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(this.x + (this.vx > 0 ? this.width : -4), this.y, 4, this.height);
  }
  
  isDone() {
    return this.stuck || this.hasHitEnemy || this.lifetime <= 0;
  }
}

// --- Explosion Class ---
class Explosion {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.maxRadius = radius;
    this.lifetime = 30;
    this.frame = 0;
  }
  
  update() {
    this.frame++;
    this.lifetime--;
  }
  
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = 0.8 - (this.frame / 30);
    
    // Explosion circle
    ctx.fillStyle = '#ff4400';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * (this.frame / 30), 0, Math.PI * 2);
    ctx.fill();
    
    // Inner bright core
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * (this.frame / 30) * 0.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
  
  isDone() {
    return this.lifetime <= 0;
  }
}

// --- Asteroid Class ---
class Asteroid {
  constructor(x, y) {
    this.x = x;
    this.y = -50; // Start above screen
    this.targetX = x;
    this.targetY = y;
    this.width = 32;
    this.height = 32;
    this.vx = 0;
    this.vy = 4;
    this.lifetime = 300;
  }
  
  update(platforms) {
    this.x += this.vx;
    this.y += this.vy;
    this.lifetime--;
    
    // Check collision with platforms
    for (let p of platforms) {
      if (this.collides(p)) {
        this.lifetime = 0; // Destroy on impact
        return;
      }
    }
    
    if (this.y > 600) {
      this.lifetime = 0;
    }
  }
  
  collides(obj) {
    return this.x < obj.x + obj.width && this.x + this.width > obj.x &&
           this.y < obj.y + obj.height && this.y + this.height > obj.y;
  }
  
  draw(ctx) {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Rock texture
    ctx.fillStyle = '#654321';
    ctx.fillRect(this.x + 4, this.y + 4, 8, 8);
    ctx.fillRect(this.x + 16, this.y + 8, 12, 6);
    ctx.fillRect(this.x + 8, this.y + 20, 16, 8);
  }
  
  isDone() {
    return this.lifetime <= 0;
  }
}

// --- Laser Class ---
class Laser {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 8;
    this.direction = direction;
    this.lifetime = 60;
    this.damage = 3;
  }
  
  update() {
    this.lifetime--;
  }
  
  collides(obj) {
    return this.x < obj.x + obj.width && this.x + this.width > obj.x &&
           this.y < obj.y + obj.height && this.y + this.height > obj.y;
  }
  
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Laser glow
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#ffaaaa';
    ctx.fillRect(this.x, this.y - 2, this.width, this.height + 4);
    ctx.restore();
  }
  
  isDone() {
    return this.lifetime <= 0;
  }
}

// --- Game Class ---
class Game {
  constructor() {
    // Get canvas and context
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Initialize input handler
    this.input = new Input();
    
    // Game state
    this.currentLevel = 0;
    this.levelComplete = false;
    this.gameOver = false;
    this.paused = false;
    this.frameCount = 0;
    this.lastFrameTime = 0;
    this.enemiesKilled = 0;
    
    // Visual effects
    this.screenShakeX = 0;
    this.screenShakeY = 0;
    this.redTintAlpha = 0;
    
    // Boss level effects
    this.isBossLevel = false;
    this.bossLevelTimer = 0;
    
    // Cutscene properties
    this.inCutscene = false;
    this.cutsceneType = null;
    this.cutsceneTimer = 0;
    this.dialogueIndex = 0;
    this.playerRunning = false;
    this.playerTargetX = 0;
    this.devilDialogue = [];
    this.altarBackground = null;
    this.cutsceneVideo = null;
    this._spacePressed = false; // Track space key state for cutscenes
    this._qPressed = false; // Track Q key state for heart sacrifice
    
    // Devil cutscene sound system
    this.devilSoundTimer = 0;
    this.nextDevilSoundTime = 0;
    
    // Game entities arrays
    this.platforms = [];
    this.movingPlatforms = [];
    this.hazards = [];
    this.ladders = [];
    this.enemies = [];
    this.fireballs = [];
    this.iceShards = [];
    this.healingWaves = [];
    this.arrows = [];
    this.explosions = [];
    this.asteroids = [];
    this.lasers = [];
    this.shockwaves = [];
    
    // Background
    this.backgroundImage = new Image();
    this.backgroundLoaded = false;
    this.backgroundImage.onload = () => this.backgroundLoaded = true;
    this.backgroundImage.src = 'assets/ui/doubleedge_background.gif';
    
    // Tile images for platforms
    this.tileTopImage = new Image();
    this.tileBottomImage = new Image();
    this.tileTopLoaded = false;
    this.tileBottomLoaded = false;
    this.tileTopImage.onload = () => this.tileTopLoaded = true;
    this.tileBottomImage.onload = () => this.tileBottomLoaded = true;
    this.tileTopImage.src = 'assets/ui/1.png'; // Surface tiles (exposed to air)
    this.tileBottomImage.src = 'assets/ui/0.png'; // Underground tiles
    
    // Unlock system
    this.roadUnlocks = {
      weapons: ['sword'], // Start with sword unlocked
      levels: [0] // Start with level 1 unlocked
    };
    this.newWeaponUnlocked = null;
    
    // Load saved unlocks
    this.loadUnlocks();
    
    // Initialize UI
    this.ui = {
      update: () => {
        this.updateHeartsDisplay();
        this.updateAmmoDisplay();
      }
    };
    
    // Set up input handling
    this.initInput();
    
    // Load the first level and start the game
    this.loadLevel(0);
    
    // Make game instance globally available for platform rendering
    window.game = this;
    
    // Start the game loop
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  createAsteroidExplosion(x, y) {
    // Create explosion effect
    const explosion = new Explosion(x, y, 80); // Radius 80 for good area damage
    this.explosions.push(explosion);
    
    // Damage all nearby entities (enemies and player)
    const explosionRadius = 80;
    
    // Check player damage
    const playerCenterX = this.player.x + this.player.width / 2;
    const playerCenterY = this.player.y + this.player.height / 2;
    const playerDistance = Math.sqrt((playerCenterX - x) ** 2 + (playerCenterY - y) ** 2);
    
    if (playerDistance <= explosionRadius) {
      this.player.takeDamage(2); // 2 hearts damage from explosion
    }
    
    // Check enemy damage (exclude Boss1 from explosion damage)
    for (let enemy of this.enemies) {
      if (enemy.isDead()) continue;
      
      // Skip Boss1 - they should be immune to their own asteroid explosions
      if (enemy instanceof BossEnemy) continue;
      
      const enemyCenterX = enemy.x + enemy.width / 2;
      const enemyCenterY = enemy.y + enemy.height / 2;
      const enemyDistance = Math.sqrt((enemyCenterX - x) ** 2 + (enemyCenterY - y) ** 2);
      
      if (enemyDistance <= explosionRadius) {
        enemy.takeDamage(3); // Higher damage to enemies
      }
    }
  }

  // Line-rectangle intersection for laser collision detection
  lineIntersectsRect(x1, y1, x2, y2, rectLeft, rectTop, rectRight, rectBottom) {
    // Check if either endpoint is inside the rectangle
    if ((x1 >= rectLeft && x1 <= rectRight && y1 >= rectTop && y1 <= rectBottom) ||
        (x2 >= rectLeft && x2 <= rectRight && y2 >= rectTop && y2 <= rectBottom)) {
      return true;
    }
    
    // Check intersection with each side of the rectangle
    return (
      this.lineIntersectsLine(x1, y1, x2, y2, rectLeft, rectTop, rectRight, rectTop) ||     // Top
      this.lineIntersectsLine(x1, y1, x2, y2, rectRight, rectTop, rectRight, rectBottom) || // Right
      this.lineIntersectsLine(x1, y1, x2, y2, rectRight, rectBottom, rectLeft, rectBottom) || // Bottom
      this.lineIntersectsLine(x1, y1, x2, y2, rectLeft, rectBottom, rectLeft, rectTop)      // Left
    );
  }

  // Line-line intersection helper
  lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denom === 0) return false; // Lines are parallel
    
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
    
    return (t >= 0 && t <= 1) && (u >= 0 && u <= 1);
  }

  update() {
    // Handle cutscene logic
    if (this.inCutscene) {
      this.updateCutscene();
      return;
    }
    
    // Boss level effects
    if (this.isBossLevel) {
      this.bossLevelTimer++;
      
      // Constant screen shake
      this.screenShakeX = (Math.random() - 0.5) * 8;
      this.screenShakeY = (Math.random() - 0.5) * 8;
      
      // Pulsing red tint
      this.redTintAlpha = 0.15 + Math.sin(this.bossLevelTimer * 0.1) * 0.1;
    }
    
    // Always update player and entities
    this.player.update(this.input, this.platforms.concat(this.movingPlatforms), this.hazards, this.enemies, this.ladders);
    
    // Update moving platforms
    for (let movingPlatform of this.movingPlatforms) {
      movingPlatform.update();
    }

    // Handle spell casting completion
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

    // Handle arrow creation
    let arrow = this.player.createArrow();
    if (arrow) {
      this.arrows.push(arrow);
    }

    // Enemy updates and combat
    let killedThisFrame = 0;
    for (let enemy of this.enemies) {
      if (enemy instanceof BossEnemy || enemy instanceof SuperBoss) {
        enemy.update(this.player, this.platforms, this.ladders, this);
      } else {
        enemy.update(this.player, this.platforms, this.ladders);
      }
      if (enemy.attackedBy(this.player) && !this.player._attackHit) {
        let dmg = this.player.powerUp === 'damage' ? 2 : 1;
        enemy.takeDamage(dmg, this.player.facing);
        this.player._attackHit = true;
        if (this.player.weapon === 'sword') {
          let kb = this.player.facing === 'right' ? 10 : -10;
          this.player.attackMomentum = kb;
          this.player.attackMomentumTimer = 8;
          if (this.player.dashHitEnemies) {
            this.player.dashHitEnemies.clear();
          }
        }
      }
      if (enemy.isDead()) {
        killedThisFrame++;
      }
    }

    // Handle dash attacks with sword
    if (this.player.isDashing && this.player.weapon === 'sword') {
      for (let enemy of this.enemies) {
        if (enemy.isDead()) continue;
        if (this.player.x < enemy.x + enemy.width && this.player.x + this.player.width > enemy.x &&
            this.player.y < enemy.y + enemy.height && this.player.y + this.player.height > enemy.y) {
          if (!this.player.dashHitEnemies) {
            this.player.dashHitEnemies = new Set();
          }
          if (!this.player.dashHitEnemies.has(enemy)) {
            let dmg = this.player.powerUp === 'damage' ? 2 : 1;
            enemy.takeDamage(dmg, this.player.facing);
            this.player.dashHitEnemies.add(enemy);
            enemy.stunned = Math.max(enemy.stunned, 10);
          }
        }
      }
    }

    if (!this.player.isDashing && this.player.dashHitEnemies) {
      this.player.dashHitEnemies.clear();
    }

    // Remove dead enemies and handle heart gain + ammo regeneration
    let prevCount = this.enemies.length;
    this.enemies = this.enemies.filter(e => !e.isDead());
    let killed = prevCount - this.enemies.length;
    if (killed > 0) {
      this.enemiesKilled += killed;
      
      // Regenerate 1 ammo per enemy killed
      this.player.ammo = Math.min(this.player.ammo + killed, this.player.maxAmmo);
      
      // Update ammo display when ammo changes
      if (this.updateAmmoDisplay) {
        this.updateAmmoDisplay();
      }
      
      // Heart gain logic (every 5 kills)
      let heartsToAdd = Math.floor(this.enemiesKilled / 5);
      if (heartsToAdd > 0 && this.player.hearts < this.player.maxHearts) {
        this.player.hearts = Math.min(this.player.hearts + heartsToAdd, this.player.maxHearts);
        this.enemiesKilled = this.enemiesKilled % 5;
        playSound('heartGain');
      }
    }

    // Hazard damage
    for (let hazard of this.hazards) {
      if (hazard.collides(this.player)) {
        this.player.takeDamage(1);
      }
    }

    // Update effects and projectiles
    this.shockwaves = this.shockwaves.filter(sw => {
      sw.update();
      return !sw.isDone();
    });
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
    this.arrows = this.arrows.filter(arrow => {
      arrow.update(this.platforms, this.enemies, this.player);
      return !arrow.isDone();
    });
    this.explosions = this.explosions.filter(explosion => {
      explosion.update();
      return !explosion.isDone();
    });
    
    // Handle new boss projectiles (asteroids, lasers, ground spikes)
    if (!this.projectiles) this.projectiles = [];
    this.projectiles = this.projectiles.filter(projectile => {
      // Update projectile movement
      if (projectile.type === 'asteroid') {
        projectile.x += projectile.vx;
        projectile.y += projectile.vy;
        
        // Bounce off left and right borders
        if (projectile.x <= 0 || projectile.x + projectile.width >= 800) {
          projectile.vx = -projectile.vx; // Reverse horizontal direction
          projectile.facingLeft = !projectile.facingLeft; // Flip sprite direction
          
          // Keep asteroid within bounds
          if (projectile.x <= 0) projectile.x = 0;
          if (projectile.x + projectile.width >= 800) projectile.x = 800 - projectile.width;
        }
        
        // Check collision with Boss1 - bounce off instead of damaging
        for (let enemy of this.enemies) {
          if (enemy instanceof BossEnemy &&
              projectile.x < enemy.x + enemy.width &&
              projectile.x + projectile.width > enemy.x &&
              projectile.y < enemy.y + enemy.height &&
              projectile.y + projectile.height > enemy.y) {
            // Calculate bounce direction away from boss
            const bossCenterX = enemy.x + enemy.width / 2;
            const bossCenterY = enemy.y + enemy.height / 2;
            const asteroidCenterX = projectile.x + projectile.width / 2;
            const asteroidCenterY = projectile.y + projectile.height / 2;
            
            // Calculate direction from boss to asteroid
            const dx = asteroidCenterX - bossCenterX;
            const dy = asteroidCenterY - bossCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
              // Normalize and apply bounce
              const normalizedDx = dx / distance;
              const normalizedDy = dy / distance;
              
              // Set new velocity away from boss
              projectile.vx = normalizedDx * 4; // Bounce speed
              projectile.vy = normalizedDy * 3; // Bounce speed
              
              // Update facing direction
              projectile.facingLeft = projectile.vx < 0;
              
              // Push asteroid away from boss to prevent sticking
              projectile.x = bossCenterX + normalizedDx * (enemy.width/2 + projectile.width/2 + 5);
              projectile.y = bossCenterY + normalizedDy * (enemy.height/2 + projectile.height/2 + 5);
            }
            break; // Only check first boss collision
          }
        }
        
        // Check collision with player
        if (projectile.x < this.player.x + this.player.width &&
            projectile.x + projectile.width > this.player.x &&
            projectile.y < this.player.y + this.player.height &&
            projectile.y + projectile.height > this.player.y) {
          this.player.takeDamage(projectile.damage || 2);
          this.createAsteroidExplosion(projectile.x + projectile.width/2, projectile.y + projectile.height/2);
          return false; // Remove asteroid after hit
        }
        
        // Check if asteroid hits ground
        if (projectile.y + projectile.height >= 550) {
          this.createAsteroidExplosion(projectile.x + projectile.width/2, 550);
          return false; // Remove asteroid after hitting ground
        }
        
        // Remove if off screen
        return projectile.y < 650;
      }
      
      if (projectile.type === 'laser') {
        // For rotated laser, use line-segment collision detection
        const laserStartX = projectile.x;
        const laserStartY = projectile.y;
        const laserEndX = projectile.x + projectile.dirX * projectile.height;
        const laserEndY = projectile.y + projectile.dirY * projectile.height;
        
        // Check if laser line intersects with player rectangle
        const playerLeft = this.player.x;
        const playerRight = this.player.x + this.player.width;
        const playerTop = this.player.y;
        const playerBottom = this.player.y + this.player.height;
        
        // Check if laser line intersects player bounding box
        if (this.lineIntersectsRect(laserStartX, laserStartY, laserEndX, laserEndY, 
                                   playerLeft, playerTop, playerRight, playerBottom)) {
          this.player.takeDamage(projectile.damage || 2);
          return false; // Remove laser after hit
        }
        return true; // Laser persists (will be removed by boss logic)
      }
      
      return true;
    });
    
    // Handle ground spikes collision
    this.enemies.forEach(enemy => {
      if (enemy instanceof BossEnemy && enemy.groundSpikes) {
        enemy.groundSpikes.forEach(spike => {
          if (spike.timer > 0 && // Only active spikes
              spike.x < this.player.x + this.player.width &&
              spike.x + spike.width > this.player.x &&
              spike.y < this.player.y + this.player.height &&
              spike.y + spike.height > this.player.y) {
            this.player.takeDamage(1);
            // Don't remove spike, let it persist for full duration
          }
          
          // Check spike collision with other enemies
          this.enemies.forEach(otherEnemy => {
            if (otherEnemy !== enemy && spike.timer > 0 &&
                spike.x < otherEnemy.x + otherEnemy.width &&
                spike.x + spike.width > otherEnemy.x &&
                spike.y < otherEnemy.y + otherEnemy.height &&
                spike.y + spike.height > otherEnemy.y) {
              otherEnemy.takeDamage(1);
            }
          });
        });
      }
    });
    
    this.asteroids = this.asteroids.filter(asteroid => {
      asteroid.update(this.platforms);
      if (asteroid.collides(this.player)) {
        this.player.takeDamage(2);
        return false;
      }
      return !asteroid.isDone();
    });
    this.lasers = this.lasers.filter(laser => {
      laser.update();
      if (laser.collides(this.player)) {
        this.player.takeDamage(3);
        return false;
      }
      return !laser.isDone();
    });

    // Level complete condition
    if (this.currentLevel >= 2) {
      // Boss level (level 3) - require both boss AND all minions to be killed
      let remainingBosses = this.enemies.filter(e => 
        e.constructor.name === 'BossEnemy' || e.constructor.name === 'SuperBoss'
      );
      // Level complete only when ALL enemies are dead (boss + minions)
      if (this.enemies.length === 0) {
        console.log('Level 3 complete: Boss and all minions defeated!');
        // Game is completed after level 3!
        this.gameCompleted = true;
      }
    } else {
      if (this.enemies.length === 0) {
        this.levelComplete = true;
        this.unlockWeaponForLevel(this.currentLevel);
      }
    }
    if (this.player.hearts <= 0) {
      this.gameOver = true;
    }
    this.ui.update();
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
    this.ctx.fillStyle = '#222';
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
  this.ctx.textAlign = 'center';
  this.ctx.textBaseline = 'middle';
  this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
  this.ctx.restore();
  }
  
  drawGameCompleted() {
    this.ctx.save();
    
    // Full screen black background
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Main "GAME COMPLETED!" text - large, green, centered
    this.setupPixelArtText(48, '#0f0'); // Bright green
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('GAME COMPLETED!', this.canvas.width / 2, this.canvas.height / 2 - 40);
    
    // "FUTURE UPDATES COMING" text - smaller, white, centered below
    this.setupPixelArtText(24, '#fff');
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('FUTURE UPDATES COMING', this.canvas.width / 2, this.canvas.height / 2 + 20);
    
    this.ctx.restore();
  }
  
  drawGameCompleted() {
    this.ctx.save();
    
    // Full screen black background
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Main "GAME COMPLETED!" text - large, green, centered
    this.setupPixelArtText(48, '#0f0'); // Bright green
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('GAME COMPLETED!', this.canvas.width / 2, this.canvas.height / 2 - 40);
    
    // "FUTURE UPDATES COMING" text - smaller, white, centered below
    this.setupPixelArtText(24, '#fff');
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('FUTURE UPDATES COMING', this.canvas.width / 2, this.canvas.height / 2 + 20);
    
    this.ctx.restore();
  }
  drawLevelComplete() {
    this.ctx.save();
    
    // Full screen semi-transparent overlay (like game over screen)
    this.ctx.globalAlpha = 0.8;
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
    
    // Main "LEVEL COMPLETE!" text - large, green, centered
    this.setupPixelArtText(48, '#0f0'); // Bright green like game over red
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('LEVEL COMPLETE!', this.canvas.width / 2, this.canvas.height / 2 - 40);
    
    // "Press N for Next Level" instruction - smaller, centered below
    this.setupPixelArtText(24, '#fff');
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('Press N for Next Level', this.canvas.width / 2, this.canvas.height / 2 + 20);
    
    this.ctx.restore();
  }
  
  drawLevelCompleteOverlay() {
    this.ctx.save();
    
    // Draw semi-transparent overlay at top of screen
    this.ctx.globalAlpha = 0.8;
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, 100);
    this.ctx.globalAlpha = 1;
    
    // "LEVEL COMPLETE!" text
    this.setupPixelArtText(28, '#0f0');
    this.ctx.textAlign = 'center';
    this.ctx.fillText('LEVEL COMPLETE!', this.canvas.width / 2, 35);
    
    // Next level instruction
    this.setupPixelArtText(18, '#0f0');
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Press N for Next Level', this.canvas.width / 2, 65);
    
    this.ctx.restore();
  }
  
  loadUnlocks() {
    let data = localStorage.getItem('doubleEdgeUnlocks');
    if (data) this.roadUnlocks = JSON.parse(data);
    
    // Clean up old individual weapon unlock keys from previous system
    const weaponKeys = ['sword', 'scythe', 'spellcaster', 'bow', 'axe', 'spear'];
    weaponKeys.forEach(weapon => {
      localStorage.removeItem(`weapon_${weapon}_unlocked`);
    });
  }
  saveUnlocks() {
    localStorage.setItem('doubleEdgeUnlocks', JSON.stringify(this.roadUnlocks));
  }
  
  unlockWeaponForLevel(levelIndex) {
    const weaponUnlocks = {
      0: 'scythe',     // After level 1 (index 0)
      1: 'spellcaster', // After level 2 (index 1)  
      2: 'bow'         // After level 3 (index 2)
    };
    
    const weaponToUnlock = weaponUnlocks[levelIndex];
    if (weaponToUnlock && !this.roadUnlocks.weapons.includes(weaponToUnlock)) {
      this.roadUnlocks.weapons.push(weaponToUnlock);
      this.saveUnlocks();
      // Weapon unlocked silently - no notification displayed
    }
  }
  
  reset() {
    this.currentLevel = 0;
    
    // Clear all projectiles and boss states before loading level
    this.projectiles = [];
    this.fireballs = [];
    this.iceShards = [];
    this.healingWaves = [];
    this.arrows = [];
    this.explosions = [];
    this.asteroids = [];
    this.lasers = [];
    this.shockwaves = [];
    
    // Reset player weapon and ammo to defaults before loading level
    if (this.player) {
      this.player.weapon = 'sword'; // Reset to default weapon
      this.player.ammo = 5; // Reset to default ammo
    }
    
    this.loadLevel(this.currentLevel);
    this.levelComplete = false;
    this.gameOver = false;
    this.gameCompleted = false;
    this.paused = false;
    this.screenShakeX = 0;
    this.screenShakeY = 0;
    this.redTintAlpha = 0;
    this.lastFrameTime = 0;
    
    // Clear cutscene state
    this.inCutscene = false;
    this.cutsceneType = null;
    this.cutsceneTimer = 0;
    this.dialogueIndex = 0;
    this.devilSoundTimer = 0;
    this.nextDevilSoundTime = 0;
    
    // Clean up cutscene video
    if (this.cutsceneVideo) {
      this.cutsceneVideo.pause();
      this.cutsceneVideo.currentTime = 0;
      if (this.cutsceneVideo.parentNode) {
        this.cutsceneVideo.parentNode.removeChild(this.cutsceneVideo);
      }
      this.cutsceneVideo = null;
    }
    
    // Hide skip cutscene button
    const skipBtn = document.getElementById('skip-cutscene-btn');
    if (skipBtn) {
      skipBtn.style.display = 'none';
    }
    
    // Clear input states to prevent interference
    if (this.input) {
      this.input.clear();
    }
    this._spacePressed = false;
    this._qPressed = false;
    
    requestAnimationFrame(this.loop);
  }

  loop(currentTime = 0) {
    if (!this.lastFrameTime) this.lastFrameTime = currentTime;
    const frameInterval = 1000 / 60;
    const deltaTime = currentTime - this.lastFrameTime;
    if (deltaTime < frameInterval) {
      requestAnimationFrame(this.loop);
      return;
    }
    this.lastFrameTime = currentTime;
    this.frameCount++;
    if (this.paused) {
      this.drawPause();
      requestAnimationFrame(this.loop);
      return;
    }
    if (this.gameCompleted) {
      this.drawGameCompleted();
      requestAnimationFrame(this.loop);
      return;
    }
    if (this.gameOver) {
      this.drawGameOver();
      requestAnimationFrame(this.loop);
      return;
    }
    this.update();
    this.draw();
    requestAnimationFrame(this.loop);
  }

  draw() {
    // Apply screen shake for boss level
    if (this.isBossLevel) {
      this.ctx.save();
      this.ctx.translate(this.screenShakeX, this.screenShakeY);
    }
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.backgroundLoaded) {
      this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    } else {
      this.ctx.fillStyle = '#222';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    for (let platform of this.platforms) platform.draw(this.ctx);
    for (let movingPlatform of this.movingPlatforms) movingPlatform.draw(this.ctx);
    for (let hazard of this.hazards) hazard.draw(this.ctx);
    for (let ladder of this.ladders) ladder.draw(this.ctx);
    if (this.player) this.player.draw(this.ctx);
    for (let enemy of this.enemies) enemy.draw(this.ctx);
    
    // Draw laser blinking effect for boss enemies
    this.enemies.forEach(enemy => {
      if (enemy instanceof BossEnemy && enemy.laserBlinking && enemy.laserVisible) {
        // Draw blinking laser preview line
        this.ctx.save();
        this.ctx.strokeStyle = '#FF0000';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([5, 5]); // Dashed line for preview
        this.ctx.globalAlpha = 0.7;
        
        // Draw line from boss to target position
        this.ctx.beginPath();
        this.ctx.moveTo(enemy.laserStartX, enemy.laserStartY);
        this.ctx.lineTo(enemy.laserTargetX, enemy.laserTargetY);
        this.ctx.stroke();
        
        this.ctx.restore();
      }
    });
    for (let fireball of this.fireballs) fireball.draw(this.ctx);
    for (let iceShard of this.iceShards) iceShard.draw(this.ctx);
    for (let healingWave of this.healingWaves) healingWave.draw(this.ctx);
    for (let explosion of this.explosions) explosion.draw(this.ctx);
    for (let arrow of this.arrows) arrow.draw(this.ctx);
    for (let asteroid of this.asteroids) asteroid.draw(this.ctx);
    for (let laser of this.lasers) laser.draw(this.ctx);
    for (let shockwave of this.shockwaves) shockwave.draw(this.ctx);
    
    // Draw new boss projectiles
    if (this.projectiles) {
      for (let projectile of this.projectiles) {
        if (projectile.type === 'asteroid' && projectile.sprite && projectile.sprite.complete) {
          // Draw asteroid sprite with mirroring
          this.ctx.save();
          
          if (projectile.facingLeft) {
            // Mirror the sprite for left-facing asteroids
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(
              projectile.sprite, 
              -(projectile.x + projectile.width), 
              projectile.y, 
              projectile.width, 
              projectile.height
            );
          } else {
            // Draw normally for right-facing asteroids
            this.ctx.drawImage(
              projectile.sprite, 
              projectile.x, 
              projectile.y, 
              projectile.width, 
              projectile.height
            );
          }
          
          this.ctx.restore();
        } else {
          // Fallback to colored rectangle if sprite not loaded
          this.ctx.fillStyle = projectile.color;
          this.ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
        }
        
        // Add visual effects for different projectile types
        if (projectile.type === 'laser') {
          this.ctx.save();
          
          // Translate to laser start position
          this.ctx.translate(projectile.x, projectile.y);
          
          // Rotate based on laser angle
          this.ctx.rotate(projectile.angle);
          
          // Draw laser beam from origin
          this.ctx.shadowColor = '#FF0000';
          this.ctx.shadowBlur = 10;
          this.ctx.fillStyle = '#FF0000';
          this.ctx.fillRect(0, -projectile.width/2, projectile.height, projectile.width);
          
          // Add inner glow
          this.ctx.fillStyle = '#FFAAAA';
          this.ctx.fillRect(2, -projectile.width/2 + 2, projectile.height - 4, projectile.width - 4);
          
          this.ctx.shadowBlur = 0;
          this.ctx.restore();
        }
      }
    }
    
    // Draw ground spikes from boss
    this.enemies.forEach(enemy => {
      if (enemy instanceof BossEnemy && enemy.groundSpikes) {
        enemy.groundSpikes.forEach(spike => {
          if (enemy.spikeSprite && enemy.spikeSprite.complete) {
            // Draw spike sprite
            this.ctx.drawImage(
              enemy.spikeSprite,
              spike.x,
              spike.y,
              spike.width,
              spike.height
            );
          } else {
            // Fallback to colored rectangle if sprite not loaded
            this.ctx.fillStyle = spike.color;
            this.ctx.fillRect(spike.x, spike.y, spike.width, spike.height);
            // Add danger outline
            this.ctx.strokeStyle = '#FF0000';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(spike.x, spike.y, spike.width, spike.height);
          }
        });
      }
    });
    
    // Draw cutscene if active
    if (this.inCutscene) {
      this.drawCutscene();
    } else if (this.gameCompleted) {
      // Draw game completed screen
      this.drawGameCompleted();
    } else if (this.levelComplete) {
      // Draw full-screen level complete (non-pausing, like game over screen)
      this.drawLevelComplete();
    }
    
    // Apply red tint for boss level
    if (this.isBossLevel && this.redTintAlpha > 0) {
      this.ctx.fillStyle = `rgba(255, 0, 0, ${this.redTintAlpha})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    // Restore screen shake transform
    if (this.isBossLevel) {
      this.ctx.restore();
    }
  }

  initInput() {
    window.addEventListener('keydown', e => {
      if (e.code === 'KeyN' && this.levelComplete) {
        if (this.currentLevel === 1) {
          // After level 2, show cutscene (placeholder for existing cutscene)
          this.showLevel3Cutscene();
        } else {
          this.currentLevel++;
          this.loadLevel(this.currentLevel);
        }
        this.levelComplete = false;
      }
      if (e.code === 'KeyR' && (this.gameOver || this.gameCompleted)) {
        this.reset();
      }
      if (e.code === 'KeyP') {
        this.paused = !this.paused;
      }
    });
  }
  
  showLevel3Cutscene() {
    // Start the devil cutscene
    this.inCutscene = true;
    this.cutsceneType = 'devil';
    this.cutsceneTimer = 0;
    this.dialogueIndex = 0;
    
    // Initialize devil sound system
    this.devilSoundTimer = 0;
    this.nextDevilSoundTime = Math.floor(Math.random() * 180) + 180; // 3-6 seconds (180-360 frames at 60fps)
    
    // Show skip cutscene button
    const skipBtn = document.getElementById('skip-cutscene-btn');
    if (skipBtn) {
      skipBtn.style.display = 'block';
      console.log('Skip cutscene button shown');
    } else {
      console.log('Skip cutscene button not found!');
    }
    this.playerRunning = false; // Skip running animation, go straight to dialogue
    this.playerTargetX = 400; // Center of screen
    this._spacePressed = false; // Reset space key state
    
    // Complete devil dialogue sequence
    this.devilDialogue = [
      "I SEE YOU HAVE MADE IT THIS FAR",
      "YOU MUST BE QUITE STRONG",
      "WHAT MIGHT YOUR MOTIVATION BE?",
      "COULD YOU BE AVENGING SOMEONE?",
      "NO, YOUR AURA IS TOO POWERFUL",
      "I SENSE HATRED",
      "I SENSE REVENGE",
      "BUT MOREOVER",
      "...",
      "I SENSE POWER",
      "YOU MUST BE AVENGING YOUR PEOPLE",
      "YOU MUST HAVE LOVED THEM DEEPLY",
      "HOWEVER",
      "...",
      "IN ORDER TO PASS",
      "SACRIFICES MUST BE MADE",
      "THE ALTAR IS WAITING",
      "SACRIFICE ALL BUT THREE LIVES",
      "AND I SHALL LET YOU PASS"
    ];
    
    // Set up video element for canvas drawing only
    if (!this.cutsceneVideo) {
      this.cutsceneVideo = document.createElement('video');
      this.cutsceneVideo.src = 'assets/ui/DoubleEdge Cutscene.mp4';
      this.cutsceneVideo.loop = true;
      this.cutsceneVideo.muted = true; // Muted for autoplay
      this.cutsceneVideo.style.display = 'none'; // Hidden from DOM, only used for canvas drawing
      document.body.appendChild(this.cutsceneVideo);
    }
    
    // Start playing the video (but keep it hidden)
    this.cutsceneVideo.currentTime = 0;
    this.cutsceneVideo.play().catch(e => {
      console.log('Video autoplay prevented:', e);
    });
    
    console.log('Devil cutscene started with', this.devilDialogue.length, 'dialogue lines');
  }
  
  endCutscene() {
    // Clean up video
    if (this.cutsceneVideo) {
      this.cutsceneVideo.pause();
      this.cutsceneVideo.currentTime = 0;
    }
    
    // End cutscene state
    this.inCutscene = false;
    this.cutsceneType = null;
    this.currentLevel = 2; // Set to level 3 (index 2)
    this.loadLevel(this.currentLevel);
    console.log('Cutscene ended, loading level 3');
  }
  
  drawCutscene() {
    if (this.cutsceneType === 'devil') {
      // First, draw the normal background to preserve the UI frame
      if (this.backgroundLoaded) {
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
      } else {
        this.ctx.fillStyle = '#222';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
      
      // Define the inner game viewport area (covering entire game screen)
      const gameViewport = {
        x: 0,  // Start from canvas edge
        y: 0,   // Start from canvas top
        width: this.canvas.width,  // Full canvas width
        height: this.canvas.height // Full canvas height
      };
      
      // Draw video only in the game viewport area
      if (this.cutsceneVideo && this.cutsceneVideo.readyState >= 2) {
        this.ctx.drawImage(
          this.cutsceneVideo, 
          gameViewport.x, gameViewport.y, 
          gameViewport.width, gameViewport.height
        );
      } else {
        // Fallback dark background only in game area
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(gameViewport.x, gameViewport.y, gameViewport.width, gameViewport.height);
      }
      
      // Draw dialogue box (Undertale style)
      if (this.dialogueIndex < this.devilDialogue.length) {
        // Dialogue box background
        this.ctx.save();
        this.ctx.fillStyle = '#000000';
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 4;
        
        const boxX = 50;  // Standard margin from canvas edge
        const boxY = this.canvas.height - 150;  // Position from bottom of canvas
        const boxWidth = this.canvas.width - 100;  // Full canvas width minus margins
        const boxHeight = 100;
        
        // Draw black box with white border
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        // Inner border
        this.ctx.strokeRect(boxX + 8, boxY + 8, boxWidth - 16, boxHeight - 16);
        
        // Dialogue text (centered)
        this.setupPixelArtText(20, '#ffffff');
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const textX = boxX + boxWidth / 2; // Center horizontally
        const textY = boxY + boxHeight / 2;
        
        this.ctx.fillText(this.devilDialogue[this.dialogueIndex], textX, textY);
        
        // Continue prompt (centered at bottom of dialogue box)
        this.setupPixelArtText(14, '#cccccc');
        this.ctx.textAlign = 'center';
        
        // Different prompt for final line
        const isFinalLine = this.dialogueIndex === this.devilDialogue.length - 1;
        const promptText = isFinalLine ? 'Press Q to sacrifice hearts' : 'Press SPACE to continue';
        
        // Make the sacrifice prompt yellow for emphasis
        if (isFinalLine) {
          this.setupPixelArtText(14, '#ffff00'); // Bright yellow
        }
        
        this.ctx.fillText(promptText, this.canvas.width / 2, this.canvas.height - 30);
        
        this.ctx.restore();
      }
    }
  }
  
  loadLevel(levelIndex) {
    // Preserve current weapon, health, and ammo before level transition
    const currentWeapon = this.player ? this.player.weapon : 'sword';
    const currentHearts = this.player ? this.player.hearts : 5;
    const currentAmmo = this.player ? this.player.ammo : 5; // Preserve current ammo
    
    // Set up different levels
    if (levelIndex === 0) {
      // Level 1
      this.player = new Player(100, 475);
      this.platforms = [
        new Platform(0, 550, 800, 50), // Ground
        new Platform(200, 400, 120, 20),
        new Platform(400, 320, 120, 20),
        new Platform(600, 250, 120, 20)
      ];
      this.movingPlatforms = []; // No moving platforms in level 1
      this.hazards = [
        new Hazard(350, 540, 40, 10)
      ];
      this.enemies = [
        new Enemy(600, 475),
        new Enemy(300, 475)
      ];
      this.player.maxHearts = 5;
      this.player.hearts = 5; // Always start level 1 with full health
      
      // Disable boss level effects for level 1
      this.isBossLevel = false;
      this.bossLevelTimer = 0;
    } else if (levelIndex === 1) {
      // Level 2
      this.player = new Player(100, 475);
      this.platforms = [
        new Platform(0, 550, 800, 50), // Ground
        new Platform(300, 350, 100, 20),
        new Platform(500, 280, 100, 20),
        new Platform(650, 200, 100, 20)
      ];
      // Add vertical moving platform as the lowest floating platform
      this.movingPlatforms = [
        new VerticalMovingPlatform(150, 420, 100, 20, 380, 460, 0.4) // Slow vertical movement with tighter bounds
      ];
      this.hazards = [
        new Hazard(250, 540, 40, 10),
        new Hazard(450, 540, 60, 10)
      ];
      this.enemies = [
        new Enemy(500, 475),
        new Enemy(200, 475),
        new Enemy(700, 475)
      ];
      this.player.maxHearts = 8;
      // Add 3 hearts to current health instead of resetting to full
      this.player.hearts = Math.min(currentHearts + 3, this.player.maxHearts);
      
      // Disable boss level effects for level 2
      this.isBossLevel = false;
      this.bossLevelTimer = 0;
      
      // Disable boss level effects for level 2
      this.isBossLevel = false;
      this.bossLevelTimer = 0;
    } else if (levelIndex === 2) {
      // Level 3 - Boss level with dramatic effects
      // Preserve hearts count before creating new player
      const currentHearts = this.player ? this.player.hearts : 3;
      
      this.player = new Player(100, 475);
      this.platforms = [
        new Platform(0, 550, 800, 50), // Ground only
      ];
      
      // All 3 floating platforms are now moving at different speeds and directions
      // Heights adjusted for 2-tile (64px) gaps between platforms
      this.movingPlatforms = [
        new MovingPlatform(150, 386, 120, 20, 0, 800, 1.2), // Bottom - Fast left-right
        new MovingPlatform(350, 302, 120, 20, 0, 800, 0.6), // Middle - Slow left-right (64px gap above bottom)
        new MovingPlatform(550, 218, 120, 20, 0, 800, 0.9)  // Top - Medium left-right (64px gap above middle)
      ];
      
      // Set different starting directions for varied movement
      this.movingPlatforms[0].direction = 1;  // Start moving right
      this.movingPlatforms[1].direction = -1; // Start moving left
      this.movingPlatforms[2].direction = 1;  // Start moving right
      this.hazards = [];
      this.enemies = [
        new BossEnemy(600, 475) // Enhanced boss enemy
      ];
      
      // Set hearts to 5 for level 3 boss fight
      this.player.maxHearts = 5;
      this.player.hearts = Math.min(currentHearts + 2, 5); // Add 2 hearts or cap at 5
      
      // Enable boss level effects
      this.isBossLevel = true;
      this.bossLevelTimer = 0;
    }
    
    this.ladders = []; // No ladders in basic levels
    this.fireballs = [];
    this.iceShards = [];
    this.healingWaves = [];
    this.arrows = [];
    this.explosions = [];
    this.asteroids = [];
    this.lasers = [];
    this.shockwaves = [];
    
    // Clear boss projectiles and attack states
    this.projectiles = [];
    
    // Reset boss attack states for all enemies
    if (this.enemies) {
      this.enemies.forEach(enemy => {
        if (enemy instanceof BossEnemy) {
          // Clear boss attack states
          enemy.groundSpikes = [];
          enemy.laserActive = false;
          enemy.laserBlinking = false;
          enemy.attackExecuted = false;
          enemy.spikeSequence = null;
          enemy.inCooldown = false;
          enemy.attackStage = 0;
          enemy.stageTimer = 0;
          enemy.minionsToSummon = 0;
          enemy.minionsCooldown = 0;
        }
      });
    }
    
    this.levelComplete = false;
    this.gameOver = false;
    this.newWeaponUnlocked = null;
    
    // Preserve weapon and ammo across level transitions
    this.player.weapon = currentWeapon;
    this.player.ammo = currentAmmo; // Restore preserved ammo
    
    // Update UI
    if (this.ui && this.ui.update) this.ui.update();
    if (window.renderWeaponSelector) window.renderWeaponSelector();
  }
  
  updateCutscene() {
    if (this.cutsceneType === 'devil') {
      this.cutsceneTimer++;
      
      // Handle random devil sounds every 3-6 seconds
      this.devilSoundTimer++;
      if (this.devilSoundTimer >= this.nextDevilSoundTime) {
        // Play random devil sound
        if (window.playRandomDevilSound) {
          window.playRandomDevilSound();
        }
        
        // Reset timer and set next random interval (3-6 seconds)
        this.devilSoundTimer = 0;
        this.nextDevilSoundTime = Math.floor(Math.random() * 180) + 180; // 180-360 frames = 3-6 seconds at 60fps
      }
      
      // Skip player running, go straight to dialogue
      if (!this.playerRunning) {
        // Check if we're on the final dialogue line
        const isFinalLine = this.dialogueIndex === this.devilDialogue.length - 1;
        
        if (isFinalLine) {
          // Final line - require Q key to sacrifice hearts
          if (this.input.isDown('KeyQ') && !this._qPressed) {
            this._qPressed = true;
            // Sacrifice hearts (reduce to 3)
            this.player.hearts = 3;
            this.player.maxHearts = 3;
            this.dialogueIndex++;
            this.cutsceneTimer = 0;
            
            if (this.dialogueIndex >= this.devilDialogue.length) {
              // End cutscene, clean up video, start level 3
              this.endCutscene();
            }
          }
          
          // Reset Q press flag when key is released
          if (!this.input.isDown('KeyQ')) {
            this._qPressed = false;
          }
        } else {
          // Normal dialogue lines - use Space key
          if (this.input.isDown('Space') && !this._spacePressed) {
            this._spacePressed = true;
            this.dialogueIndex++;
            this.cutsceneTimer = 0;
          }
          
          // Reset space press flag when key is released
          if (!this.input.isDown('Space')) {
            this._spacePressed = false;
          }
        }
      }
    }
  }

  endCutscene() {
    // Clean up video
    if (this.cutsceneVideo) {
      this.cutsceneVideo.pause();
      this.cutsceneVideo.currentTime = 0;
    }
    
    // Hide skip cutscene button
    const skipBtn = document.getElementById('skip-cutscene-btn');
    if (skipBtn) {
      skipBtn.style.display = 'none';
    }
    
    // End cutscene state
    this.inCutscene = false;
    this.cutsceneType = null;
    this.currentLevel = 2; // Set to level 3 (index 2)
    this.loadLevel(this.currentLevel);
    console.log('Cutscene ended, loading level 3');
  }  updateHeartsDisplay() {
    const heartsContainer = document.getElementById('hearts');
    if (!heartsContainer || !this.player) return;
    
    heartsContainer.innerHTML = '';
    
    for (let i = 0; i < this.player.maxHearts; i++) {
      const heart = document.createElement('div');
      const heartColor = i < this.player.hearts ? '#ff0000' : '#444444';
      
      heart.style.cssText = `
        display: inline-block;
        position: relative;
        width: 20px;
        height: 18px;
        margin: 0 2px;
      `;
      
      // Create heart shape using Unicode heart symbol
      heart.innerHTML = '♥';
      heart.style.fontSize = '20px';
      heart.style.color = heartColor;
      heart.style.textAlign = 'center';
      heart.style.lineHeight = '18px';
      
      heartsContainer.appendChild(heart);
    }
  }
  
  updateAmmoDisplay() {
    const ammoContainer = document.getElementById('ammo-bar');
    if (!ammoContainer || !this.player) return;
    
    ammoContainer.innerHTML = '';
    
    // Create ammo label
    const label = document.createElement('div');
    label.innerHTML = 'AMMO: ';
    label.style.cssText = `
      color: #fff;
      font-family: 'Press Start 2P', 'Courier New', monospace;
      font-size: 12px;
      margin-right: 8px;
      line-height: 20px;
      image-rendering: pixelated;
      -webkit-font-smoothing: none;
      -moz-osx-font-smoothing: grayscale;
      font-smooth: never;
      text-rendering: geometricPrecision;
      font-synthesis: none;
      font-kerning: none;
      font-variant-ligatures: none;
    `;
    ammoContainer.appendChild(label);
    
    // Create ammo bullets
    for (let i = 0; i < this.player.maxAmmo; i++) {
      const bullet = document.createElement('div');
      const bulletColor = i < this.player.ammo ? '#ffff00' : '#444444';
      
      bullet.style.cssText = `
        display: inline-block;
        width: 12px;
        height: 12px;
        margin: 0 1px;
        background: ${bulletColor};
        border: 1px solid #333;
        border-radius: 2px;
      `;
      
      ammoContainer.appendChild(bullet);
    }
  }
}
// --- End of Game class ---

// --- Main Entry Point ---
try {
  window.game = new Game();
  // Automatically focus the game canvas
  const canvas = document.getElementById('gameCanvas');
  if (canvas) {
    canvas.focus();
  }
} catch (error) {
  console.error('Error creating game:', error);
}
