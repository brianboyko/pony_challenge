import request from "superagent";
import Maze from "./Maze";
import djikstra from "./djikstra";

class Game {
  constructor({ width, height, playerName, difficulty }) {
    if (!width || width < 15 || width > 25) {
      throw new Error("Invalid width - must be between 15 and 25 inclusive");
    }
    if (!height || height < 15 || height > 25) {
      throw new Error("Invalid height - must be between 15 and 25 inclusive");
    }
    if (difficulty < 0 || isNaN(difficulty)) {
      difficulty = 0;
    }
    (this.state = "active"), (this.legalMove = true);
    this.width = width;
    this.height = height;
    this.playerName = playerName;
    this.difficulty = difficulty;
    this.mazeId = null;
    this.maze = null;
  }
  getMazeId() {
    return new Promise((resolve, reject) => {
      request
        .post(`https://ponychallenge.trustpilot.com/pony-challenge/maze`)
        .set("Content-Type", "application/json")
        .send({
          "maze-width": this.width,
          "maze-height": this.height,
          "maze-player-name": this.playerName,
          difficulty: this.difficulty
        })
        .then(response => {
          this.mazeId = response.body.maze_id;
          resolve(this.mazeId);
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
    });
  }
  setCharacter(character, position) {
    this[character] = {
      x: position % width,
      y: ~~(position / height),
      position
    };
  }
  getMaze() {
    if (!this.mazeId) {
      // ensures we get a maze ID first.
      return this.getMazeId().then(() => {
        return this.getMaze();
      });
    }
    return new Promise((resolve, reject1) =>
      request
        .get(
          `https://ponychallenge.trustpilot.com/pony-challenge/maze/${
            this.mazeId
          }`
        )
        .set("Content-Type", "application/json")
        .then(serverMaze => {
          const { pony, domokun, size, data } = serverMaze.body;
          const endPoint = serverMaze.body["end-point"];
          this.maze = new Maze(data, this.width, this.height, {
            ponyPos: pony[0],
            domoPos: domokun[0],
            exitPos: endPoint[0]
          });
          resolve(this.maze);
        })
        .catch(err => {
          console.error(err);
          rejectOuter(err);
        })
    );
  }
  init() {
    return new Promise((resolve, reject) => {
      console.log("init");
      this.getMaze()
        .then(() => {
          resolve({ maze: this.maze, state: "active" });
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }
  move(nextMove, legalMoves) {
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
    return new Promise((resolve, reject) => {
      request
        .post(
          `https://ponychallenge.trustpilot.com/pony-challenge/maze/${
            this.mazeId
          }`
        )
        .set("Content-Type", "application/json")
        .send({
          direction: nextMove
        })
        .then(response => {
          this.state = response.body.state;
          if (response.body.state !== "active") {
            resolve({ state: response.body.state });
          } else {
            return this.getMaze();
          }
        })
        .then(newMaze => {
          resolve({ maze: newMaze, state: this.state, lastMove: nextMove });
        })
        .catch(err => {
          console.error({err});
          reject(err);
        });
    });
  }
}

export default Game;
