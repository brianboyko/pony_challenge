"use strict";

var _Game = require("./Game");

var _Game2 = _interopRequireDefault(_Game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log("Starting Pony Challenge Solver");

var g = new _Game2.default({ width: 25, height: 20, playerName: "twilight sparkle", difficulty: 0 });
g.init().then(function () {
  return console.log("done");
});