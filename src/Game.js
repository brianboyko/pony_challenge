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
  setCharacter(character, position, width, height) {
    this[character] = {
      x: position % width,
      y: ~~(position / height),
      position
    };
  }
  getMaze() {
    if (!this.mazeId) {
      // ensures we get a maze ID first.
      return this.getMazeId().then(() => this.getMaze());
    }
    return new Promise((resolve, reject) =>
      Promise.all([
        new Promise((resolve, reject) =>
          request
            .get(
              `https://ponychallenge.trustpilot.com/pony-challenge/maze/${
                this.mazeId
              }`
            )
            .set("Content-Type", "application/json")
            .then(response => resolve(response))
        ),
        new Promise((resolve, reject) =>
          request
            .get(
              `https://ponychallenge.trustpilot.com/pony-challenge/maze/${
                this.mazeId
              }/print`
            )
            .set("Content-Type", "application/json")
            .then(response => resolve(response))
        )
      ])
        .then(([maze, print]) => {
          const { pony, domokun, size, data } = maze.body;
          const endPoint = maze.body["end-point"];
          this.setCharacter("pony", pony[0], size[0], size[1]);
          this.setCharacter("exit", endPoint[0], size[0], size[1]);
          this.setCharacter("domokun", domokun[0], size[0], size[1]);
          this.mazeData = data;
          this.mazePrint = print.body;
          resolve();
        })
        .catch(err => {
          console.error(err);
          reject(err);
        })
    );
  }
  init() {
    return new Promise((resolve, reject) => {
      this.getMaze()
        .then(() => {
          console.log(this);
          this.maze = new Maze(this.mazeData, this.width, this.height, {
            ponyPos: this.pony.position,
            domoPos: this.domokun.position,
            exitPos: this.exit.position
          });
          console.log("CONTROL");
          console.log(this.mazePrint);
          console.log("Experiment");
          const myLittleDjikstra = djikstra(this.maze, {
            ponyPos: this.pony.position,
            domoPos: this.domokun.position,
            exitPos: this.exit.position
          });
          console.log(myLittleDjikstra);
          console.log(this.maze.print(myLittleDjikstra.path));
          resolve("DONE");
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }
}

export default Game;
