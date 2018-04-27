"use strict";

var _Game = require("./Game");

var _Game2 = _interopRequireDefault(_Game);

var _djikstra = require("./djikstra");

var _djikstra2 = _interopRequireDefault(_djikstra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log("Starting Pony Challenge Solver");
var maze = void 0;
var move = void 0;
var g = new _Game2.default({
  width: 25,
  height: 20,
  playerName: "twilight sparkle",
  difficulty: 0
});

var end = function end(ending) {
  console.log("Game Over:", ending);
};

var calcMove = function calcMove(maze) {
  var move = (0, _djikstra2.default)(maze);
  console.log(maze.print(move.path));
  return move.nextMove;
};
var count = 0;

var promiseLoop = function promiseLoop(g, maze) {
  console.log("move#", count++);
  var move = calcMove(maze);
  return g.move(move).then(function (postMove) {
    if (postMove.state !== "active") {
      console.log("postMove.state", postMove.state);
      return "done";
    } else {
      return delayLoop(g, postMove.maze);
    }
  });
};

var delayLoop = function delayLoop(g, maze) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      return resolve(promiseLoop(g, maze));
    }, 2000);
  });
};

g.init().then(function (_ref) {
  var maze = _ref.maze,
      state = _ref.state;

  return delayLoop(g, maze).then(function (status) {
    return console.log(status);
  });
}).catch(function (err) {
  return console.error({ err: err });
});