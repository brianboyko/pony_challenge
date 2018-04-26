"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _superagent = require("superagent");

var _superagent2 = _interopRequireDefault(_superagent);

var _Maze = require("./Maze");

var _Maze2 = _interopRequireDefault(_Maze);

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
    this.width = width;
    this.height = height;
    this.playerName = playerName;
    this.difficulty = difficulty;
    this.mazeId = null;
    this.pony = {
      x: null,
      y: null,
      position: null
    };
    this.exit = {
      x: null,
      y: null,
      position: null
    };
    this.domokun = {
      x: null,
      y: null,
      position: null
    };
    this.mazeData = null;
    this.mazePrint = null;
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
    value: function setCharacter(character, position, width, height) {
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
      return new Promise(function (resolve, reject) {
        return Promise.all([new Promise(function (resolve, reject) {
          return _superagent2.default.get("https://ponychallenge.trustpilot.com/pony-challenge/maze/" + _this2.mazeId).set("Content-Type", "application/json").then(function (response) {
            return resolve(response);
          });
        }), new Promise(function (resolve, reject) {
          return _superagent2.default.get("https://ponychallenge.trustpilot.com/pony-challenge/maze/" + _this2.mazeId + "/print").set("Content-Type", "application/json").then(function (response) {
            return resolve(response);
          });
        })]).then(function (_ref2) {
          var _ref3 = _slicedToArray(_ref2, 2),
              maze = _ref3[0],
              print = _ref3[1];

          var _maze$body = maze.body,
              pony = _maze$body.pony,
              domokun = _maze$body.domokun,
              size = _maze$body.size,
              data = _maze$body.data;
          var endPoint = maze.body["end-point"].endPoint;

          _this2.setCharacter("pony", pony, size[0], size[1]);
          _this2.setCharacter("exit", endPoint, size[0], size[1]);
          _this2.setCharacter("domokun", domokun, size[0], size[1]);
          _this2.mazeData = data;
          _this2.mazePrint = print.body;
          resolve();
        }).catch(function (err) {
          console.error(err);
          reject(err);
        });
      });
    }
  }, {
    key: "init",
    value: function init() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.getMaze().then(function () {
          _this3.maze = new _Maze2.default(_this3.mazeData, _this3.width, _this3.height);
          console.log("CONTROL");
          console.log(_this3.mazePrint);
          console.log("Experiment");
          console.log(_this3.maze.print());
          resolve("DONE");
        }).catch(function (err) {
          console.log(err);
          reject(err);
        });
      });
    }
  }]);

  return Game;
}();

exports.default = Game;