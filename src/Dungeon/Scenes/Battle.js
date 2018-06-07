(function () {
  'use strict';
  var Battle = new Phaser.Scene('Battle');
  var DEPTH_OBJECT = 5;
  var DEPTH_BACKGROUND = 1;
  var DEPTH_FOREGROUND = 10;
  var sceneVars = {
    movementState: {},
    ui: {},
    enemies: [],
    sounds: {}
  };

  Battle.sceneVars = sceneVars;

  Battle.tilesetName = 'dungeon';

  /**
   *
   */
  Battle.preload = function() {
    this.load.setPath('./assets/');
    [
      {key: 'placeholder', url: 'placeholder.png'},
      {key: 'placeholder-borderless', url: 'placeholder_borderless.png'},
      {key: 'key', url: 'key.png'}
    ].forEach(function(file){
      this.load.image(file.key, file.url);
    }, this);

    this.load.audio('base', 'audio/itc/base.wav');
    this.load.audio('transition', 'audio/itc/transition.wav');
    this.load.audio('ability', 'audio/itc/ability.wav');
  };

  /**
   * Main create function
   */
  Battle.create = function() {
    this.initSceneVars();
    sceneVars.keys = this.input.keyboard.createCursorKeys();
    this.createUi();
    sceneVars.sounds.base = this.sound.add('base');

    sceneVars.sounds.transition = this.sound.add('transition');
    sceneVars.sounds.ability = this.sound.add('ability');
    sceneVars.sounds.base.on('play', function(){
      sceneVars.baseStartTimeMs = window.performance.now();
    }, this);

    sceneVars.sounds.base.play({
      loop: true
    });
  };

  /**
   *
   */
  Battle.initSceneVars = function() {
    sceneVars = {
      movementState: {},
      ui: {},
      enemies: [],
      sounds: {},
      bpm: 155
    };

    Object.defineProperty(sceneVars, 'beatTimeS', {
      get: function(){
        return 60/this.bpm;
      }
    });
    Object.defineProperty(sceneVars, 'beatTimeMs', {
      get: function(){
        return this.beatTimeS*1000;
      }
    });

    this.sceneVars = sceneVars;
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
    ui.graphics.skills = this.add.sprite(atkX + ui.graphics.attack.displayWidth + 30, atkY, 'placeholder-borderless');
    ui.graphics.skills.tint = 0x585858;
    ui.graphics.skills.displayWidth = buttonW;


    ui.text = {};
    ui.text.attack = this.add.text(ui.graphics.attack.x, ui.graphics.attack.y, 'Attack', { fontFamily: 'Arial', fontSize: 24, color: '#FFFFFF' });
    ui.text.attack.x -= ui.text.attack.width / 2;
    ui.text.attack.y -= ui.text.attack.height / 2;

    ui.text.skills = this.add.text(ui.graphics.skills.x, ui.graphics.skills.y, 'Drum!', { fontFamily: 'Arial', fontSize: 24, color: '#FFFFFF' });
    ui.text.skills.x -= ui.text.skills.width / 2;
    ui.text.skills.y -= ui.text.skills.height / 2;

    ui.buttons = [];
    ui.buttons.push({box: ui.graphics.attack, text: ui.text.attack});
    ui.buttons.push({box: ui.graphics.skills, text: ui.text.skills});

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


  Battle.skills = function() {
    console.warn('Defending is not yet implemented');
  };

  /**
   *
   */
  Battle.activateSelectedMenuItem = function() {
    var activeIndex = sceneVars.ui.vars.activeIndex;
    if (activeIndex === 0) {
      //this.scene.pause();
      console.warn('Not Yet Implemented');
    }
    if (activeIndex === 1) {
      // DRUM
      console.log('launch');
      var kicks = [];
      for (var i = 1;i <= 100; i++) {
        if (i === 1) {
          var now = window.performance.now();
          var delta = now - sceneVars.baseStartTimeMs;
          delta %= sceneVars.beatTimeMs;
          kicks.push((sceneVars.beatTimeMs+delta)/1000);
        }
        else {
          kicks.push(sceneVars.beatTimeS);
        }
      }
      console.log(kicks);
      var pattern = {
        kick: kicks
      };
      this.scene.launch('Drums', {pattern: pattern, bpm: sceneVars.bpm});
      // sceneVars.sounds.base.once('looped', function(){
      //   sceneVars.sounds.base.stop();
      //   sceneVars.sounds.transition.play();
      //   sceneVars.sounds.transition.once('ended', function() {
      //     sceneVars.sounds.ability.play();
      //     sceneVars.sounds.ability.once('ended', function(){
      //       sceneVars.sounds.base.play({
      //         loop: true
      //       });
      //     });
      //   });
      // });
    }
    if (activeIndex === 2) {
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
