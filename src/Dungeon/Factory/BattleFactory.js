(function() {
  'use strict';

  window.BattleFactory = function(scene) {
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
  window.BattleFactory.prototype.createPlayer = function(x, y, spriteKey, scaleX, scaleY, data) {
    var player = this.scene.physics.add.sprite(x, y, spriteKey || 'placeholder');
    player.tint = 0x00FF00;
    data = data || {};
    player.scaleX = scaleX;
    player.scaleY = scaleY;

    player.x = x;
    player.y = y;

    var panel = this.scene.add.image(player.x, player.y + 100, 'placeholder-borderless');
    panel.tint = 0x585858;
    panel.scaleX = 6;
    panel.scaleY = 3;

    player.ui = {
      panel: panel,
      healthText: this.scene.add.text(panel.x - 125, panel.y - 20, 'Health: 0'),
      grooveText: this.scene.add.text(panel.x - 125, panel.y, 'Groove: 0'),
      atbText: this.scene.add.text(panel.x - 125, panel.y + 20, 'ATB: 0/0')
    };

    player.setDataEnabled();
    this.bindDataMappings(player);
    player.groove = data.groove || 1;
    player.health = data.health || 200;

    return player;
  };

  window.BattleFactory.prototype.bindDataMappings = function(obj) {
    // Data mappings.
    Object.defineProperties(obj, {
      'groove': {
        get: function() {
          return this.getData('groove');
        },
        set: function(val) {
          this.setData('groove', val);
          this.ui && this.ui.grooveText && this.ui.grooveText.setText('Groove: ' + this.getData('groove'));
        }
      }
    });

    Object.defineProperties(obj, {
      'health': {
        get: function() {
          return this.getData('health');
        },
        set: function(val) {
          this.setData('health', val);
          this.ui && this.ui.healthText && this.ui.healthText.setText('Health: ' + this.getData('health'));
        }
      }
    });

    Object.defineProperties(obj, {
      'ATB': {
        get: function() {
          return this.getData('ATB');
        },
        set: function(val) {
          this.setData('ATB', val);
          this.ui && this.ui.atbText && this.ui.atbText.setText('ATB: ' + this.getData('ATB'));
        }
      }
    });
  }

}());
