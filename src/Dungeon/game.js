(function () {
  'use strict';
  var player;
  var keys;
  var playerSpeed = 250;
  var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
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
        { key: 'placeholder-borderless', url: './assets/placeholder_borderless.png' }
        { key: 'maze64', url: './assets/maze_64.png' }
      ]
    }
  };
  var game = new Phaser.Game(config);
  var sqrt2 = Math.sqrt(2);

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
  }

  function create ()
  {
    backgroundLayer = this.add.group();
    objectLayer = this.add.group();
    foregroundLayer = this.add.group();
    player = this.physics.add.sprite(100, 450, 'placeholder');
    objectLayer.add(player);
    player.setCollideWorldBounds(true);
    keys = this.input.keyboard.createCursorKeys();

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