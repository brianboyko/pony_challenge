// Edgar Djikstra is a famous *Dutch* computer scientist.
// Realizing you're a Dutch company gave me a BIG clue
// :)

const oppositeDirection = {
  north: "south",
  south: "north",
  west: "east",
  east: "west"
};

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
  throw new Error("This should never happen", a, b);
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

class Djikstra {
  constructor(maze, priorMove = null) {
    this.ponyPos = maze.ponyPos;
    this.domoPos = maze.domoPos;
    this.exitPos = maze.exitPos;
    this.maze = maze;
    this.priorMove = priorMove;
    this.map = new DjikstraMap(this.maze.getLength());
    this.isExitAccessible = null; // null in this case is unknown.
  }
  visitMe(direction, node) {
    return (
      node[direction] !== null &&
      !node[direction].isDomo &&
      !this.map.isVisited(node.position)
    );
  }
  visitVert(currNode, prevNode = null, originDirection = null) {
    // distance should only be 0 for our origin, otherwise prevNode will be defined.
    // for the current vertex, calculate the distance of each neighbor from the start (i.e., add one);
    const distance = prevNode ? this.map.getDistance(prevNode.position) + 1 : 0;

    // if that distance is less than the current best known route, let the
    // this.map reflect our shorter distance and the new previous node (by index/position);
    if (distance < this.map.getDistance(currNode.position)) {
      this.map.setEntry(currNode.position, {
        distance,
        previous: prevNode ? prevNode.position : null
      });
    }
    // visit all adjecent unvisited nodes that do not have
    // a big nasty monster.
    ["north", "west", "south", "east"].forEach(direction => {
      if (
        direction !== originDirection &&
        this.visitMe(direction, currNode)
      ) {
        this.visitVert(
          currNode[direction],
          currNode,
          oppositeDirection[direction]
        );
      }
    });
    this.map.setVisited(currNode.position);
    // add the current vertex to the list of visited vertices
  }
  traverse() {
    this.visitVert(this.maze.getSquare(this.ponyPos));
    this.isExitAccessible = this.map.isVisited(this.exitPos);
    return this;
  }
  getLegalMoves() {
    let returningMove = oppositeDirection[this.priorMove];
    let square = this.maze.getSquare(this.ponyPos);
    let legalMoves = ["west", "east", "north", "south"].filter(dir => {
      return square[dir] !== null;
    });
    // if there's more than one legal move, remove any
    // that have a monster, as that will end the game
    if (legalMoves.length > 1) {
      legalMoves = legalMoves.filter(dir => !square[dir].isDomo);
    }
    // if there's still more than one legal move, try *not* to backtrack
    if (this.priorMove && legalMoves.length > 1) {
      legalMoves = legalMoves.filter(dir => dir !== returningMove);
    }
    return legalMoves;
  }
  solve() {
    this.traverse();
    const pathway = this.map.getPath(this.ponyPos, this.exitPos);
    return {
      map: this.map.getMap(),
      pathway,
      visitedList: this.map.getVisitedList(),
      legalMoves: this.getLegalMoves(),
      nextMove: pathway ? getNextMove(this.ponyPos, pathway[0]) : "No Move"
    };
  }
}
export default Djikstra;
