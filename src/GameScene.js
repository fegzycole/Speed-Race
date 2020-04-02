/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */
import 'phaser';
import gameState from './config/state';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }


  preload() {
    this.load.image('racer', 'images/car-truck1.png');
    this.load.image('car1', 'images/car-truck2.png');
    this.load.image('car2', 'images/car-truck3.png');
    this.load.image('car3', 'images/car-truck4.png');
    this.load.image('car4', 'images/car-truck5.png');
    this.load.image('track', 'images/background-1.png');
    this.load.image('platform', 'images/platform.png');
  }


  create() {
    gameState.background = this.add.tileSprite(200, 300, 760, 600, 'track');

    gameState.player = this.physics.add.sprite(240, 572, 'racer').setScale(2.0);

    gameState.player.body.setAllowGravity(false);

    gameState.scoreText = this.add.text(30, 30, 'Score: 0', { fontSize: '30px', fill: '#000000' });

    gameState.player.setCollideWorldBounds(true);

    gameState.cursors = this.input.keyboard.createCursorKeys();

    gameState.cars = this.physics.add.group();

    const carList = ['car1', 'car2', 'car3', 'car4'];

    function generateRandomNumber() {
      return Math.floor(Math.random() * 4);
    }

    function carGen() {
      const arrayOfXCoOrdinates = [55, 180, 300, 430];
      let randomNumber = generateRandomNumber();
      const randomCar = carList[Math.floor(Math.random() * 4)];
      let xCoord = arrayOfXCoOrdinates[randomNumber];
      while (xCoord === gameState.defaultXCoOrdinate) {
        randomNumber = generateRandomNumber();
        xCoord = arrayOfXCoOrdinates[randomNumber];
      }
      gameState.defaultXCoOrdinate = xCoord;
      gameState.cars.create(xCoord, 10, randomCar).setScale(2.1);
    }

    gameState.carGenLoop = this.time.addEvent({
      delay: 1000,
      callback: carGen,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.collider(gameState.player, gameState.cars, () => {
      gameState.carGenLoop.destroy();
      this.physics.pause();
      gameState.scroll = false;
      this.add.text(180, 250, 'Game Over', { fontSize: '15px', fill: '#000000' });
      this.add.text(152, 270, 'Click to Restart', { fontSize: '15px', fill: '#000000' });

      this.input.on('pointerup', () => {
        gameState.score = 0;
        this.scene.restart();
        gameState.scroll = true;
      });
    });
  }

  update() {
    if (gameState.scroll) {
      gameState.background.tilePositionY -= 2;
    }

    if (gameState.cursors.left.isDown) {
      gameState.player.setVelocityX(-160);
    } else if (gameState.cursors.right.isDown) {
      gameState.player.setVelocityX(160);
    } else if (gameState.cursors.up.isDown) {
      gameState.player.setVelocityY(-160);
    } else if (gameState.cursors.down.isDown) {
      gameState.player.setVelocityY(160);
    } else {
      gameState.player.setVelocityX(0);
      gameState.player.setVelocityY(0);
    }

    if (!Number.isInteger(gameState.score / 15)) {
      gameState.counter = 0;
    }

    if (gameState.score !== 0
      && Number.isInteger(gameState.score / 15)
      && gameState.counter === 0) {
      this.physics.world.gravity.y += 50;

      if (gameState.carGenLoop.delay > 600) {
        gameState.carGenLoop.delay -= 200;
      }

      gameState.counter += 1;
    }

    gameState.cars.children.entries.forEach((car) => {
      if (car.y > 620) {
        gameState.score += 1;
        gameState.scoreText.setText(`Score: ${gameState.score}`);
        car.destroy();
      }
    });
  }
}
