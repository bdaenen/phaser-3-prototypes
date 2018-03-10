(function () {
  'use strict';
  var player;
  var inited;
  var keys;
  var playerSpeed = 250;
  var doorKeys;
  var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 544,
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
      //  gravity: { y: 300 },
        debug: true
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    },
    files: {
      images: [
        { key: 'placeholder', url: './assets/placeholder.png' },
        { key: 'placeholder-borderless', url: './assets/placeholder_borderless.png' },
        { key: 'dungeon', url: './assets/dungeon.png' }
      ]
    }
  };
  var game = new Phaser.Game(config);
  var sqrt2 = Math.sqrt(2);
  var map = null;

  var backgroundLayer = null;
  var objectLayer = null;
  var foregroundLayer = null;
  var cameraMoving = false;
  var movementState = {
    up: false,
    down: false,
    left: false,
    right: false
  };

  function preload ()
  {
    config.files.images.forEach(function(file){
      this.load.image(file.key, file.url);
    }, this);
    this.load.tilemapTiledJSON('map', 'assets/dungeon1_reworked.json');
  }

  function create ()
  {
    map = this.make.tilemap({ key: 'map' });
    var tiles = map.addTilesetImage('dungeon');
    var bgLayer = map.createStaticLayer('bg', tiles, 0, 0);
    var collisionLayer = map.createStaticLayer('collision', tiles, 0, 0);
    var tileObjectLayer = map.createStaticLayer('object', tiles, 0, 0);

    collisionLayer.visible = false;
    backgroundLayer = this.add.group();
    objectLayer = this.add.group();
    foregroundLayer = this.add.group();

    player = this.physics.add.sprite(100, 450, 'placeholder');
    player.scaleX = 0.75;
    player.scaleY = 0.75;

    objectLayer.add(player);
    objectLayer.add(tileObjectLayer);
    player.x = 100;
    player.y = 100;

    // Scaling bug?
    player.body.offset.x = 0.20 * player.width;
    player.body.offset.y = 0.20 * player.height;

    keys = this.input.keyboard.createCursorKeys();
    collisionLayer.setCollision(235);
    tileObjectLayer.setCollisionBetween(1, 1000);

    doorKeys = map.createFromObjects('objects', 'key_top', { key: 'placeholder' });
    var spawn = map.createFromObjects('objects', 'spawn', { key: 'placeholder-borderless' });

    spawn.forEach(function(spawnNode){
      spawnNode.visible = false;
    });

    doorKeys.forEach(createKey, this);

    this.physics.add.collider(player, collisionLayer);
    this.physics.add.collider(player, tileObjectLayer);
    this.cameras.main.roundPixels = true;
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);


    spawn = spawn[0];
    if (spawn) {
      player.x = spawn.x;
      player.y = spawn.y;
    }
  }

  function createKey(key) {
    this.physics.world.enable(key);
  }

  function pickupKey(player, key) {
    player.keys = player.keys || 0;
    player.keys++;
    key.destroy();
  }

  function update ()
  {
    if (cameraMoving) {
      player.setVelocityX(0);
      player.setVelocityY(0);
      return;
    }
    updateMovement();
    updateCameraPosition(this.cameras.main, this);

    doorKeys.forEach(function(key){
      this.physics.world.overlap(player, key, pickupKey);
    }, this);

    // After the first update our game was fully "set up".
    inited = true;
  }

  function updateMovement() {
    movementState.up = keys.up.isDown;
    movementState.down = keys.down.isDown;
    movementState.left = keys.left.isDown;
    movementState.right = keys.right.isDown;

    var xVelocity = movementState.left ? -playerSpeed : movementState.right ? playerSpeed : 0;
    var yVelocity = movementState.up ? -playerSpeed : movementState.down ? playerSpeed : 0;

    if (xVelocity && yVelocity) {
      xVelocity /= sqrt2;
      yVelocity /= sqrt2;
    }
    player.setVelocityX(xVelocity);
    player.setVelocityY(yVelocity);
  }

  function updateCameraPosition(cam, scene) {
    var bounds = {
      xMin: cam.scrollX,
      xMax: cam.scrollX + cam.width,
      yMin: cam.scrollY,
      yMax: cam.scrollY + cam.height
    };

    var deltaX = 0;
    var deltaY = 0;
    var tween;

    //cam.x--;
    if (bounds.xMin > player.x) {
      deltaX = -cam.width;
    }
    if (bounds.xMax < player.x) {
      deltaX = cam.width;
    }
    if (bounds.yMin > player.y) {
      deltaY = -cam.height;
    }
    if (bounds.yMax < player.y) {
      deltaY = cam.height;
    }

    if (deltaX) {
      cameraMoving = true;
      tween = scene.tweens.add({
        targets: cam,
        onComplete: function () { cameraMoving = false; },
        props: {
          scrollX: { value: cam.scrollX + deltaX, duration: inited ? 750 : 1, ease: 'Quad.easeOut' }
        },
      });
    }

    if (deltaY) {
      cameraMoving = true;
      tween = scene.tweens.add({
        targets: cam,
        onComplete: function () { cameraMoving = false; },
        props: {
          scrollY: { value: cam.scrollY + deltaY, duration: inited ? 750 : 1, ease: 'Quad.easeOut' }
        },
      });
    }
  }
}());
