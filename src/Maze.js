import chunk from "lodash/chunk";

class Square {
  constructor(position, mazeWidth, mazeHeight) {
    this.position = position;
    this.x = position % mazeWidth;
    this.y = ~~(position / mazeHeight);
    this.north = null;
    this.south = null;
    this.west = null;
    this.east = null;
  }
  setSide(side, square) {
    this[side] = square;
  }
  visualize() {
    return [
      ["+", this.north === null ? "x" : " ", "+"].join(""),
      [
        this.west === null ? "x" : " ",
        " ",
        this.east === null ? "x" : " "
      ].join(""),
      ["+", this.south === null ? "x" : " ", "+"].join("")
    ];
  }
}

class Maze {
  constructor(data, mazeWidth, mazeHeight) {
    this.maze = [new Square(0, mazeWidth, mazeHeight)];
    this.height = mazeHeight;
    this.width = mazeWidth;
    this.origin = this.maze[0];
    for (let i = 1, l = data.length; i < data.length; i++) {
      let sq = new Square(i, mazeWidth, mazeHeight);
      let northWall = data[i].includes("north") || i < mazeWidth;
      let westWall = data[i].includes("west") || i % mazeWidth === 0;
      let southWall = ~~(i / mazeHeight) === mazeHeight - 1;
      let eastWall = i % mazeWidth === mazeWidth - 1;
      let up = i - mazeWidth;
      let left = i - 1;
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

  print() {
    let visuals = this.maze.map(sq => sq.visualize());
    return chunk(visuals, this.width)
      .map(row =>
        row
          .reduce(
            (pv, sq) => {
              pv[0] += sq[0];
              pv[1] += sq[1];
              pv[2] += sq[2];
              return pv;
            },
            ["", "", ""]
          )
          .join("\n")
      )
      .join("\n");
  }
}

export default Maze;
