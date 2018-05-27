(function () {
  'use strict';
  var Drums = new Phaser.Scene('Drums');
  var sceneVars = {};

  /**
   * @type {{images: [null,null,null,null], spritesheet: [null]}}
   */

  Drums.tilesetName = 'dungeon';

  /**
   *
   */
  Drums.preload = function() {
    this.load.setPath('./assets/');
    /*sceneVars.assets.images.forEach(function(file){
      this.load.image(file.key, file.url);
    }, this);*/

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
    this.initSceneVars();
    this.createSamples();
    this.createUi();
    this.createDrumPattern();
    this.createInput();

    this.events.on('shutdown', this.shutdown, this);
//    this.events.on('start', this.start);
  };

  Drums.initSceneVars = function() {
    sceneVars = {
      movementState: {},
      assets: {
        images: [
          { key: 'placeholder', url: 'placeholder.png' },
          { key: 'placeholder-borderless', url: 'placeholder_borderless.png' },
          { key: 'key', url: 'key.png' }
        ]
      },
      ui: {
        graphics: {},
        text: {}
      },
      curTime: 0,
      samples: {},
      score: 0,
      tone: {
        loops: {}
      }
    };

    Drums.sceneVars = sceneVars;
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
    var ui = {
      graphics: {},
      text: {}
    };

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
    ui.text.score = this.add.text(200, 300, sceneVars.score, { fontFamily: 'Arial', fontSize: 18, color: '#FFFFFF' });
    ui.text.snare = this.add.text(295, 390, 'X', { fontFamily: 'Arial', fontSize: 18, color: '#FFFFFF' });
    ui.text.tom1 = this.add.text(395, 390, 'C', { fontFamily: 'Arial', fontSize: 18, color: '#FFFFFF' });
    ui.text.tom2 = this.add.text(495, 390, 'V', { fontFamily: 'Arial', fontSize: 18, color: '#FFFFFF' });
    ui.text.kick = this.add.text(665, 390, 'SPACE', { fontFamily: 'Arial', fontSize: 18, color: '#FFFFFF' });

    this.sceneVars.ui = ui;
  };

  /**
   *
   */
  Drums.createDrumPattern = function() {
    var ui = sceneVars.ui;
    var samples =  sceneVars.samples;

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

    sceneVars.tone.loops.kick = kickLoop;

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
    sceneVars.tone.loops.snare = snareLoop;

    Tone.Transport.start("+0.01");
  };

  Drums.createInput = function() {
    this.input.keyboard.on('keydown_X', this.snare);
    this.input.keyboard.on('keydown_C', this.tom1);
    this.input.keyboard.on('keydown_V', this.tom2);
    this.input.keyboard.on('keydown_SPACE', this.kick);
  };

  Drums.snare = function(event) {
      sceneVars.samples.snare.play();
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
  };

  Drums.tom1 = function (event)  {
    sceneVars.samples.tom1.play();
  };

  Drums.tom2 = function (event) {
    sceneVars.samples.tom2.play();
  };

  Drums.kick = function (event) {
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

    if (sceneVars.score >= 20) {
      var scene = this.scene.get('RockDungeon');
      scene.scene.settings.data = scene.scene.settings.data || {};
      scene.scene.settings.data.succeeded = true;
      scene.scene.wake();
      //debugger;
      this.sys.shutdown();
    }
  };

  Drums.shutdown = function() {
    // Shutdown input
    this.input.keyboard.off('keydown_X', this.snare);
    this.input.keyboard.off('keydown_C', this.tom1);
    this.input.keyboard.off('keydown_V', this.tom2);
    this.input.keyboard.off('keydown_SPACE', this.kick);

    // Shutdown graphics
    Object.keys(sceneVars.ui.graphics.notes).forEach(function(noteType) {
      sceneVars.ui.graphics.notes[noteType].forEach(function(note, idx) {
        note.destroy();
        sceneVars.ui.graphics.notes[noteType].splice(idx, 1);
      }, this);
    }, this);

    // Shutdown ToneJS.
    Object.keys(sceneVars.tone.loops).forEach(function(loop) {
      sceneVars.tone.loops[loop].stop();
    }, this);

    Tone.Transport.stop();
  };

  /**
   * Update UI
   */
  Drums.updateUi = function() {
    sceneVars.ui.text.score.setText(sceneVars.score);
  };

  window.DrumsScene = Drums;
}());
