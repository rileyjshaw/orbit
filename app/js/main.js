var dom = require('./dom');
var timer = require('./timer');
var score = require('./score');
var sounds = require('./sounds');

var spacePressed = false;
var blocked = false;
var paused = true;

function done () {
  var val = score.val;
  var highScore = parseInt(localStorage.getItem('highScore'));

  paused = blocked = true;
  dom.score.className = 'shrink';

  if (val > highScore || !highScore) {
    localStorage.setItem('highScore', val);
    highScore = val;
  }

  setTimeout(function () {
    dom.score.innerHTML = 'Score: ' + val + '<br />Best: ' + highScore;
    dom.score.className = 'intro';
    blocked = false;
    score.val = 0;
  }, 1000);
}

function keydown (e) {
  if (!spacePressed && e.keyCode === 32 && !blocked) {
    if (paused) {
      paused = false;
      timer.start(done);
      dom.score.className = '';
      score.inc();
    } else {
      if (timer.lap()) {
        score.inc();
        sounds.click.play();
      }
    }

    spacePressed = true;
  }
}

function keyup (e) {
  if (spacePressed && e.keyCode === 32) {
    spacePressed = false;
  }
}

window.addEventListener('keydown', keydown, false);
window.addEventListener('keyup', keyup, false);
