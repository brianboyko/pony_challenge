"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chunk = require("lodash/chunk");

var _chunk2 = _interopRequireDefault(_chunk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Square = function () {
  function Square(position, mazeWidth, mazeHeight) {
    _classCallCheck(this, Square);

    this.position = position;
    this.x = position % mazeWidth;
    this.y = ~~(position / mazeHeight);
    this.north = null;
    this.south = null;
    this.west = null;
    this.east = null;
  }

  _createClass(Square, [{
    key: "setSide",
    value: function setSide(side, square) {
      this[side] = square;
    }
  }, {
    key: "visualize",
    value: function visualize() {
      return [["+", this.north === null ? "x" : " ", "+"].join(""), [this.west === null ? "x" : " ", " ", this.east === null ? "x" : " "].join(""), ["+", this.south === null ? "x" : " ", "+"].join("")];
    }
  }]);

  return Square;
}();

var Maze = function () {
  function Maze(data, mazeWidth, mazeHeight) {
    _classCallCheck(this, Maze);

    this.maze = [new Square(0, mazeWidth, mazeHeight)];
    this.height = mazeHeight;
    this.width = mazeWidth;
    this.origin = this.maze[0];
    for (var i = 1, l = data.length; i < data.length; i++) {
      var sq = new Square(i, mazeWidth, mazeHeight);
      var northWall = data[i].includes("north") || i < mazeWidth;
      var westWall = data[i].includes("west") || i % mazeWidth === 0;
      var southWall = ~~(i / mazeHeight) === mazeHeight - 1;
      var eastWall = i % mazeWidth === mazeWidth - 1;
      var up = i - mazeWidth;
      var left = i - 1;
      if (left > -1 && !westWall) {
        sq.setSide("west", this.maze[left]);
        this.maze[left].setSide("east", sq);
      }
      if (up > -1 && !northWall) {
        sq.setSide("north", this.maze[up]);
        this.maze[up].setSide("south", sq);
      }
      this.maze.push(sq);
    }
  }

  _createClass(Maze, [{
    key: "print",
    value: function print() {
      var visuals = this.maze.map(function (sq) {
        return sq.visualize();
      });
      return (0, _chunk2.default)(visuals, this.width).map(function (row) {
        return row.reduce(function (pv, sq) {
          pv[0] += sq[0];
          pv[1] += sq[1];
          pv[2] += sq[2];
          return pv;
        }, ["", "", ""]).join("\n");
      }).join("\n");
    }
  }]);

  return Maze;
}();

exports.default = Maze;