(function () {
  'use strict';
  var player;
  var keys;
  var playerSpeed = 250;
  var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
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
        { key: 'maze_64', url: './assets/maze_64.png' }
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
    this.load.tilemapTiledJSON('map', 'assets/dungeon.json');
  }

  function create ()
  {
    backgroundLayer = this.add.group();
    objectLayer = this.add.group();
    foregroundLayer = this.add.group();
    player = this.physics.add.sprite(100, 450, 'placeholder');
    player.scaleX = 0.75;
    player.scaleY = 0.75;
    objectLayer.add(player);
    player.x = 150;
    player.y = 2550;
    console.log(player);
    // Figure out why this doesn't work.
//    player.setCollideWorldBounds(true);

    keys = this.input.keyboard.createCursorKeys();

    map = this.make.tilemap({ key: 'map' });
    var tiles = map.addTilesetImage('maze_64');
    var layer = map.createStaticLayer('Tilelaag 1', tiles, 0, 0);

    map.setCollision(1);
    this.physics.add.collider(player, layer);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);

  }

  function update ()
  {
    updateMovement();
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
}());
