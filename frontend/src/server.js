export class Server extends EventTarget {
    constructor() {
        super()
        const ip = process.env.REACT_APP_PUBLIC_IP || 'localhost'
        this.websocket = new WebSocket(`ws://${ip}:8080`)
        this.websocket.onopen = () => {
            if (document.location.hash) {
                this.joinLobby(document.location.hash.slice(1))
            }
        }
        this.websocket.addEventListener('message', event => {
            const message = JSON.parse(event.data)

            if (message.method) {
                this.dispatchEvent(
                    new CustomEvent(message.method, { detail: message.params })
                )
            } else {
                this.callbacks[message.id](message)
            }
        })
        this.messageId = 0
        this.callbacks = {}
    }

    async send(method, params = {}) {
        let callback
        const id = ++this.messageId
        const promise = new Promise(x => (callback = x))

        this.callbacks[id] = callback

        this.websocket.send(
            JSON.stringify({
                method,
                params,
                id,
            })
        )

        const response = await promise
        return response.result
    }

    // staging
    async newGame() {
        await this.send('newGame')
        return
    }

    async joinLobby(roomId) {
        return await this.send('joinLobby', { roomId })
    }

    // lobby
    async setName(username) {
        return await this.send('setName', { username })
    }

    async startGame() {
        await this.send('startGame')
        return
    }

    // game
    async setSubmission(submissionUrl, gifText) {
        await this.send('setSubmission', {
            submissionUrl,
            gifText,
        })
        return
    }

    async vote(voteIndex) {
        await this.send('vote', { voteIndex })
        return
    }

    async newRound() {
        await this.send('newRound')
        return
    }

    async endGame() {
        await this.send('endGame')
        return
    }
}

////

// server.dispatchEvent(new CustomEvent('choose', {detail: {submissions: [{url:'https://media2.giphy.com/media/xTiN0L7EW5trfOvEk0/giphy.gif',text:'hi'}]}}))
// server.dispatchEvent(new CustomEvent('result', {detail: {result: [{url:'https://media2.giphy.com/media/xTiN0L7EW5trfOvEk0/giphy.gif',text:'hi'}]}}))
