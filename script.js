const table = document.querySelector('.container');
const score = document.querySelector('.score');
let snake = new Snake(), food = new Food(), actualScore = 0;

window.addEventListener('load', () => {
  for (let i = 0; i < 10; ++i) {
    snake.add();
  }
  food.appearance();
  startGame();
});

window.addEventListener('keydown', (e) => {
  if(e.keyCode == '37' && snake.direction.hd !== 10) {
    snake.direction.hd = -10;
    snake.direction.vd = 0;
  }
  if(e.keyCode == '39' && snake.direction.hd !== -10) {
    snake.direction.hd = 10;
    snake.direction.vd = 0;
  }
  if(e.keyCode == '38' && snake.direction.vd !== 10) {
    snake.direction.hd =  0;
    snake.direction.vd = -10;
  }
  if(e.keyCode == '40' && snake.direction.vd !== -10) {
    snake.direction.hd = 0;
    snake.direction.vd = 10;
  }
});

function startGame(event) {
  snake.move();
  if(snake.body[0].h === food.coordinates.actualHorizontal && snake.body[0].v === food.coordinates.actualVertical) {
    food.appearance();
    snake.body.push(snake.body[snake.body.length - 1]);
    score.innerText = ++actualScore;
  }
  if(snake.check()) {
    setTimeout(window.location.reload(), 50000);
  }
  setTimeout(startGame, 100);
}

function randomNumber(position, caller) {
  let point = position > 600 ? table.width : table.height;
  let randomNumber = Math.floor(Math.random() * (point - 100) + 50);
  if(caller == 'Snake') {
    randomNumber = Math.floor(Math.random() * (point - 300) + 100);
  }
  return randomNumber - randomNumber % 10;
}

function Snake() {
  let snakeCanvas = table.getContext('2d');
  let hz_position = randomNumber(table.width, 'Snake'), vt_position = randomNumber(table.height, 'Snake');
  this.body = [{h: hz_position, v: vt_position}],
  this.appearance = function(obj) {
    snakeCanvas.beginPath();
    snakeCanvas.fillStyle = 'grey';
    snakeCanvas.fillRect(obj.h, obj.v, 10, 10);
    snakeCanvas.closePath();
  }
  this.direction = {
    hd: 10,
    vd: 0,
  },
  this.add = function() {
    let newHead = {
      h: this.body[0].h + this.direction.hd,
      v: this.body[0].v + this.direction.vd
    }
    this.body.unshift(newHead);
    this.appearance(newHead);
  },
  this.move = function() {
    snakeCanvas.clearRect(this.body[this.body.length - 1].h, this.body[this.body.length - 1].v, 10, 10);
    this.body.pop();
    this.add();
  }
  this.check = function() {
    let headH = this.body[0].h, headV = this.body[0].v, stop = snake.body.length;
    if(headH === 800 || headH === 0 || headV === 600 || headV === 0) { return true; }
    for(let i = 1; i < stop; ++i) {
      if(snake.body[i].h === headH && snake.body[i].v === headV) { return true; }
    }
  }
}

function Food() {
  let foodCanvas = table.getContext('2d');
  this.coordinates = {
    actualHorizontal: 0,
    actualVertical: 0,
    newHorizontal: function() {
      this.actualHorizontal = randomNumber(table.width, 'Food');
      while(this.actualHorizontal <= snake.body[0].h &&  this.actualHorizontal >= snake.body[snake.body.length - 1].h) {
        this.actualHorizontal = randomNumber(table.width, 'Food');
      }
      return this.actualHorizontal;
    },
    newVertical: function() {
      this.actualVertical = randomNumber(table.height, 'Food');
      while(this.actualVertical <= snake.body[0].v &&  this.actualVertical >= snake.body[snake.body.length - 1].v) {
        this.actualVertical = randomNumber(table.height, 'Food');
      }
      return this.actualVertical;
    }
  },
  this.appearance = function() {
    foodCanvas.beginPath();
    foodCanvas.fillStyle = 'green';
    foodCanvas.fillRect(this.coordinates.newHorizontal(), this.coordinates.newVertical(), 10, 10);
  }
}
