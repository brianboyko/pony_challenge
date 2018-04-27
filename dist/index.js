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

var calcMove = function calcMove(maze, priorMove) {
  var d = (0, _djikstra2.default)(maze, priorMove);
  console.log(maze.print(d.path));
  return { nextMove: d.nextMove, legalMoves: d.legalMoves };
};

var count = 0;
var priorMove = null;
var promiseLoop = function promiseLoop(g, maze) {
  console.log("move#", count++);

  var _calcMove = calcMove(maze, priorMove),
      nextMove = _calcMove.nextMove,
      legalMoves = _calcMove.legalMoves;

  console.log({ nextMove: nextMove, legalMoves: legalMoves });
  priorMove = nextMove;
  return g.move(nextMove, legalMoves).then(function (postMove) {
    priorMove = postMove.lastMove;
    if (postMove.state !== "active") {
      console.log("postMove.state", postMove.state);
      if (postMove.state === "won") {
        return "CONGRATULATIONS!";
      }
      return postMove.state;
    } else {
      return delayLoop(g, postMove.maze);
    }
  });
};

var DELAY = 0;
var delayLoop = function delayLoop(g, maze) {
  return new Promise(function (resolve) {
    if (DELAY) {
      setTimeout(function () {
        return resolve(promiseLoop(g, maze));
      }, 2000);
    } else {
      resolve(promiseLoop(g, maze));
    }
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