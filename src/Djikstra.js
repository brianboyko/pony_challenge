// Edgar Djikstra is a famous *Dutch* computer scientist.
// Realizing you're a Dutch company gave me a BIG clue
// :)

const oppositeDirection = {
  north: "south",
  south: "north",
  west: "east",
  east: "west"
};

class DjikstraMap {
  constructor(length) {
    this.map = Array(length).fill({
      distance: Infinity,
      previous: null
    });
    this.visited = this.map.reduce((pv, cv, i) => {
      pv[i] = false;
      return pv;
    }, {});
    this.path = [];
  }
  getNode(index) {
    return this.map[index];
  }
  getDistance(index) {
    return this.map[index].distance;
  }
  getPrevious(index) {
    return this.map[index].previous;
  }
  getMap() {
    return this.map;
  }
  isVisited(index) {
    return this.visited[index];
  }
  setEntry(index, { distance, previous }) {
    this.map[index] = { distance, previous };
  }
  setVisited(index) {
    this.visited[index] = true;
  }
  getVisitedList() {
    return this.visited;
  }
  getPath(start, end) {
    if (!this.isVisited(end)) {
      console.log(this.getNode(end));
      return null;
    }
    while (end !== start) {
      this.path.push(end);
      end = this.getPrevious(end);
    }
    return this.path.reverse();
  }
}

// find the shortest distance from the pony position to every other
// (reachable) destination.

const djikstra = maze => {
  const { ponyPos, domoPos, exitPos } = maze;
  // distances that are unknown are assumed to be infinity
  const djikstraMap = new DjikstraMap(maze.getLength());

  // don't visit me if I don't exist, or I contain a monster, or you've visited before.
  const _visitMe = (workingMap, direction, node) =>
    node[direction] !== null &&
    !node[direction].isDomo &&
    !workingMap.isVisited(node.position);

  const _visitVert = (
    dMap,
    currNode,
    prevNode = null,
    originDirection = null
  ) => {
    // distance should only be 0 for our origin, otherwise prevNode will be defined.
    // for the current vertex, calculate the distance of each neighbor from the start (i.e., add one);
    let distance = prevNode ? dMap.getDistance(prevNode.position) + 1 : 0;

    // if that distance is less than the current best known route, let the
    // dMap reflect our shorter distance and the new previous node (by index/position);
    if (distance < dMap.getDistance(currNode.position)) {
      dMap.setEntry(currNode.position, {
        distance,
        previous: prevNode ? prevNode.position : null
      });
    }
    // visit all adjecent unvisited nodes that do not have
    // a big nasty monster.
    ["north", "west", "south", "east"].forEach(direction => {
      if (
        direction !== originDirection &&
        _visitMe(dMap, direction, currNode)
      ) {
        _visitVert(
          dMap,
          currNode[direction],
          currNode,
          oppositeDirection[direction]
        );
      }
    });
    dMap.setVisited(currNode.position);
    // add the current vertex to the list of visited vertices
  };

  _visitVert(djikstraMap, maze.getSquare(ponyPos));

  const exitAccessible = djikstraMap.isVisited(exitPos);
  const pathway = djikstraMap.getPath(ponyPos, exitPos);
  const getNextMove = (a, b) => {
    let calc = a - b;
    // if it's not one-away,
    // it must be north and south.
    // all negative numbers mean north;
    // all positive numbers mean south;
    if (calc === 1) {
      return "west";
    }
    if (calc === -1) {
      return "east";
    }
    if (calc > 0) {
      return "north";
    }
    if (calc < 0) {
      return "south";
    }
    throw new Error("This should never happen - no move", a, b);
  };
  return {
    map: djikstraMap.getMap(),
    path: pathway,
    visitedList: djikstraMap.getVisitedList(),
    nextMove: pathway ? getNextMove(ponyPos, pathway[0]) : "No Move" // only first two values actually used;
  };
};

export default djikstra;
