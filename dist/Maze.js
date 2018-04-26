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
  function Square(position, mazeWidth, mazeHeight, _ref) {
    var ponyPos = _ref.ponyPos,
        domoPos = _ref.domoPos,
        exitPos = _ref.exitPos;

    _classCallCheck(this, Square);

    this.position = position;
    this.x = position % mazeWidth;
    this.y = ~~(position / mazeHeight);
    this.north = null;
    this.south = null;
    this.west = null;
    this.east = null;
    this.isPony = ponyPos === position;
    this.isDomo = domoPos === position;
    this.isExit = exitPos === position;
  }

  _createClass(Square, [{
    key: "setSide",
    value: function setSide(side, square) {
      this[side] = square;
    }
  }, {
    key: "setCharacter",
    value: function setCharacter(char, bool) {
      if ("pony" === char) {
        this.isPony = bool;
      }
      if ("domo" === char) {
        this.isDomo = bool;
      }
    }
  }, {
    key: "visualize",
    value: function visualize(pathList) {
      var middle = " ";
      if (this.isPony && this.isDomo) {
        middle = "X"; // for dead
        console.log("GAME OVER");
      } else if (this.isExit && this.isPony) {
        middle = "V"; // for victory
        console.log("VICTORY!");
      } else if (this.isDomo) {
        middle = "D";
      } else if (this.isPony) {
        middle = "P";
      } else if (this.isExit) {
        middle = "E";
      } else if (pathList && pathList.includes(this.position)) {
        middle = ".";
      }
      return [["+", this.north === null ? "-" : " ", "+"].join(""), [this.west === null ? "|" : " ", middle, this.east === null ? "|" : " "].join(""), ["+", this.south === null ? "-" : " ", "+"].join("")];
    }
  }]);

  return Square;
}();

var Maze = function () {
  function Maze(data, mazeWidth, mazeHeight, _ref2) {
    var ponyPos = _ref2.ponyPos,
        domoPos = _ref2.domoPos,
        exitPos = _ref2.exitPos;

    _classCallCheck(this, Maze);

    console.log({ ponyPos: ponyPos, domoPos: domoPos, exitPos: exitPos });
    this.maze = [new Square(0, mazeWidth, mazeHeight, {
      ponyPos: ponyPos,
      domoPos: domoPos,
      exitPos: exitPos
    })];
    this.height = mazeHeight;
    this.width = mazeWidth;
    this.origin = this.maze[0];
    this.ponyPos = ponyPos;
    this.domoPos = domoPos;
    this.exitPos = exitPos;
    for (var i = 1, l = data.length; i < data.length; i++) {
      var sq = new Square(i, mazeWidth, mazeHeight, {
        ponyPos: ponyPos,
        domoPos: domoPos,
        exitPos: exitPos
      });
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
    key: "setCharactersInMaze",
    value: function setCharactersInMaze(_ref3) {
      var ponyPos = _ref3.ponyPos,
          domoPos = _ref3.domoPos;

      var oldPony = this.ponyPos;
      var oldDomo = this.domoPos;
      this.ponyPos = ponyPos;
      this.domoPos = domoPos;
      this.maze[oldPony].setCharacter("pony", false);
      this.maze[this.ponyPos].setCharacter("pony", true);
      this.maze[oldDomo].setCharacter("domo", false);
      this.maze[this.domoPos].setCharacter("domo", true);
    }
  }, {
    key: "getMaze",
    value: function getMaze() {
      return this.maze;
    }
  }, {
    key: "getSquare",
    value: function getSquare(index) {
      return this.maze[index];
    }
  }, {
    key: "getLength",
    value: function getLength() {
      return this.width * this.height;
    }
  }, {
    key: "print",
    value: function print(pathList) {
      var visuals = this.maze.map(function (sq, i) {
        return sq.visualize(pathList);
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