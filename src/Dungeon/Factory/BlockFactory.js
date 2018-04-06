(function() {
  'use strict';

  window.BlockFactory = function(scene) {
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
  window.BlockFactory.prototype.create = function(x, y, spriteKey, scaleX, scaleY, depth, data) {
    var block = this.scene.physics.add.sprite(x, y, spriteKey || 'placeholder');
    data = data || {};
    block.scaleX = scaleX;
    block.scaleY = scaleY;

    block.x = x;
    block.y = y;

    if (depth) {
      block.setDepth(depth);
    }

    block.setDataEnabled();
    block.setData('keys', data.keys || 0);

    return block;
  }
}());
