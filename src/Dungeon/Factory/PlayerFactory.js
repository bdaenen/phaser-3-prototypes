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
    player.setData('keys', data.keys || 0);

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
   /* var tilesetConfig = window.tilesetConfig[this.scene.tilesetName];
    var tilemap = this.scene.sceneVars.map;
    var moveRange = 1;
    var margin = 5;
    var blocks = this.scene.sceneVars.blocks;

    this.scene.input.keyboard.on('keydown_X', function (event) {
      var nearbyBlocks = [];
      blocks.forEach(function(block){
        // if block is nearby (check margin)
        // nearbyBlocks.push();
        // else, continue.

      }, this);

      // next, loop over nearby blocks and calculate in which direction they should move.
      var playerTilePos = {x: (player.x / tilesetConfig.tileWidth), y: player.y / tilesetConfig.tileHeight};
      console.log(playerTilePos, this.scene.sceneVars.map);
    }, this);*/
  };
}());
