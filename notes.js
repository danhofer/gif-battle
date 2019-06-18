// each user has an object
const user = {
  ip: req.connection.remoteAddress,
  id: ++playerIdIndex,
  currentGame: null
};

// when a player is added to a game
user.currentGame = runningGames[roomId];

// connecting the user to the current game
user.currentGame = {
  "1": { id: 1, score: 0, isGameLeader: false }, // name added eventually
  roomId: "game1",
  maxRounds: 5,
  currentRound: 0,
  remainingPrompts: [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17
  ],
  playerKeys: [1],
  leader: 1,
  hasGameBegun: false,
  submissions: [],
  totalVotes: 0
};

// stores all the games
const runningGames = {};

// on newGame
// remainingPrompts is filled with all the existing prompt ID numbers

runningGames[roomId] = {
  roomId,
  maxRounds: maxRounds,
  currentRound: 0,
  remainingPrompts: [],
  playerKeys: [user.id],
  leader: user.id,
  hasGameBegun: false,
  submissions: [],
  totalVotes: 0
};

// TO DO
// - fix the errors below

// Error with giphy search box:
// And error when forceSubmit is run:
// Warning: A component is changing an uncontrolled input of type undefined to be controlled.
// Input elements should not switch from uncontrolled to controlled (or vice versa).
// Decide between using a controlled or uncontrolled input element for the lifetime of the component.
// More info: https://fb.me/react-controlled-components
//     in input (at Game.js:234)
//     in div (at Game.js:233)
//     in div (at Game.js:388)
//     in Game (at App.js:115)
//     in div (at App.js:131)
//     in App (at src/index.js:13)

// use event.persist() ? https://reactjs.org/docs/events.html#event-pooling
// https://stackoverflow.com/questions/23123138/perform-debounce-in-react-js (search for event.persist() )

// Error with pressing next round:
// Warning: Failed prop type: You provided a `value` prop to a form field without an `onChange` handler.
// This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
//     in input (at Game.js:234)
//     in div (at Game.js:233)
//     in div (at Game.js:388)
//     in Game (at App.js:115)
//     in div (at App.js:131)
//     in App (at src/index.js:13)
