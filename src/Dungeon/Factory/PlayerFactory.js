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
   * @param data
   */
  window.PlayerFactory.prototype.create = function(x, y, spriteKey, scaleX, scaleY, depth, data) {
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
    player.setData('keys', data.keys || 10);

    // Data mappings.
    Object.defineProperties(player, {
      'keys': {
        get: function() {
          return this.getData('keys');
        },
        set: function(val) {
          this.setData('keys', val);
          window.ui.text.key.setText(val);
        }
      }
    });

    return player;
  }
}());
