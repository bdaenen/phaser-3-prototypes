(function() {
  'use strict';

  window.PlayerFactory = function(scene) {
    this.scene = scene;
  };

  /**
   * @param x
   * @param y
   * @param spriteKey
   * @param scaleX
   * @param scaleY
   * @param depth
   * @param ui
   * @param data
   */
  window.PlayerFactory.prototype.create = function(x, y, spriteKey, scaleX, scaleY, depth, ui, data) {
    var player = this.scene.physics.add.sprite(x, y, spriteKey || 'placeholder');
    data = data || {};
    player.scaleX = scaleX;
    player.scaleY = scaleY;

    player.x = x;
    player.y = y;

    if (depth) {
      player.setDepth(depth);
    }

    player.setDataEnabled();
    player.setData('keys', data.keys || 9);

    // Data mappings.
    Object.defineProperties(player, {
      'keys': {
        get: function() {
          return this.getData('keys');
        },
        set: function(val) {
          this.setData('keys', val);
          ui.text.key.setText(val);
        }
      }
    });

    this.initEvents(player);

    return player;
  };

  window.PlayerFactory.prototype.initEvents = function(player) {
    var tilesetConfig = window.tilesetConfig[this.scene.tilesetName];
    var tilemap = this.scene.sceneVars.map;
    var margin = 5;
    var moveRange = tilesetConfig.tileWidth + margin;

    this.scene.input.keyboard.on('keydown_X', function (event) {
      var blocks = this.scene.sceneVars.blocks;
      var nearbyBlocks = [];
      var rect = new Phaser.Geom.Rectangle(player.x - moveRange, player.y - moveRange, moveRange*2, moveRange*2);
      blocks.forEach(function(block){
        if (rect.contains(block.x, block.y)) {
          nearbyBlocks.push(block);
        }
      }, this);

      console.log(nearbyBlocks);
      // next, loop over nearby blocks and calculate in which direction they should move.
      nearbyBlocks.forEach(function(block){
        var deltaX = block.x - player.x;
        var deltaY = block.y - player.y;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 0) {
            block.x += tilesetConfig.tileWidth;
          }
          else if (deltaX < 0) {
            block.x -= tilesetConfig.tileWidth;
          }
        }
        else if (Math.abs(deltaY) > Math.abs(deltaX)) {
          if (deltaY > 0) {
            block.y += tilesetConfig.tileHeight;
          }
          else if (deltaY < 0) {
            block.y -= tilesetConfig.tileHeight;
          }
        }


      }, this);
      var playerTilePos = {x: (player.x / tilesetConfig.tileWidth), y: player.y / tilesetConfig.tileHeight};
    }, this);
  };
}());
