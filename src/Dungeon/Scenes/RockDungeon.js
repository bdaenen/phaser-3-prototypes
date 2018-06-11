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
    cameraMoving: false,
    blocksInRoom: [],
    blockPadsInRoom: [],
    roomSolved: false,
    blockPadsSolvedInRoomCount: 0,
    enemies: null
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
      { key: 'key', url: 'key.png' },
      {key: 'snare', url: 'snare-ui.png'}
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
    sceneVars.tilemapBgLayer = bgLayer;

    var collisionLayer = sceneVars.map.createStaticLayer('collision', tiles, 0, 0);
    sceneVars.tilemapCollisionLayer = collisionLayer;

    var tileObjectLayer = sceneVars.map.createDynamicLayer('object', tiles, 0, 0);
    sceneVars.tilemapObjectLayer = tileObjectLayer;

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

    sceneVars.enemies = sceneVars.map.createFromObjects('objects', 'enemy', {key: 'key'});
    sceneVars.enemies.forEach(createEnemy, this);

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
    ui.text.key = this.add.text(this.cameras.main.width - 48, this.cameras.main.height - 40, '0', { fontFamily: 'Arial', fontSize: 24, color: '#FFFFFF' });
    ui.text.key.setStroke('#000', 6);
    ui.text.key.setScrollFactor(0);

    ui.text.snare = this.add.text(this.cameras.main.width - 128, this.cameras.main.height - 40, 'X', { fontFamily: 'Arial', fontSize: 24, color: '#FFFFFF' });
    ui.text.snare.setStroke('#000', 6);
    ui.text.snare.setScrollFactor(0);

    ui.sprites = {};
    ui.sprites.key = this.add.sprite(ui.text.key.x + 32, ui.text.key.y + 17, 'key');
    ui.sprites.key.setScrollFactor(0);

    ui.sprites.snare = this.add.sprite(ui.text.snare.x - 20, ui.text.snare.y + 17, 'snare');
    ui.sprites.snare.setScrollFactor(0);
    ui.sprites.snare.scaleX = 0.75;
    ui.sprites.snare.scaleY = 0.75;
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

  function createEnemy(enemy) {
    this.physics.world.enable(enemy);
    enemy.visible = true;
  }

  function markBlockPadDown(block, blockPad) {
    if (!blockPad.isPushed) {
      blockPad.isPushed = true;
      blockPad.pushedBy = block;
    }
  }

  function markBlockPadUp (block, blockPad) {

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

    updateCameraPosition(this.cameras.main, this);
    updateMovement();

    sceneVars.doorKeys.forEach(function(key){
      this.physics.world.overlap(sceneVars.player, key, pickupKey);
    }, this);

    sceneVars.enemies.forEach(function(enemy){
      this.physics.world.overlap(sceneVars.player, enemy, startBattleScene, null, this);
    }, this);

    // This is handled by the player's input events for now
    //this.updateSkills();

    updateBlockState.call(this);

    if (!sceneVars.roomSolved) {
      updateRoomSolved.call(this);
      if (sceneVars.roomSolved) {
        solveRoom.call(this);
      }
    }

    if (this.registry.get('drumsSucceeded')) {
      sceneVars.ui.sprites.snare.tint = 0x00AA00;
    }
    else {
      sceneVars.ui.sprites.snare.tint = 0xFFFFFF;
    }

    // After the first update our game was fully "set up".
    sceneVars.inited = true;
  };

  /*RockDungeon.updateSkills = function() {
    var player = sceneVars.player;
    var blocks = sceneVars.blocks;
  };*/

  function updateBlockState() {
    var blockPadsInRoom = sceneVars.blockPadsInRoom;
    var blocksInRoom = sceneVars.blocksInRoom;

    blockPadsInRoom.splice(0, blockPadsInRoom.length);
    blocksInRoom.splice(0, blocksInRoom.length);

    sceneVars.blockPads.forEach(function(pad) {
      pad.isPushed = false;
      pad.pushedBy = null;
      if (sceneVars.cameraBounds.contains(pad.x, pad.y)) {
        blockPadsInRoom.push(pad);
      }
    });
    sceneVars.blocks.forEach(function(block){
      if (sceneVars.cameraBounds.contains(block.x, block.y)) {
        blocksInRoom.push(block);
      }
    });

    // TODO: refactor "count" to sceneVars.roomBlockPadSolvedCount
    sceneVars.blockPadsSolvedInRoomCount = 0;
    blockPadsInRoom.forEach(function(pad) {
      blocksInRoom.forEach(function(block) {
        var padBounds = pad.body.getBounds({});
        var rect = new Phaser.Geom.Rectangle(padBounds.x, padBounds.y, padBounds.right - padBounds.x, padBounds.bottom - padBounds.y);
        if (rect.contains(block.x, block.y)) {
          sceneVars.blockPadsSolvedInRoomCount++;
          pad.isPushed = true;
          pad.pushedBy = block;
        }
      });
    });
  }

  function updateRoomSolved() {
    if (sceneVars.blockPadsInRoom.length) {
      sceneVars.roomSolved = (sceneVars.blockPadsSolvedInRoomCount === sceneVars.blockPadsInRoom.length);
    }
  }

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

    sceneVars.cameraBounds = new Phaser.Geom.Rectangle(bounds.xMin, bounds.yMin, bounds.xMax - bounds.xMin, bounds.yMax - bounds.yMin);

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
        }
      });
    }

    if (deltaY) {
      sceneVars.cameraMoving = true;
      tween = scene.tweens.add({
        targets: cam,
        onComplete: function () { sceneVars.cameraMoving = false; },
        props: {
          scrollY: { value: cam.scrollY + deltaY, duration: sceneVars.inited ? 750 : 1, ease: 'Quad.easeOut' }
        }
      });
    }

    if (tween) {
      // Reset room solving.
      sceneVars.roomSolved = false;
    }
  }

  function solveRoom () {
    var tilesToCheck = sceneVars.tilemapObjectLayer.getTilesWithinWorldXY(
      sceneVars.cameraBounds.x - 1,
      sceneVars.cameraBounds.y - 1,
      sceneVars.cameraBounds.width + 1,
      sceneVars.cameraBounds.height + 1,
      {isColliding: true}
    );

    var tilesetConfig = window.tilesetConfig[this.tilesetName];

    tilesToCheck.forEach(function(tile){
      if (tilesetConfig.puzzleDoors.indexOf(tile.index) !== -1) {
        tile.tilemapLayer.removeTileAt(tile.x, tile.y);
      }
    }, this);
    sceneVars.roomSolved = true;
  }

  function startBattleScene() {
    this.scene.launch('Battle', {transitionTo: this});
    this.scene.pause();
  }

  window.RockDungeonScene = RockDungeon;
}());
