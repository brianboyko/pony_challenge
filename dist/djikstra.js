"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Edgar Djikstra is a famous *Dutch* computer scientist.
// Realizing you're a Dutch company gave me a BIG clue
// :)

var oppositeDirection = {
  north: "south",
  south: "north",
  west: "east",
  east: "west"
};

var DjikstraMap = function () {
  function DjikstraMap(length) {
    _classCallCheck(this, DjikstraMap);

    this.map = Array(length).fill({
      distance: Infinity,
      previous: null
    });
    this.visited = this.map.reduce(function (pv, cv, i) {
      pv[i] = false;
      return pv;
    }, {});
    this.path = [];
  }

  _createClass(DjikstraMap, [{
    key: "getNode",
    value: function getNode(index) {
      return this.map[index];
    }
  }, {
    key: "getDistance",
    value: function getDistance(index) {
      return this.map[index].distance;
    }
  }, {
    key: "getPrevious",
    value: function getPrevious(index) {
      return this.map[index].previous;
    }
  }, {
    key: "getMap",
    value: function getMap() {
      return this.map;
    }
  }, {
    key: "isVisited",
    value: function isVisited(index) {
      return this.visited[index];
    }
  }, {
    key: "setEntry",
    value: function setEntry(index, _ref) {
      var distance = _ref.distance,
          previous = _ref.previous;

      this.map[index] = { distance: distance, previous: previous };
    }
  }, {
    key: "setVisited",
    value: function setVisited(index) {
      this.visited[index] = true;
    }
  }, {
    key: "getVisitedList",
    value: function getVisitedList() {
      return this.visited;
    }
  }, {
    key: "getPath",
    value: function getPath(start, end) {
      console.log(start, end);
      if (!this.isVisited(end)) {
        console.log("end not visited");
        console.log(this.getNode(end));
        return null;
      }
      while (end !== start) {
        this.path.push(end);
        end = this.getPrevious(end);
      }
      return this.path.reverse();
    }
  }]);

  return DjikstraMap;
}();

// find the shortest distance from the pony position to every other
// (reachable) destination.


var djikstra = function djikstra(maze, _ref2) {
  var ponyPos = _ref2.ponyPos,
      domoPos = _ref2.domoPos,
      exitPos = _ref2.exitPos;

  // distances that are unknown are assumed to be infinity
  var djikstraMap = new DjikstraMap(maze.getLength());

  // don't visit me if I don't exist, or I contain a monster, or you've visited before.
  var _visitMe = function _visitMe(workingMap, direction, node) {
    return node[direction] !== null && !node[direction].isDomo && !workingMap.isVisited(node.position);
  };

  var _visitVert = function _visitVert(dMap, currNode) {
    var prevNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var originDirection = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    // distance should only be 0 for our origin, otherwise prevNode will be defined.
    // for the current vertex, calculate the distance of each neighbor from the start (i.e., add one);
    var distance = prevNode ? dMap.getDistance(prevNode.position) + 1 : 0;

    // if that distance is less than the current best known route, let the
    // dMap reflect our shorter distance and the new previous node (by index/position);
    if (distance < dMap.getDistance(currNode.position)) {
      dMap.setEntry(currNode.position, {
        distance: distance,
        previous: prevNode ? prevNode.position : null
      });
    }
    // visit all adjecent unvisited nodes that do not have
    // a big nasty monster.
    ["north", "west", "south", "east"].forEach(function (direction) {
      if (direction !== originDirection && _visitMe(dMap, direction, currNode)) {
        _visitVert(dMap, currNode[direction], currNode, oppositeDirection[direction]);
      }
    });
    dMap.setVisited(currNode.position);
    // add the current vertex to the list of visited vertices
  };

  _visitVert(djikstraMap, maze.getSquare(ponyPos));

  var exitAccessible = djikstraMap.isVisited(exitPos);
  return {
    map: djikstraMap.getMap(),
    path: djikstraMap.getPath(ponyPos, exitPos),
    visitedList: djikstraMap.getVisitedList()
  };
};

exports.default = djikstra;