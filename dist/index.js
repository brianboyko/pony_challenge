"use strict";

var _Game = require("./Game");

var _Game2 = _interopRequireDefault(_Game);

var _djikstra = require("./djikstra");

var _djikstra2 = _interopRequireDefault(_djikstra);

var _yargs = require("yargs");

var _yargs2 = _interopRequireDefault(_yargs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log("Starting Pony Challenge Solver");

var argv = _yargs2.default.argv;
// parse command line arguments;

var width = argv.width,
    height = argv.height,
    name = argv.name,
    difficulty = argv.difficulty;

if (!width || width < 15 || width > 25) {
  console.log("Invalid or no width provided. Defaulting to 15");
  width = 15;
}
if (!height || height < 15 || height > 25) {
  console.log("Invalid or no height provided. Defaulting to 15");
  height = 15;
}
if (!name) {
  console.log("Invalid or no name provided. Defaulting to 'Derpy Hooves'");
  name = "Derpy Hooves";
}
if (difficulty === undefined || difficulty === null || difficulty < 0 || difficulty > 10) {
  console.log("Invalid or no difficulty provided. Let's make this easy: Defaulting to 0");
  difficulty = 0;
}

var maze = void 0;
var move = void 0;
var g = new _Game2.default({
  width: width,
  height: height,
  playerName: name,
  difficulty: difficulty
});

var calcMove = function calcMove(maze, priorMove) {
  var d = (0, _djikstra2.default)(maze, priorMove);
  console.log(maze.print(d.path));
  return { nextMove: d.nextMove, legalMoves: d.legalMoves };
};
// count and priorMove available to promiseLoop via closure.
var count = 0;
var priorMove = null;
var promiseLoop = function promiseLoop(g, maze) {
  console.log("move#", count++);

  var _calcMove = calcMove(maze, priorMove),
      nextMove = _calcMove.nextMove,
      legalMoves = _calcMove.legalMoves;

  priorMove = nextMove;
  return g.move(nextMove, legalMoves).then(function (postMove) {
    priorMove = postMove.lastMove;
    if (postMove.state !== "active") {
      if (postMove.state === "won") {
        return "CONGRATULATIONS!";
      }
      if (postMove.state === "over") {
        return "THE DOMOKUN HAS EATEN YOU. DISHONOR ON YOU. DISHONOR ON YOUR FAMILY. DISHONOR ON YOUR COW";
      }
      return postMove.state;
    } else {
      return delayLoop(g, postMove.maze);
    }
  });
};

var DELAY = 0; // for testing - if you want a delay, set it here
var delayLoop = function delayLoop(g, maze) {
  return new Promise(function (resolve) {
    if (DELAY) {
      setTimeout(function () {
        return resolve(promiseLoop(g, maze));
      }, DELAY);
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