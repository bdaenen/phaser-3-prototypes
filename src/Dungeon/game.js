(function () {
  'use strict';
  var player;
  var inited;
  var keys;
  var playerSpeed = 225;
  var doorKeys;
  var DEPTH_OBJECT = 5;
  var DEPTH_BACKGROUND = 1;
  var DEPTH_FOREGROUND = 10;
  var playerFactory = null;
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

  var cameraMoving = false;
  var movementState = {
    up: false,
    down: false,
    left: false,
    right: false
  };

  /**
   * Preload assets
   */
  function preload ()
  {
    config.files.images.forEach(function(file){
      this.load.image(file.key, file.url);
    }, this);
    this.load.tilemapTiledJSON('map', 'assets/dungeon1_reworked.json');
  }

  /**
   * Main create function
   */
  function create ()
  {
    playerFactory = new window.PlayerFactory(this);
    createPlayer.call(this);
    createTilemap.call(this);

    keys = this.input.keyboard.createCursorKeys();
    createCamera.call(this);
  }

  /**
   * Create the p:ayer object
   */
  function createPlayer() {
    player = playerFactory.create(100, 100, 'placeholder', 0.5, 0.5, DEPTH_OBJECT);
  }

  /**
   * Init the level and player position
   */
  function createTilemap() {
    map = this.make.tilemap({ key: 'map' });
    var tiles = map.addTilesetImage('dungeon');
    var bgLayer = map.createStaticLayer('bg', tiles, 0, 0);
    var collisionLayer = map.createStaticLayer('collision', tiles, 0, 0);
    var tileObjectLayer = map.createDynamicLayer('object', tiles, 0, 0);

    collisionLayer.visible = false;

    collisionLayer.setCollision(tilesetConfig.collision.collision);
    tileObjectLayer.setCollision(tilesetConfig.dungeon.lockedDoors);

    doorKeys = map.createFromObjects('objects', 'key', { key: 'placeholder' });
    doorKeys.forEach(createKey, this);

    this.physics.add.collider(player, collisionLayer);
    this.physics.add.collider(player, tileObjectLayer, objectCollision);

    var spawn = map.createFromObjects('objects', 'spawn', { key: 'placeholder-borderless' });
    spawn = spawn[0];
    if (spawn) {
      player.x = spawn.x;
      player.y = spawn.y;
    }
  }

  /**
   * Camera settings
   */
  function createCamera() {
    this.cameras.main.roundPixels = true;
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  /**
   * Create a key object which can be picked up
   * @param key
   */
  function createKey(key) {
    this.physics.world.enable(key);
    key.visible = true;
    key.setDepth(DEPTH_FOREGROUND);
  }

  /**
   * Callback for picking up a key
   * @param player
   * @param key
   */
  function pickupKey(player, key) {
    player.keys++;
    key.destroy();
  }

  function objectCollision(player, objectTile) {
    var index = objectTile.index;
    if (tilesetConfig.dungeon.lockedDoors.indexOf(index) !== -1 && player.keys > 0) {
      player.keys--;

      // Remove all the tiles on an object layer in a 3x3 square around the opened door.
      // This is required to remove both sides of a door.
      var tiles = objectTile.tilemapLayer.getTilesWithin(objectTile.x - 1, objectTile.y - 1, 3, 3, {isColliding: true});
      tiles.forEach(function(tile){
        tile.tilemapLayer.removeTileAt(tile.x, tile.y);
      }, this);
    }
  }

  /**
   * Main update loop
   */
  function update ()
  {
    // Don't update while the camera scrolls.
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

  /**
   * Update the player's movement state
   */
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

  /**
   * TODO: Only trigger one tween if the player is multiple screens away from 0, 0
   * TODO: This will fix the camera initially scrolling to the spawn as well.
   * @param cam
   * @param scene
   */
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
