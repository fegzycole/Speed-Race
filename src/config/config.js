import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 600,
  parent: 'phaser-example',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      enableBody: true,
    },
  },
};

export default config;
