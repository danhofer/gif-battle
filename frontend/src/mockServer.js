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

// server.dispatchEvent(new CustomEvent('choose', {detail: {submissions: [{url:'https://media2.giphy.com/media/xTiN0L7EW5trfOvEk0/giphy.gif',text:'hi'}]}}))
// server.dispatchEvent(new CustomEvent('result', {detail: {result: [{url:'https://media2.giphy.com/media/xTiN0L7EW5trfOvEk0/giphy.gif',text:'hi'}]}}))
