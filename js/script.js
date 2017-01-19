(function() {
  "use strict";
  /**
   * Get a computed style of a DOM element
   * @param  {DOM Element} element The target DOM element
   * @param  {String} style   Name of style eg. width, margin-left
   * @return {Float}         Computed style value
   */
  var getStyle = function(element, style) {
    return parseFloat(window.getComputedStyle(element).getPropertyValue(style));
  };

  /**
   * Get a random number between two numbers
   * @param  {Integer} low  Lower limit of interval
   * @param  {Integer} high Upper limit of interval
   * @return {Integer}      Random number between interval
   */
  var getRandomNumber = function(low, high) {
    return Math.floor(Math.random() * (high - low + 1)) + low;
  };

  /**
   * Get a random color
   * @return {String} Color in rgb(r,g,b) format
   */
  var getRandomColor = function() {
    var R = parseInt(Math.random() * 255);
    var G = parseInt(Math.random() * 255);
    var B = parseInt(Math.random() * 255);
    var color = "rgb(" + R + "," + G + "," + B + ")";
    return color;
  };

  var gameDimensions = {
    width: 800,
    height: 600
  };

  var speed = 2;

  var gameOverState = false;

  var highScore = 0;


  /**
   * Class for Car Object
   * @param {Object} position   position = {x: 0, y: 0}
   * @param {Object} dimensions dimensions = {width: 0, y: 0}
   * @param {String} color      Value of color rgb(r, g, b)
   */
  var Car = function(position, dimensions, color) {
    var that = this;

    if (position === undefined) {
      position = {
        x: 0,
        y: 0
      };
    }

    if (dimensions === undefined) {
      dimensions = {
        width: 50,
        height: 100
      };
    }

    if (color === undefined) {
      color = getRandomColor();
    }

    this.position = position;
    this.dimensions = dimensions;
    this.color = color;

    /**
     * Check collision between this object and other objects in array
     * @param  {Array} carArray Array of cars
     * @return {Boolean}          True if collision occurs, False if doesn't
     */
    this.checkCollision = function(carArray) {
      for (var i = 0; i < carArray.length; i++) {
        var currentCar = carArray[i];
        if (this.position.x <= currentCar.position.x + currentCar.dimensions.width && this.position.x + this.dimensions.width >= currentCar.position.x && this.position.y <= currentCar.position.y + currentCar.dimensions.height && this.position.y + this.dimensions.height >= currentCar.position.y) {
          return true;
        }
      }
      return false;
    };

    /**
     * Give user control to Car object
     * Move to left lane on press (Left Arrow || A) key
     * Move to right lane on press (Right Arrow || D) key
     */
    this.givePlayerControl = function() {
      var lane = 1;
      document.addEventListener("keydown", function(e) {
        if (e.which === 37 || e.which === 65) { // 37 = Left Arrow, 65 = A Key
          lane--;
          if (lane < 0) {
            lane = 0;
          }
        }
        if (e.which === 39 || e.which === 68) { //39 = Right Arrow, 68 = D Key
          lane++;
          if (lane > 2) {
            lane = 2;
          }
        }
        that.position.x = lane * gameDimensions.width / 3 + gameDimensions.width / 6 - 25; //Switch lanes and move to center of lane
      });
    };

    /**
     * Move y position of Car based on speed
     */
    this.move = function() {
      this.position.y += speed;
    };

  };

  /**
   * Class for Canvas
   * @param {String} containerID ID of container element to draw canvas in
   * @param {Object} dimensions  dimensions = {width: 0, height: 0}
   */
  var Canvas = function(containerID, dimensions) {
    var that = this;

    if (containerID === undefined) {
      containerID = "container";
    }

    if (dimensions === undefined) {
      dimensions = {
        width: 800,
        height: 600
      };
    }

    this.containerID = containerID;
    this.dimensions = dimensions;

    /**
     * Get DOM element of ID 'containerID'. If no element found, create it.
     */
    this.container = document.getElementById(containerID);
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.setAttribute("id", this.containerID);
      document.body.appendChild(this.container);
    }

    /**
     * Get Canvas element inside container DOM element. If no canvas found, create it.
     */
    this.canvas = this.container.getElementsByTagName("canvas")[0];
    if (!this.canvas) {
      this.canvas = document.createElement("canvas");
      this.canvas.setAttribute("width", this.dimensions.width);
      this.canvas.setAttribute("height", this.dimensions.height);
      this.container.appendChild(this.canvas);
    }
    this.dimensions.width = Number(this.canvas.getAttribute("width"));
    this.dimensions.height = Number(this.canvas.getAttribute("height"));

    this.context = this.canvas.getContext("2d");

    /**
     * Get player and car objects and draw them. Draw Lanes too.
     * @param  {Car} player   Player Car object
     * @param  {Array} carArray Array of Car ohjects (Obstacles)
     */
    this.draw = function(player, carArray) {
      this.clear();
      this.drawLanes();

      this.context.beginPath();
      this.context.fillStyle = player.color;
      this.context.fillRect(player.position.x, player.position.y, player.dimensions.width, player.dimensions.height);
      this.context.closePath();

      for (var i = 0; i < carArray.length; i++) {
        var currentCar = carArray[i];

        this.context.beginPath();
        this.context.fillStyle = currentCar.color;
        this.context.fillRect(currentCar.position.x, currentCar.position.y, currentCar.dimensions.width, currentCar.dimensions.height);
        this.context.closePath();
      }
    };

    /**
     * Clear the canvas
     */
    this.clear = function() {
      this.context.clearRect(0, 0, this.dimensions.width, this.dimensions.height);
    };

    /**
     * Draw Lanes on the canvas
     */
    this.drawLanes = function() {
      this.context.beginPath();
      this.context.moveTo(this.dimensions.width / 3, 0);
      this.context.lineTo(this.dimensions.width / 3, this.dimensions.height);
      this.context.strokeStyle = "black";
      this.context.stroke();
      this.context.closePath();

      this.context.beginPath();
      this.context.moveTo(this.dimensions.width / 3 * 2, 0);
      this.context.lineTo(this.dimensions.width / 3 * 2, this.dimensions.height);
      this.context.strokeStyle = "black";
      this.context.stroke();
      this.context.closePath();
    };
  };

  /**
   * Main Game Class
   * @param {Object} gameDimensions gameDimensions = {width: 0, height: 0}
   */
  var Game = function(gameDimensions) {
    var that = this;
    console.log(highScore);

    if (gameDimensions === undefined) {
      gameDimensions = {
        width: 800,
        height: 600
      };
    }


    this.timeCounter = 0;
    this.score = 0;

    this.player = null;
    this.carArray = [];

    this.gameDimensions = gameDimensions;

    var gameInterval;

    /**
     * Initialize the game.
     * Create Player Object. Give control to user.
     * Create Canvas Object
     * Start an interval where new Car object is created and added to carArray
     * Call Canvas.draw(player, carArray) to draw on the canvas
     * Call Player.checkCollision(carArray) to check collision
     * Check if an obstacle Car goes beyond the canvas at the bottom. If it does, increase the score and delete that Car object
     */
    this.init = function() {
      console.log("Game Started");
      speed = 2;
      gameOverState = false;
      this.timeCounter = 0;
      this.score = 0;
      this.player = new Car({
        x: this.gameDimensions.width / 3 + this.gameDimensions.width / 6 - 25, // Move to center of lane
        y: this.gameDimensions.height - 120 // Move 120 px above height of canvas
      });
      this.player.givePlayerControl();

      this.carArray = [];

      this.canvas = new Canvas("container", this.gameDimensions);

      gameInterval = setInterval(function() {
        that.timeCounter++;
        console.log(highScore, that.score);
        if (that.timeCounter > 5000) { // Reset timeCounter so that timeCounter isn't infinitely increasing
          that.timeCounter = 0;
        }

        // At random time frames, create a new obstacle Car Object and send it to a random Lane

        if (that.timeCounter % getRandomNumber(100, 150) === 0) {
          that.carArray.push(new Car({
            x: getRandomNumber(0, 2) * that.gameDimensions.width / 3 + that.gameDimensions.width / 6 - 25, // Move to center of lane
            y: -100 // Move 100px above canvas
          }));
          speed += 0.1; // Increase speed on every new Car object creation
        }

        that.canvas.draw(that.player, that.carArray);

        for (var i = 0; i < that.carArray.length; i++) {
          var currentCar = that.carArray[i];
          currentCar.move();
        }

        if (that.player.checkCollision(that.carArray)) {
          that.gameOver();
        }

        // Check if obstacle Car goes beyond the canvas.
        // Create a new array that stores Car objects that are still within the canvas. Replace old carArray with the new one
        // If obstacle Car goes beyond, delete that and increase Score (because player has avoided it)
        var newCarArray = [];
        for (var index = 0; index < that.carArray.length; index++) {
          if (that.carArray[index].position.y < that.gameDimensions.height) {
            newCarArray.push(that.carArray[index]);
          } else {
            that.score++;
            that.carArray[index] = null;
          }
        }
        that.carArray = newCarArray;
      }, 10);
    };

    /**
     * Game over function. On Collision, game over. If (Space) Key is pressed, delete current Game object and reinitialize a new Game object.
     */
    this.gameOver = function() {
      console.log("Game Ended");
      gameOverState = true;
      if (this.score > highScore) {
        highScore = this.score;
        console.log("New High Score", highScore);
      }
      clearInterval(gameInterval);
      document.addEventListener("keydown", function(e) {
        if (e.which === 32 && gameOverState) { // 32 = Space Key
          new Game(gameDimensions).init();
          // delete that;
        }
      });
    };
  };

  new Game(gameDimensions).init();
})();