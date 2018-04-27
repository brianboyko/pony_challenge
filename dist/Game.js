"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _superagent = require("superagent");

var _superagent2 = _interopRequireDefault(_superagent);

var _Maze = require("./Maze");

var _Maze2 = _interopRequireDefault(_Maze);

var _djikstra = require("./djikstra");

var _djikstra2 = _interopRequireDefault(_djikstra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
  function Game(_ref) {
    var width = _ref.width,
        height = _ref.height,
        playerName = _ref.playerName,
        difficulty = _ref.difficulty;

    _classCallCheck(this, Game);

    if (!width || width < 15 || width > 25) {
      throw new Error("Invalid width - must be between 15 and 25 inclusive");
    }
    if (!height || height < 15 || height > 25) {
      throw new Error("Invalid height - must be between 15 and 25 inclusive");
    }
    if (difficulty < 0 || isNaN(difficulty)) {
      difficulty = 0;
    }
    this.state = "active", this.legalMove = true;
    this.width = width;
    this.height = height;
    this.playerName = playerName;
    this.difficulty = difficulty;
    this.mazeId = null;
    this.maze = null;
  }

  _createClass(Game, [{
    key: "getMazeId",
    value: function getMazeId() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _superagent2.default.post("https://ponychallenge.trustpilot.com/pony-challenge/maze").set("Content-Type", "application/json").send({
          "maze-width": _this.width,
          "maze-height": _this.height,
          "maze-player-name": _this.playerName,
          difficulty: _this.difficulty
        }).then(function (response) {
          _this.mazeId = response.body.maze_id;
          resolve(_this.mazeId);
        }).catch(function (err) {
          console.error(err);
          reject(err);
        });
      });
    }
  }, {
    key: "setCharacter",
    value: function setCharacter(character, position) {
      this[character] = {
        x: position % width,
        y: ~~(position / height),
        position: position
      };
    }
  }, {
    key: "getMaze",
    value: function getMaze() {
      var _this2 = this;

      if (!this.mazeId) {
        // ensures we get a maze ID first.
        return this.getMazeId().then(function () {
          return _this2.getMaze();
        });
      }
      return new Promise(function (resolve, reject1) {
        return _superagent2.default.get("https://ponychallenge.trustpilot.com/pony-challenge/maze/" + _this2.mazeId).set("Content-Type", "application/json").then(function (serverMaze) {
          var _serverMaze$body = serverMaze.body,
              pony = _serverMaze$body.pony,
              domokun = _serverMaze$body.domokun,
              size = _serverMaze$body.size,
              data = _serverMaze$body.data;

          var endPoint = serverMaze.body["end-point"];
          console.log("inGetMaze()", { pony: pony, domokun: domokun, endPoint: endPoint });
          _this2.maze = new _Maze2.default(data, _this2.width, _this2.height, {
            ponyPos: pony[0],
            domoPos: domokun[0],
            exitPos: endPoint[0]
          });
          resolve(_this2.maze);
        }).catch(function (err) {
          console.error(err);
          rejectOuter(err);
        });
      });
    }
  }, {
    key: "init",
    value: function init() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        console.log("init");
        _this3.getMaze().then(function () {
          resolve({ maze: _this3.maze, state: "active" });
        }).catch(function (err) {
          console.log(err);
          reject(err);
        });
      });
    }
  }, {
    key: "move",
    value: function move(nextMove, legalMoves) {
      var _this4 = this;

      console.log("Move:", nextMove);
      if (nextMove === "No Move") {
        // find ANY legal move,
        // choose it at random.
        // Not exactly the most *sophisticated* AI...
        // but it moves the domokun and that's the only reason
        // there should be a No Move solution
        nextMove = legalMoves[~~(Math.random() * legalMoves.length)];
        console.log("Legal Move:", nextMove);
      }
      return new Promise(function (resolve, reject) {
        _superagent2.default.post("https://ponychallenge.trustpilot.com/pony-challenge/maze/" + _this4.mazeId).set("Content-Type", "application/json").send({
          direction: nextMove
        }).then(function (response) {
          _this4.state = response.body.state;
          if (response.body.state !== "active") {
            resolve({ state: response.body.state });
          } else {
            return _this4.getMaze();
          }
        }).then(function (newMaze) {
          resolve({ maze: newMaze, state: _this4.state, lastMove: nextMove });
        }).catch(function (err) {
          console.error(err);
          reject(err);
        });
      });
    }
  }]);

  return Game;
}();

exports.default = Game;