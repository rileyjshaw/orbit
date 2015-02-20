var dom = require('./dom');

var exports = {
  val: 0 // score value
};

exports.inc = function incScore () {
  dom.score.textContent = ++exports.val;
};

module.exports = exports;
