import Game from './Game';

console.log("Starting Pony Challenge Solver"); 

let g = new Game({width: 25, height: 20, playerName: "twilight sparkle", difficulty: 0})
g.init()
  .then(() => console.log("done"))