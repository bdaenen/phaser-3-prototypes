(function () {
  'use strict';
  var player;
  var keys;
  var playerSpeed = 250;
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
    collisionLayer.visible = false;
    backgroundLayer = this.add.group();
    objectLayer = this.add.group();
    foregroundLayer = this.add.group();
    player = this.physics.add.sprite(100, 450, 'placeholder');
    player.scaleX = 0.75;
    player.scaleY = 0.75;

    console.log(player);

    objectLayer.add(player);
    player.x = 100;
    player.y = 100;

    // Scaling bug?
    player.body.offset.x = 0.20 * player.width;
    player.body.offset.y = 0.20 * player.height;

    keys = this.input.keyboard.createCursorKeys();
    collisionLayer.setCollision(235);
    var doorKeys = map.createFromObjects('objects', 4, { key: 'placeholder' });
    var spawn = map.createFromObjects('objects', 2, { key: 'placeholder_borderless' });

    this.physics.add.collider(player, collisionLayer);
    this.cameras.main.roundPixels = true;
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    //this.cameras.main.startFollow(player);

  }

  function update ()
  {
    updateMovement();
    updateCameraPosition(this.cameras.main);
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

  function updateCameraPosition(cam) {
    var bounds = {
      xMin: cam.scrollX,
      xMax: cam.scrollX + cam.width,
      yMin: cam.scrollY,
      yMax: cam.scrollY + cam.height
    };
    //cam.x--;
    if (bounds.xMin > player.x) {
      cam.scrollX -= cam.width;
    }
    if (bounds.xMax < player.x) {
      cam.scrollX+= cam.width;
    }
    if (bounds.yMin > player.y) {
      cam.scrollY -= cam.height;
    }
    if (bounds.yMax < player.y) {
      cam.scrollY += cam.height;
    }
  }
}());
