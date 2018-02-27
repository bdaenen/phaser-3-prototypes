(function () {
  'use strict';
  var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
      preload: preload,
      create: create,
      update: update
    },
    files: {
      images: [
        { key: 'ocean-floor', url: './assets/floor.png' },
        { key: 'waves', url: './assets/waves.jpg' }
      ]
    }
  };

  var game = new Phaser.Game(config);

  var backgroundLayer = null;
  var objectLayer = null;
  var foregroundLayer = null;

  var oceanFloorTexture;
  var controls;

  function preload ()
  {
    config.files.images.forEach(function(file){
      this.load.image(file.key, file.url);
    }, this);
  }

  function create ()
  {
    // var myBitmap = game.add.bitmapData(1920, 1200);
    // var grd = myBitmap.context.createLinearGradient(0, 0, 0, 1920);
    //
    // grd.addColorStop(0, "#37ecba");
    // grd.addColorStop(1, "#72afd3");

    var cursors = this.input.keyboard.createCursorKeys();

    var controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      acceleration: 0.06,
      drag: 0.0005,
      maxSpeed: 1.0
    };

    controls = new Phaser.Cameras.Controls.Smoothed(controlConfig);

    var cam = this.cameras.main;

    oceanFloorTexture = this.add.tileSprite(
        512, 512,
        5000, 5000,
        'ocean-floor'
    );
  }

  function update (time, delta)
  {
    controls.update(delta);
  }


}());
