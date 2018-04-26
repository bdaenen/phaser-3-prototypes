(function () {
  'use strict';
  var Drums = new Phaser.Scene('Drums');
  var sceneVars = {
    movementState: {},
    assets: {},
    ui: {},
    timeOff: 0,
    curTime: 0,
    samples: {}
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

    this.load.audio('snare', 'audio/drums/snare.ogg');
    this.load.audio('crash', 'audio/drums/crash.ogg');
    this.load.audio('hihat', 'audio/drums/hihat.ogg');
    this.load.audio('kick', 'audio/drums/kick.ogg');
    this.load.audio('tom02', 'audio/drums/tom02.ogg');
    this.load.audio('tom03', 'audio/drums/tom03.ogg');
    this.load.audio('tom04', 'audio/drums/tom04.ogg');
    this.load.audio('tom05', 'audio/drums/tom05.ogg');
  };

  /**
   * Main create function
   */
  Drums.create = function() {
    var ui = sceneVars.ui;
    this.createSamples();
    this.createUi();
    this.createDrumPattern();
    this.createInput();
  };

  Drums.createSamples = function() {
    sceneVars.samples = {
      snare: this.sound.add('snare'),
      tom1: this.sound.add('tom04'),
      tom2: this.sound.add('tom05'),
      kick: this.sound.add('kick'),
      hihat: this.sound.add('hihat'),
      crash: this.sound.add('crash')
    };

    sceneVars.samples.snare.volume = 0.3;
    sceneVars.samples.hihat.volume = 0.3;
    sceneVars.samples.crash.volume = 0.4;
    sceneVars.samples.kick.volume = 0.4;
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
    var samples =  sceneVars.samples;
    // var conga = new Tone.MembraneSynth({
    //   "pitchDecay" : 0.008,
    //   "octaves" : 2,
    //   "envelope" : {
    //     "attack" : 0.0006,
    //     "decay" : 0.5,
    //     "sustain" : 0
    //   }
    // }).toMaster();
    //
    // var conga2 = new Tone.MembraneSynth({
    //   "pitchDecay" : 0.008,
    //   "octaves" : 10,
    //   "oscillator" : {
    //     "type" : "sine"
    //   },
    //   "envelope" : {
    //     "attack" : 0.0006,
    //     "decay" : 0.1,
    //     "sustain" : 0
    //   }
    // }).toMaster();

    var loop = new Tone.Pattern(function(time){
      samples.hihat.play();

      Tone.Draw.schedule(function(){
        sceneVars.curTime = window.performance.now();
        ui.graphics.beat.tint = 0x00FF00;
      }, time);

      Tone.Draw.schedule(function(){
        ui.graphics.beat.tint = 0xFFFFFF;
      }, time + 0.1);
    }).start(0);
    loop.interval = "2n";
    Tone.Transport.start("+0.01");

    // sceneVars.conga = conga2;
  };

  Drums.createInput = function() {
    this.input.keyboard.on('keydown_X', function (event) {
      sceneVars.timeOff = window.performance.now() - sceneVars.curTime;
      sceneVars.samples.snare.play();
    });
    this.input.keyboard.on('keydown_C', function (event) {
      sceneVars.timeOff = window.performance.now() - sceneVars.curTime;
      sceneVars.samples.tom1.play();
    });
    this.input.keyboard.on('keydown_V', function (event) {
      sceneVars.timeOff = window.performance.now() - sceneVars.curTime;
      sceneVars.samples.tom2.play();
    });
    this.input.keyboard.on('keydown_SPACE', function (event) {
      sceneVars.timeOff = window.performance.now() - sceneVars.curTime;
      sceneVars.samples.kick.play();
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
