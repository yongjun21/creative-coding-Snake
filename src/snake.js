var fps = 20;
var interval = 1000 / fps;
var now;
var then = Date.now();
var direction = 3;

var snakeChain = [];
var headPos = [29, 10];
var foodPos = [0, 0];
var title = document.querySelector('h1');
var playground = document.querySelector('#playground');
var food = document.querySelector('#food');

var snakeTemplate = document.createElement('div');
snakeTemplate.classList.add('piece');

function position (piece, pos) {
  if (pos) {
    piece.style.left = pos[0] * 12 + 5 + 'px';
    piece.style.top = pos[1] * 12 + 5 + 'px';
  } else {
    return [(parseInt(piece.style.left, 10) - 5) / 12,
      (parseInt(piece.style.top, 10) - 5) / 12];
  }
}

for (var i = 0; i < 20; i++) snakeChain.push(snakeTemplate.cloneNode());
snakeChain.forEach(function (piece, idx) {
  position(piece, [headPos[0] - idx, headPos[1]]);
  playground.appendChild(piece);
});

function collide (pos) {
  if (pos[0] < 0) return true;
  if (pos[0] >= 75) return true;
  if (pos[1] < 0) return true;
  if (pos[1] >= 50) return true;
  return snakeChain.some(function (v) {
    console.log(position(v));
    return (position(v)[0] === pos[0]) && (position(v)[1] === pos[1]);
  });
}

function placeFood () {
  do {
    foodPos[0] = Math.floor(Math.random() * 100);
    foodPos[1] = Math.floor(Math.random() * 60);
  } while (collide(foodPos));
  // console.log(foodPos);
  position(food, foodPos);
}

var animate = function () {
  var requestID = window.requestAnimationFrame(animate);
  now = Date.now();
  if (now - then < interval) return;
  direction === 3 ? headPos[0]++
  : direction === 6 ? headPos[1]++
  : direction === 9 ? headPos[0]--
  : headPos[1]--;
  // console.log(headPos);
  if (collide(headPos)) {
    title.textContent = 'GAME OVER';
    window.cancelAnimationFrame(requestID);
    return;
  }
  snakeChain.unshift(snakeTemplate.cloneNode());
  position(snakeChain[0], headPos);
  playground.insertBefore(snakeChain[0], snakeChain[1]);
  if ((headPos[0] - foodPos[0]) || (headPos[1] - foodPos[1])) {
    playground.removeChild(snakeChain.pop());
  } else placeFood();
  then += interval;
};

var listener = function (event) {
  var newDir =
  event.keyCode === 39 ? 3
  : event.keyCode === 40 ? 6
  : event.keyCode === 37 ? 9
  : event.keyCode === 38 ? 12
  : direction;
  direction = (newDir % 6 - direction % 6) ? newDir : direction;
};

placeFood();
document.addEventListener('keydown', listener);
window.requestAnimationFrame(animate);
