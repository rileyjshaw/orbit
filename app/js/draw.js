var dom = require('./dom');

var WIDTH = 540;
var HEIGHT = 540;
var RADIUS = Math.min(WIDTH, HEIGHT) * 0.4;
var PI2 = Math.PI * 2;
var PHASE_SHIFT = 0.125;
var MARKER_ANGLE = 45;
var MARKER_POS = Math.sin(PI2 / 360 * MARKER_ANGLE);
var SHADOW_OFFSET = 12;
var WHITE = '#dfdede';
var RED = '#ef575b';
var DARK_BLUE = '#0a1340';

dom.canvas.width = WIDTH;
dom.canvas.height = HEIGHT;

dom.ctx.strokeStyle = DARK_BLUE;
dom.ctx.lineWidth = 4;

function draw (percentage) {
  var shifted = percentage + PHASE_SHIFT;
  var x = Math.cos(shifted * PI2);
  var y = Math.sin(shifted * PI2);
  var shadow = Array.apply(null, new Array(SHADOW_OFFSET));

  // clear
  dom.ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // draw line
  dom.ctx.beginPath();
  dom.ctx.arc(WIDTH / 2, HEIGHT / 2, RADIUS, 0, PI2);
  dom.ctx.closePath();
  dom.ctx.stroke();

  // draw markers
  dom.ctx.fillStyle = RED;
  dom.ctx.beginPath();
  dom.ctx.arc(WIDTH / 2 + RADIUS * MARKER_POS, HEIGHT / 2 + RADIUS * MARKER_POS, 6, 0, PI2);
  dom.ctx.arc(WIDTH / 2 - RADIUS * MARKER_POS, HEIGHT / 2 - RADIUS * MARKER_POS, 6, 0, PI2);
  dom.ctx.closePath();
  dom.ctx.fill();

  // draw circle
  dom.ctx.fillStyle = WHITE;
  dom.ctx.beginPath();
  dom.ctx.arc(RADIUS * x + WIDTH / 2, RADIUS * y + HEIGHT / 2, 24, 0, PI2);
  dom.ctx.closePath();
  dom.ctx.fill();

  // text shadow
  dom.score.style.textShadow = shadow.map(function (_, i) {
    return Math.round(-x * i) + 'px ' + Math.round(-y * i) + 'px ' + DARK_BLUE;
  }).toString();
}

draw(0);

module.exports = draw;
