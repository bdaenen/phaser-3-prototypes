(function () {
  'use strict';
  var Drums = new Phaser.Scene('Drums');
  var sceneVars = {
    movementState: {},
    assets: {},
    ui: {},
    timeOff: 0,
    curTime: 0,
    samples: {},
    score: 0
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
    ui.graphics.notes = {
      kick: [],
      snare: [],
      tom1: [],
      tom2: []
    };
/*    ui.graphics.beat = this.add.sprite(200, 200, 'placeholder-borderless');
    ui.graphics.beat.tint = 0xFFFFFF;*/

    ui.graphics.snare = this.add.sprite(300, 400, 'placeholder');
    ui.graphics.tom1 = this.add.sprite(400, 400, 'placeholder');
    ui.graphics.tom2 = this.add.sprite(500, 400, 'placeholder');
    ui.graphics.kick = this.add.sprite(700, 400, 'placeholder');
    ui.graphics.kick.scaleX = 6;

    ui.text = {};
    ui.text.timeOff = this.add.text(200, 300, sceneVars.timeOff, { fontFamily: 'Arial', fontSize: 18, color: '#FFFFFF' });
    ui.text.snare = this.add.text(295, 390, 'X', { fontFamily: 'Arial', fontSize: 18, color: '#FFFFFF' });
    ui.text.tom1 = this.add.text(395, 390, 'C', { fontFamily: 'Arial', fontSize: 18, color: '#FFFFFF' });
    ui.text.tom2 = this.add.text(495, 390, 'V', { fontFamily: 'Arial', fontSize: 18, color: '#FFFFFF' });
    ui.text.kick = this.add.text(665, 390, 'SPACE', { fontFamily: 'Arial', fontSize: 18, color: '#FFFFFF' });

  };

  /**
   *
   */
  Drums.createDrumPattern = function() {
    var ui = sceneVars.ui;
    var samples =  sceneVars.samples;
    //var player = new Tone.Player('./assets/audio/drums/hihat.ogg').toMaster();

    /*var loop = new Tone.Pattern(function(time){
    //  player.start();
    //  samples.hihat.play();

      Tone.Draw.schedule(function(){
        sceneVars.curTime = window.performance.now();
        ui.graphics.beat.tint = 0x00FF00;
      }, time);

      Tone.Draw.schedule(function(){
        ui.graphics.beat.tint = 0xFFFFFF;
      }, time + 0.1);
    }).start(0);
    loop.interval = "2n";*/

    var kickLoop = new Tone.Pattern(function(time) {
      Tone.Draw.schedule(function(){
        var note = this.add.sprite(this.sceneVars.ui.graphics.kick.x, 100, 'placeholder');
        sceneVars.ui.graphics.notes.kick.push(note);
        note.scaleX = 6;
        var tween = this.tweens.add({
          targets: note,
          props: {
            y: {value: '+=500', duration: 2000, ease: 'Linear'}
          }
        });
      }.bind(this), time);
    }.bind(this)).start(0);

    kickLoop.interval = "2n";

    var snareLoop = new Tone.Pattern(function(time) {
      Tone.Draw.schedule(function(){
        var note = this.add.sprite(this.sceneVars.ui.graphics.snare.x, 100, 'placeholder');
        sceneVars.ui.graphics.notes.snare.push(note);
        var tween = this.tweens.add({
          targets: note,
          props: {
            y: {value: '+=500', duration: 2000, ease: 'Linear'}
          }
        });
      }.bind(this), time);
    }.bind(this)).start(0.5);

    snareLoop.interval = "2n";

    Tone.Transport.start("+0.01");
  };

  Drums.createInput = function() {
    this.input.keyboard.on('keydown_X', function (event) {
      sceneVars.timeOff = window.performance.now() - sceneVars.curTime;
      sceneVars.samples.snare.play();
      console.log(sceneVars.ui.graphics.notes.snare);
      if (!sceneVars.ui.graphics.notes.snare.length) {
        return; // Bad! There's no notes!
      }
      var currentSnareNote = sceneVars.ui.graphics.notes.snare.shift();
      if (Math.abs(currentSnareNote.y - sceneVars.ui.graphics.snare.y) < 75) {
        sceneVars.score += 10;
      }
      else {
        // Mute music track
      }
      currentSnareNote.destroy();
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
      if (!sceneVars.ui.graphics.notes.kick.length) {
        return; // Bad! There's no notes!
      }
      var currentKickNote = sceneVars.ui.graphics.notes.kick.shift();

      if (Math.abs(currentKickNote.y - sceneVars.ui.graphics.kick.y) < 60) {
        sceneVars.score += 10;
      }
      else {
        // Mute music track
      }
      currentKickNote.destroy();
    });
  };

  /**
   * Main update loop
   */
  Drums.update = function() {
    this.updateUi();
    Object.keys(sceneVars.ui.graphics.notes).forEach(function(noteType) {
      sceneVars.ui.graphics.notes[noteType].forEach(function(note, idx) {
        if (note.y >= this.cameras.main.height) {
          note.destroy();
          sceneVars.ui.graphics.notes[noteType].splice(idx, 1);
        }
      }, this);
    }, this);
  };

  /**
   * Update UI
   */
  Drums.updateUi = function() {
    sceneVars.ui.text.timeOff.setText(sceneVars.score);
    /*if (sceneVars.timeOff > 500) {
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
    */
  };

  window.DrumsScene = Drums;
}());
