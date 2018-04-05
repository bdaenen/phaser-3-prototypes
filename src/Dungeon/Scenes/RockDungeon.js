(function () {
  'use strict';
  var RockDungeon = new Phaser.Scene('RockDungeon');
  var playerFactory = new window.PlayerFactory(this);
  var DEPTH_OBJECT = 5;
  var DEPTH_BACKGROUND = 1;
  var DEPTH_FOREGROUND = 10;
  var sceneVars = {
    movementState: {},
    map: null,
    player: null,
    keys: null,
    doorKeys: null,
    assets: {},
    ui: {},
    playerSpeed: 225,
    sqrt2: Math.sqrt(2),
    cameraMoving: false
  };

  RockDungeon.sceneVars = sceneVars;

  /**
   * @type {{images: [null,null,null,null], spritesheet: [null]}}
   */
  sceneVars.assets = {
    images: [
      { key: 'placeholder', url: 'placeholder.png' },
      { key: 'placeholder-borderless', url: 'placeholder_borderless.png' },
      { key: 'dungeon', url: 'dungeon.png' },
      { key: 'key', url: 'key.png' }
    ],
    spritesheet: [
      { key: 'dungeon-sprite', url: 'dungeon.png', config: { frameWidth: 32, frameHeight: 32 } }
    ]
  };

  RockDungeon.tilesetName = 'dungeon';

  /**
   *
   */
  RockDungeon.preload = function() {
    this.load.setPath('./assets/');
    sceneVars.assets.images.forEach(function(file){
      this.load.image(file.key, file.url);
    }, this);
    sceneVars.assets.spritesheet.forEach(function(file){
      this.load.spritesheet(file.key, file.url, file.config);
    }, this);

    this.load.tilemapTiledJSON('map', 'dungeon1_reworked.json');
  };

  /**
   * Main create function
   */
  RockDungeon.create = function() {
    playerFactory = new window.PlayerFactory(this);
    this.createPlayer();
    this.createTilemap();

    sceneVars.keys = this.input.keyboard.createCursorKeys();
    this.createCamera();
    this.createUi();
  };

  /**
   *
   */
  RockDungeon.createPlayer = function() {
    sceneVars.player = playerFactory.create(100, 100, 'placeholder', 0.5, 0.5, DEPTH_OBJECT, sceneVars.ui);
  };

  /**
   *
   */
  RockDungeon.createTilemap = function() {
    sceneVars.map = this.make.tilemap({ key: 'map' });
    var tiles = sceneVars.map.addTilesetImage(this.tilesetName);
    var bgLayer = sceneVars.map.createStaticLayer('bg', tiles, 0, 0);
    var collisionLayer = sceneVars.map.createStaticLayer('collision', tiles, 0, 0);
    var tileObjectLayer = sceneVars.map.createDynamicLayer('object', tiles, 0, 0);

    collisionLayer.visible = false;

    collisionLayer.setCollision(tilesetConfig.collision.collision);
    tileObjectLayer.setCollision(tilesetConfig[this.tilesetName].lockedDoors);
    tileObjectLayer.setCollision(tilesetConfig[this.tilesetName].puzzleDoors);

    sceneVars.doorKeys = sceneVars.map.createFromObjects('objects', 'key', { key: 'key' });
    sceneVars.doorKeys.forEach(createKey, this);

    sceneVars.blockPads = sceneVars.map.createFromObjects('objects', 'blockPad', {key: 'dungeon-sprite', frame: tilesetConfig[this.tilesetName].blockPad});
    sceneVars.blockPads.forEach(createBlockPad, this);
    sceneVars.blocks = sceneVars.map.createFromObjects('objects', 'block', {key: 'dungeon-sprite', frame: tilesetConfig[this.tilesetName].block});
    sceneVars.blocks.forEach(createBlock, this);

    this.physics.add.collider(sceneVars.player, collisionLayer);
    this.physics.add.collider(sceneVars.player, tileObjectLayer, this.objectCollision, null, this);
    this.physics.add.collider(sceneVars.blocks, sceneVars.blocks);
    this.physics.add.collider(sceneVars.blocks, collisionLayer);
    this.physics.add.collider(sceneVars.player, sceneVars.blocks);

    var spawn = sceneVars.map.createFromObjects('objects', 'spawn', { key: 'placeholder-borderless' });
    spawn = spawn[0];
    if (spawn) {
      sceneVars.player.x = spawn.x;
      sceneVars.player.y = spawn.y;
    }
  };

  /**
   * Camera settings
   */
  RockDungeon.createCamera = function() {
    this.cameras.main.roundPixels = true;
    this.cameras.main.setBounds(0, 0, sceneVars.map.widthInPixels, sceneVars.map.heightInPixels);
  };

  /**
   *
   */
  RockDungeon.createUi = function() {
    var ui = sceneVars.ui;
    ui.text = {};
    ui.text.key = this.add.text(this.cameras.main.width - 48, 0, '0', { fontFamily: 'Arial', fontSize: 24, color: '#FFFFFF' });
    ui.text.key.setStroke('#000', 6);
    ui.text.key.setScrollFactor(0);

    ui.sprites = {};
    ui.sprites.key = this.add.sprite(ui.text.key.x + 32, ui.text.key.y + 17, 'key');
    ui.sprites.key.setScrollFactor(0);
  };

  /**
   * Create a key object which can be picked up
   * @param key
   */
  function createKey (key) {
    this.physics.world.enable(key);
    key.visible = true;
    key.setDepth(DEPTH_FOREGROUND);
  }

  /**
   * Create a key object which can be picked up
   * @param block
   */
  function createBlock(block) {
    this.physics.world.enable(block);
    block.setDepth(DEPTH_FOREGROUND);
    block.body.setImmovable(true);
  }

  /**
   * Create a key object which can be picked up
   * @param blockPad
   */
  function createBlockPad(blockPad) {
    this.physics.world.enable(blockPad);
    blockPad.setDepth(DEPTH_BACKGROUND);
  }

  /**
   * Callback for picking up a key
   * @param player
   * @param key
   */
  function pickupKey (player, key) {
    sceneVars.player.keys++;
    key.destroy();
  }

  /**
   * @param player
   * @param objectTile
   */
  RockDungeon.objectCollision = function(player, objectTile) {
    var index = objectTile.index;
    debugger;
    if (window.tilesetConfig[this.tilesetName].lockedDoors.indexOf(index) !== -1 && sceneVars.player.keys > 0) {
      sceneVars.player.keys--;

      // Remove all the tiles on an object layer in a 3x3 square around the opened door.
      // This is required to remove both sides of a door.
      var tiles = objectTile.tilemapLayer.getTilesWithin(objectTile.x - 1, objectTile.y - 1, 3, 3, {isColliding: true});
      tiles.forEach(function(tile){
        tile.tilemapLayer.removeTileAt(tile.x, tile.y);
      }, this);
    }
    else if (window.tilesetConfig[this.tilesetName].puzzleDoors.indexOf(index) !== -1 && sceneVars.player.keys > 0) {

    }
  };

  /**
   * Main update loop
   */
  RockDungeon.update = function() {
    // Don't update while the camera scrolls.
    if (sceneVars.cameraMoving) {
      sceneVars.player.setVelocityX(0);
      sceneVars.player.setVelocityY(0);
      return;
    }

    updateMovement();
    updateCameraPosition(this.cameras.main, this);

    sceneVars.doorKeys.forEach(function(key){
      this.physics.world.overlap(sceneVars.player, key, pickupKey);
    }, this);


    // This is handled by the player's input events for now
    //this.updateSkills();

    // After the first update our game was fully "set up".
    sceneVars.inited = true;
  };

  /*RockDungeon.updateSkills = function() {
    var player = sceneVars.player;
    var blocks = sceneVars.blocks;

  };*/

  /**
   * Update the player's movement state
   */
  function updateMovement() {
    var movementState = sceneVars.movementState;
    var keys = sceneVars.keys;
    var playerSpeed = sceneVars.playerSpeed;

    movementState.up = keys.up.isDown;
    movementState.down = keys.down.isDown;
    movementState.left = keys.left.isDown;
    movementState.right = keys.right.isDown;

    var xVelocity = movementState.left ? -playerSpeed : movementState.right ? playerSpeed : 0;
    var yVelocity = movementState.up ? -playerSpeed : movementState.down ? playerSpeed : 0;

    if (xVelocity && yVelocity) {
      xVelocity /= sceneVars.sqrt2;
      yVelocity /= sceneVars.sqrt2;
    }
    sceneVars.player.setVelocityX(xVelocity);
    sceneVars.player.setVelocityY(yVelocity);
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

    if (bounds.xMin > sceneVars.player.x) {
      deltaX = -cam.width;
    }
    if (bounds.xMax < sceneVars.player.x) {
      deltaX = cam.width;
    }
    if (bounds.yMin > sceneVars.player.y) {
      deltaY = -cam.height;
    }
    if (bounds.yMax < sceneVars.player.y) {
      deltaY = cam.height;
    }

    if (deltaX) {
      sceneVars.cameraMoving = true;
      tween = scene.tweens.add({
        targets: cam,
        onComplete: function () { sceneVars.cameraMoving = false; },
        props: {
          scrollX: { value: cam.scrollX + deltaX, duration: sceneVars.inited ? 750 : 1, ease: 'Quad.easeOut' }
        },
      });
    }

    if (deltaY) {
      sceneVars.cameraMoving = true;
      tween = scene.tweens.add({
        targets: cam,
        onComplete: function () { sceneVars.cameraMoving = false; },
        props: {
          scrollY: { value: cam.scrollY + deltaY, duration: sceneVars.inited ? 750 : 1, ease: 'Quad.easeOut' }
        },
      });
    }
  }


  window.RockDungeonScene = RockDungeon;
}());
