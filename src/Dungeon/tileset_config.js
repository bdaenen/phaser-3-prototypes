(function () {
  'use strict';
  window.tilesetConfig = window.tilesetConfig || {};

  tilesetConfig.dungeon = {
    'block': 103,
    'blockPad': 44,
    'lockedDoors': [
      145,
      146,
      147,
      165,
      183,
      201,
      205,
      206,
      207,
      209,
      220,
      227
    ],
    'puzzleDoors': [
      148,
      149,
      150,
      167,
      185,
      203,
      222,
      169,
      170,
      171,
      211,
      229
    ]
  };

  tilesetConfig.collision = {
    'collision': [
      235
    ]
  }
}());
