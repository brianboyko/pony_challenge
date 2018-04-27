import chunk from "lodash/chunk";

class Square {
  constructor(position, mazeWidth, mazeHeight, { ponyPos, domoPos, exitPos }) {
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
  setSide(side, square) {
    this[side] = square;
  }
  setCharacter(char, bool) {
    if ("pony" === char) {
      this.isPony = bool;
    }
    if ("domo" === char) {
      this.isDomo = bool;
    }
  }
  visualize(pathList) {
    let middle = " ";
    if (this.isPony && this.isDomo) {
      middle = "X"; // for dead
    } else if (this.isExit && this.isPony) {
      middle = "V"; // for victory
    } else if (this.isDomo) {
      middle = "D";
    } else if (this.isPony) {
      middle = "P";
    } else if (this.isExit) {
      middle = "E";
    } else if (pathList && pathList.includes(this.position)) {
      middle = ".";
    } else {
      middle = " ";
    }
    return [
      ["+", this.north === null ? "-" : " ", "+"].join(""),
      [
        this.west === null ? "|" : " ",
        middle,
        this.east === null ? "|" : " "
      ].join(""),
      ["+", this.south === null ? "-" : " ", "+"].join("")
    ];
  }
}

class Maze {
  constructor(data, mazeWidth, mazeHeight, { ponyPos, domoPos, exitPos }) {
    this.maze = [
      new Square(0, mazeWidth, mazeHeight, {
        ponyPos,
        domoPos,
        exitPos
      })
    ];
    this.height = mazeHeight;
    this.width = mazeWidth;
    this.origin = this.maze[0];
    this.ponyPos = ponyPos;
    this.domoPos = domoPos;
    this.exitPos = exitPos;
    for (let i = 1, l = data.length; i < data.length; i++) {
      let sq = new Square(i, mazeWidth, mazeHeight, {
        ponyPos,
        domoPos,
        exitPos
      });
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
  setCharactersInMaze({ ponyPos, domoPos }) {
    const oldPony = this.ponyPos;
    const oldDomo = this.domoPos;
    this.ponyPos = ponyPos;
    this.domoPos = domoPos;
    this.maze[oldPony].setCharacter("pony", false);
    this.maze[this.ponyPos].setCharacter("pony", true);
    this.maze[oldDomo].setCharacter("domo", false);
    this.maze[this.domoPos].setCharacter("domo", true);
  }
  getMaze() {
    return this.maze;
  }
  getSquare(index) {
    return this.maze[index];
  }
  getLength() {
    return this.width * this.height;
  }
  print(pathList) {
    let visuals = this.maze.map((sq, i) => sq.visualize(pathList));
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
