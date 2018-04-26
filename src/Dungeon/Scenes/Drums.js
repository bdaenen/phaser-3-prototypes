(function () {
  'use strict';
  var Drums = new Phaser.Scene('Drums');
  var sceneVars = {
    movementState: {},
    assets: {},
    ui: {},
    enemies: [],
    timeOff: 0,
    curTime: 0
  };

  Drums.sceneVars = sceneVars;

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

  Drums.tilesetName = 'dungeon';

  /**
   *
   */
  Drums.preload = function() {
    this.load.setPath('./assets/');
    sceneVars.assets.images.forEach(function(file){
      this.load.image(file.key, file.url);
    }, this);
  };

  /**
   * Main create function
   */
  Drums.create = function() {
    var ui = this.sceneVars.ui;
    this.createUi();
    this.createDrumPattern();
    this.createInput();
  };

  /**
   *
   */
  Drums.createUi = function() {
    var ui = sceneVars.ui;
    ui.graphics = {};
    ui.graphics.beat = this.add.sprite(200, 200, 'placeholder-borderless');
    ui.graphics.beat.tint = 0xFFFFFF;

    ui.text = {};
    ui.text.timeOff = this.add.text(200, 300, sceneVars.timeOff, { fontFamily: 'Arial', fontSize: 18, color: '#FFFFFF' });

  };

  /**
   *
   */
  Drums.createDrumPattern = function() {
    var ui = sceneVars.ui;
    var conga = new Tone.MembraneSynth({
      "pitchDecay" : 0.008,
      "octaves" : 2,
      "envelope" : {
        "attack" : 0.0006,
        "decay" : 0.5,
        "sustain" : 0
      }
    }).toMaster();

    var conga2 = new Tone.MembraneSynth({
      "pitchDecay" : 0.008,
      "octaves" : 10,
      "oscillator" : {
        "type" : "sine"
      },
      "envelope" : {
        "attack" : 0.0006,
        "decay" : 0.1,
        "sustain" : 0
      }
    }).toMaster();

    var loop = new Tone.Pattern(function(time, note){
      conga.triggerAttackRelease(note, "16n", time);
      // Draw.schedule takes a callback and a time to invoke the callback
      Tone.Draw.schedule(function(){
        sceneVars.curTime = window.performance.now();
        ui.graphics.beat.tint = 0x00FF00;
      }, time);

      Tone.Draw.schedule(function(){
        ui.graphics.beat.tint = 0xFFFFFF;
      }, time + 0.1);
    }, ["B2"]).start(0);
    loop.interval = "2n";
    Tone.Transport.start("+0.1");

    sceneVars.conga = conga2;
  };

  Drums.createInput = function() {
    this.input.keyboard.on('keydown_X', function (event) {
      sceneVars.timeOff = window.performance.now() - sceneVars.curTime;
      sceneVars.conga.triggerAttackRelease(100, "16n", Tone.context.currentTime + 0.025);
    });
  };

  /**
   * Main update loop
   */
  Drums.update = function() {
    this.updateUi();
  };

  /**
   * Update UI
   */
  Drums.updateUi = function() {
    if (sceneVars.timeOff > 500) {
      sceneVars.timeOff = - (1000 - sceneVars.timeOff);
    }
    var absDelta = Math.abs(sceneVars.timeOff);
    if (absDelta < 100) {
      sceneVars.ui.text.timeOff.tint = 0x00FF00;
    }
    else if (absDelta < 250) {
      sceneVars.ui.text.timeOff.tint = 0xAAFF00;
    }
    else {
      sceneVars.ui.text.timeOff.tint = 0xFF0000;
    }
    sceneVars.ui.text.timeOff.setText(sceneVars.timeOff);

  };

  window.DrumsScene = Drums;
}());
