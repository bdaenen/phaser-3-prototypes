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

    // var sunLayer = this.add.graphics({ fillStyle: { color: 0xFFFFFF } });
    // sunLayer.fillRectShape(new Phaser.Geom.Rectangle(0, 0, 5000, 5000));

    var wavesTexture = this.add.tileSprite(
        512, 512,
        5000, 5000,
        'waves'
    );

    // wavesTexture.alpha = 0.5;

    oceanFloorTexture = this.add.tileSprite(
        512, 512,
        5000, 5000,
        'ocean-floor'
    );

    oceanFloorTexture.setScrollFactor(0.25);

    var circle = new Phaser.Geom.Circle(400, 300, 200);

    var visibilityMask = this.make.graphics();
    visibilityMask.fillCircleShape(circle);

    var rectangle = new Phaser.Geom.Rectangle(400 / 2, 300 / 2, 300, 300);

    // visibilityMask.fillRectShape(rectangle);

    // visibilityMask.alpha = 1;
    // visibilityMask.setScrollFactor = 0;

    oceanFloorTexture.mask = new Phaser.Display.Masks.BitmapMask(this, visibilityMask);

    visibilityMask.setScrollFactor(0);

    var wavesTextureForground = this.add.tileSprite(
        512, 512,
        5000, 5000,
        'waves'
    );

    wavesTextureForground.alpha = 0.5;
  }

  function update (time, delta)
  {
    controls.update(delta);
  }


}());
