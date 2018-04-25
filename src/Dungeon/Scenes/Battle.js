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
    var buttonW = 128;
    var buttonH = 64;

    ui.graphics = {};
    ui.graphics.attack = this.add.sprite(atkX, atkY, 'placeholder-borderless');
    ui.graphics.attack.tint = 0x585858;
    ui.graphics.attack.displayWidth = buttonW;
    ui.graphics.defend = this.add.sprite(atkX + ui.graphics.attack.displayWidth + 30, atkY, 'placeholder-borderless');
    ui.graphics.defend.tint = 0x585858;
    ui.graphics.defend.displayWidth = buttonW;


    ui.text = {};
    ui.text.attack = this.add.text(ui.graphics.attack.x, ui.graphics.attack.y, 'Attack', { fontFamily: 'Arial', fontSize: 24, color: '#FFFFFF' });
    ui.text.attack.x -= ui.text.attack.width / 2;
    ui.text.attack.y -= ui.text.attack.height / 2;

    ui.text.defend = this.add.text(ui.graphics.defend.x, ui.graphics.defend.y, 'Defend', { fontFamily: 'Arial', fontSize: 24, color: '#FFFFFF' });
    ui.text.defend.x -= ui.text.defend.width / 2;
    ui.text.defend.y -= ui.text.defend.height / 2;

    ui.buttons = [];
    ui.buttons.push({box: ui.graphics.attack, text: ui.text.attack});
    ui.buttons.push({box: ui.graphics.defend, text: ui.text.defend});

    ui.vars = {
      buttonW: buttonW,
      buttonH: buttonH
    };

    this.input.keyboard.on('keydown_LEFT', function (event) {
        ui.vars.activeIndex = Math.max(0, ui.vars.activeIndex-1);
    });

    this.input.keyboard.on('keydown_RIGHT', function (event) {
        ui.vars.activeIndex = Math.min(ui.buttons.length-1, ui.vars.activeIndex+1);
    });

    this.input.keyboard.on('keydown_ENTER', function(event) {
        this.activateSelectedMenuItem();
    }, this);
  };


  Battle.defend = function() {
    console.warn('Defending is not yet implemented');
  };

  /**
   *
   */
  Battle.activateSelectedMenuItem = function() {
    if (this.sceneVars.ui.activeIndex === 0) {
      this.scene.pause();
      this.scene.launch('drums');
    }
    if (this.sceneVars.ui.activeIndex === 1) {
      // Defend
      console.warn('Not Yet Implemented');
    }
    if (this.sceneVars.ui.activeIndex === 2) {
      // Run
      console.warn('Not Yet Implemented');
    }
  };

  /**
   * Main update loop
   */
  Battle.update = function() {
    this.updateUi();
  };

  /**
   * Update UI
   */
  Battle.updateUi = function() {
    var ui = sceneVars.ui;

    if (ui.vars.activeIndex === undefined) {
      ui.vars.activeIndex = 0;
    }

    var activeBox = ui.buttons[ui.vars.activeIndex].box;
    var activeText = ui.buttons[ui.vars.activeIndex].text;

    ui.buttons.forEach(function(btn){
      btn.box.tint = 0x585858;
    });
    activeBox.tint = 0x0058FF;
  };

  window.BattleScene = Battle;
}());
