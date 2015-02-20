var draw = require('./draw');

var TIME_LIMIT = 1200;
var ACCELERATION = 0.98;
var ACCURACY = 0.15;

var running = false;
var percentage = 0;
var stageTime, lastPoint, done;

function timerLap () {
  var currentTime = Date.now();

  if ((percentage + ACCURACY) % 0.5 / 2 < ACCURACY) {
    stageTime *= ACCELERATION;
    return true;
  } else {
    running = false;
    done();
    return false;
  }
}

function innerLoop () {
  var now = Date.now();
  percentage = (now - lastPoint) / stageTime;

  if (percentage > 1) {
    lastPoint = now;
  }

  draw(percentage);

  if (running) {
    requestAnimationFrame(innerLoop);
  }
}

function timerStart (cb) {
  stageTime = TIME_LIMIT;
  lastPoint = Date.now();
  done = cb;
  running = true;
  innerLoop();
}

module.exports = {
  lap: timerLap,
  start: timerStart
};
