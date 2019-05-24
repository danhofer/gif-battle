export class MockServer extends EventTarget {
	// staging
	async newGame() {
		console.log('ran newGame() on server')

		this.dispatchEvent(
			new CustomEvent('joinedLobby', {
				detail: { roomId: 'fakeId', isGameLeader: true },
			})
		)
		// await new Promise (x => setTimeout(x, 5000))
		return
	}

	async joinLobby(roomId) {
		console.log('ran joinLobby() on server:', roomId)
		if (roomId === 'bad id') return Promise.resolve(false)

		this.dispatchEvent(
			new CustomEvent('joinedLobby', {
				detail: { roomId, isLeader: false },
			})
		)
		return Promise.resolve(true)
	}

	// lobby
	async setName(username) {
		console.log('ran setName() on server:', username)
		this.dispatchEvent(
			new CustomEvent('playerJoined', { detail: { name: username } })
		)
		return
	}

	async startGame() {
		console.log('ran startGame() on server')
		await this.dispatchEvent(new CustomEvent('gameStarted'))
		this.dispatchEvent(
			new CustomEvent('prompt', {
				detail: { prompt: 'how do you feel about this crazy thing!!!' },
			})
		)
		return
	}

	// game
	async setSubmission(submissionUrl, gifText, promptId) {
		console.log(
			'ran setSubmission() on server: ',
			submissionUrl,
			gifText,
			promptId
		)
		return
	}

	async vote(voteIndex) {
		console.log('ran vote() on server:', voteIndex)
		return
	}
}

// game component:
// need to getPrompt()
// need timer (will replace submit button)
// need toPodium()

////

// export interface Actions {
//   /**
//    * @returns game id
//    */
//-   newGame(): Promise<string>;
//   /**
//    * @returns true if the game was found
//    */
//--->   joinLobby(gameId: string): Promise<boolean>; // CHANGED FROM "joinGame"

//-   setName(params: string);
//    leave(); WOULD THIS BE A WEBSOCKET THING?
//-   startGame();

//-   setSubmission(params: {
//     url: string,
//     text: string,
//     promptId: number
//   });
//   confirmSubmission(); SUBMISSION SENT WHEN TIMER HITS ZERO?
//-   vote(params: {
//     index: number,
//     promptId: number THERE IS ONLY ONE PROMPT PER ROUND?
//   });
// }

// interface Player {
//   name: string,
//   id: number
// }

// export interface Events {
//-   playerJoined(params : Player);
//-   playerLeft(params: Player);
//-->   gameStarted();
//-   prompt(params: {
//     url?: string,
//     text?: string,
//     promptId: number
//   });
//-   choose(params: {
//     promptId: number
//     submissions: Array<{
//       url: string,
//       text: string,
//       player: Player
//     }>
//   });
//-   result(params: {
//     promptId: number,
//     submissions: Array<{
//       url: string,
//       text: string,
//       player: Player,
//       votes: number
//     }>
//   });
//-   finalResult(params: Array<{
//     player: Player,
//     points: number
//   }>);
// }

// ADDED joinedLobby()

// server.dispatchEvent(new CustomEvent('choose', {detail: {submissions: [{url:'https://media2.giphy.com/media/xTiN0L7EW5trfOvEk0/giphy.gif',text:'hi'}]}}))
// server.dispatchEvent(new CustomEvent('result', {detail: {result: [{url:'https://media2.giphy.com/media/xTiN0L7EW5trfOvEk0/giphy.gif',text:'hi'}]}}))

// voting && isVoter - need a border on selected gif
// voting && !isVoter
// end

/*
Notes
-onKeydown onKeyDown? (see skype)
*/
