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
    scene: [window.DrumsScene, window.BattleScene, window.RockDungeonScene]
  };

  var game = new Phaser.Game(config);
}());
