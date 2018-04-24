(function () {
  'use strict';
  var Battle = new Phaser.Scene('Battle');
  var DEPTH_OBJECT = 5;
  var DEPTH_BACKGROUND = 1;
  var DEPTH_FOREGROUND = 10;
  var sceneVars = {
    movementState: {},
    assets: {},
    ui: {},
    enemies: []
  };

  Battle.sceneVars = sceneVars;

  /**
   * @type {{images: [null,null,null,null], spritesheet: [null]}}
   */
  sceneVars.assets = {
    images: [
      { key: 'placeholder', url: 'placeholder.png' },
      { key: 'placeholder-borderless', url: 'placeholder_borderless.png' },
      { key: 'key', url: 'key.png' }
    ]
  };

  Battle.tilesetName = 'dungeon';

  /**
   *
   */
  Battle.preload = function() {
    this.load.setPath('./assets/');
    sceneVars.assets.images.forEach(function(file){
      this.load.image(file.key, file.url);
    }, this);
  };

  /**
   * Main create function
   */
  Battle.create = function() {
    sceneVars.keys = this.input.keyboard.createCursorKeys();
    this.createUi();
  };

  /**
   *
   */
  Battle.createUi = function() {
    var ui = sceneVars.ui;
    var atkX = 100;
    var atkY = 450;
    var atkW = 128;
    var atkH = 64;

    ui.graphics = {};
    ui.graphics.attack = this.add.graphics();
    ui.graphics.attack.fillStyle(0x000000);
    ui.graphics.attack.fillRect(atkX, atkY, atkW, atkH);
    ui.graphics.attack.lineStyle(2, 0xFFFFFF);
    ui.graphics.attack.strokeRect(atkX, atkY, atkW, atkH);

    ui.graphics.defend = this.add.graphics();
    ui.graphics.defend.fillStyle(0x000000);
    ui.graphics.defend.fillRect(atkX + atkW + 30, atkY, atkW, atkH);
    ui.graphics.defend.lineStyle(2, 0xFFFFFF);
    ui.graphics.defend.strokeRect(atkX + atkW + 30, atkY, atkW, atkH);


    ui.text = {};
    ui.text.attack = this.add.text(atkX + 30, atkY + 18, 'Attack', { fontFamily: 'Arial', fontSize: 24, color: '#FFFFFF' });
    ui.text.defend = this.add.text(atkX + atkW + 55, atkY + 18, 'Defend', { fontFamily: 'Arial', fontSize: 24, color: '#FFFFFF' });

    ui.buttons = [];
    ui.buttons.push({box: ui.graphics.attack, text: ui.text.attack});
    ui.buttons.push({box: ui.graphics.defend, text: ui.text.defend});

    ui.vars = {};
  };

  /**
   * Main update loop
   */
  Battle.update = function() {
    this.updateUi();
  };

  Battle.updateUi = function() {
    var ui = sceneVars.ui;

    if (ui.vars.activeIndex === undefined) {
      ui.vars.activeIndex = 0;
    }

    var activeBox = ui.buttons[ui.vars.activeIndex].box;
    var activeText = ui.buttons[ui.vars.activeIndex].text;

    ui.buttons.forEach(function(btn){
      btn.box.lineStyle(2, 0xFFFFFF);
      //btn.text.lineStyle(2, 0xFFFFFF);
    });

    activeBox.lineStyle(2, 0x00FF00);
  };


  window.BattleScene = Battle;
}());
