(function () {
  'use strict';
  var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 544,
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
      //  gravity: { y: 300 },
        debug: true
      }
    },
    scene: [window.BattleScene, window.DrumsScene]
  };

  var game = new Phaser.Game(config);
}());
