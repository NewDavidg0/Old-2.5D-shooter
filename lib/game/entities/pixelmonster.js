ig.baked = true;
ig.module('game.entities.pixelmonster').requires('plugins.twopointfive.entity', 'game.entities.particle', 'game.entities.pixelmonsterbabies').defines(function() {
    EntityPixelmonster = tpf.Entity.extend({
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.ACTIVE,
        size: {
            x: 80,
            y: 70
        },
        friction: {
            x: 100,
            y: 100
        },
        scale: 0.75,
        health: 30,
        damage: 20,
        dynamicLight: true,
        _wmBoxColor: '#ff0000',
        angle: 0,
        speed: 120,
        injump: false,
        didHurtPlayer: false,
        seenPlayer: false,
        gotHit: false,
        gotHit2: false,
        gotHit3: false,
        animSheet: new ig.AnimationSheet('media/pixelmonster.png', 85, 70),
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            var crawFrameTime = 0.04 + Math.random() * 0.02;
            this.hitCounter = 0;
            this.addAnim('crawl', 0.1, [0, 1, 2, 3]);
            this.addAnim('hurt1', 0.1, [4, 5, 6, 7]);
            this.addAnim('hurt2', 0.1, [8, 9, 10, 11]);
            this.addAnim('hurt3', 0.1, [12, 13, 14, 15]);
            this.currentAnim.gotoRandomFrame();
            this.hurtTimer = new ig.Timer();
        },
        update: function() {
            this.angle = this.angleTo(ig.game.player);
            this.vel.x = Math.cos(this.angle) * this.speed;
            this.vel.y = Math.sin(this.angle) * this.speed;
            var newHurtTimer = null;
            if (this.gotHit) {
                this.currentAnim = this.anims.hurt1;
                if (this.gotHit2) {
                    this.currentAnim = this.anims.hurt2;
                    if (this.gotHit3) {
                        this.currentAnim = this.anims.hurt3;
                    }
                }
            } else {
                this.currentAnim = this.anims.crawl;
            }
            if (ig.game.dead) {
                this.vel.x *= -1;
                this.vel.y *= -1;
            }
            this.parent();
        },
        receiveDamage: function(value) {
            if (this.gotHit) {
                if (this.gotHit2) {
                    this.gotHit3 = true;
                }
                this.gotHit2 = true;
            }
            this.gotHit = true;
            this.parent(value);
            for (var i = 0; i < 10; i++) {
                ig.game.spawnEntity(EntityEnemyBlood, this.pos.x, this.pos.y + 32);
            }
        },
        kill: function() {
            var cx = this.pos.x + this.size.x / 2;
            var cy = this.pos.y + this.size.y / 2;
            for (var i = 0; i < 20; i++) {
                ig.game.spawnEntity(EntityEnemyBlood, cx, cy);
            }
            for (var i = 0; i < 4; i++) {
                ig.game.spawnEntity(EntityPixelmonsterbabies, this.pos.x, this.pos.y + 32);
            }
            ig.game.blobKillCount++;
            this.parent();
        },
        check: function(other) {
            if (this.hurtTimer.delta() < 0) {
                return;
            }
            this.hurtTimer.set(1);
            this.vel.x = -this.vel.x;
            this.vel.y = -this.vel.y;
            other.receiveDamage(this.damage, this);
        }
    });
    EntityEnemyBlood = EntityParticle.extend({
        vpos: 0,
        scale: 0.5,
        initialVel: {
            x: 50,
            y: 50,
            z: 2.5
        },
        particles: 25,
        lifetime: 2,
        animSheet: new ig.AnimationSheet('media/blood.png', 16, 16),
        init: function(x, y, settings) {
            this.addAnim('idle', 5, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
            this.parent(x, y, settings);
        }
    });
});