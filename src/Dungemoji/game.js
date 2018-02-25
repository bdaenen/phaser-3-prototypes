(function () {
  'use strict';
  var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
  var emoji = {
    warrior: '😡',
    mage: '🧙🏻‍♂',
    rogue: '🧝🏼',
    spider: '🕷',
    scorpion: '🦂',
    trex: '🦖',
    heart: '❤',
    doubleHeart: '💕',
    wall: '⬛',
  };
  var emojiTextures = {};
  Object.keys(emoji).forEach(function(k){emojiTextures[k]=''});

  var game = new Phaser.Game(config);

  var backgroundLayer = null;
  var objectLayer = null;
  var foregroundLayer = null;

  function preload ()
  {
  }

  function create ()
  {
    backgroundLayer = this.add.group({key: 'background'});
    objectLayer = this.add.group({key: 'object'});
    foregroundLayer = this.add.group({key: 'foreground'});

    emojiTextures.wall = this.textures.createCanvas('wallGenerator', 55, 55);
    var canvas = emojiTextures.wall.getSourceImage();
    var ctx = canvas.getContext('2d');
    ctx.font = '72px "Segoe Ui Emoji"';
    ctx.fillText(emoji.wall, -9, 53);

    var tileSprite = this.add.tileSprite(960/2, 540/2, 960, 540, 'wallGenerator');
    backgroundLayer.add(tileSprite);
  }

  function update ()
  {
  }


}());