const prompts = require('./prompts.js')

const WebSocket = require('ws')

const EventEmitter = require('events')
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter()

const port = 8080

const wss = new WebSocket.Server({ port })

log(`Server started on port: ${port}`)

const runningGames = {}

const maxRounds = 5
const roundSeconds = 120

// TO DO - find way to make roomId random
let roomIdIndex = 0
let playerIdIndex = 0

function newPlayer(user, ws) {
    user.currentGame[user.id] = {
        id: user.id,
        score: 0,
        isGameLeader: false,
        playerJoined: name => {
            ws.send(
                JSON.stringify({
                    method: 'playerJoined',
                    params: {
                        name,
                    },
                })
            )
        },
        playerLeft: name => {
            ws.send(
                JSON.stringify({
                    method: 'playerLeft',
                    params: {
                        name,
                    },
                })
            )
        },
        setLeader: () => {
            ws.send(
                JSON.stringify({
                    method: 'setLeader',
                    params: {
                        isGameLeader: true,
                    },
                })
            )
        },
        gameStarted: () => {
            ws.send(
                JSON.stringify({
                    method: 'gameStarted',
                })
            )
        },
        scores: scores => {
            ws.send(
                JSON.stringify({
                    method: 'scores',
                    params: {
                        scores,
                    },
                })
            )
        },
        round: (currentRound, maxRounds, roundSeconds) => {
            ws.send(
                JSON.stringify({
                    method: 'round',
                    params: {
                        currentRound,
                        maxRounds,
                        roundSeconds,
                    },
                })
            )
        },
        prompt: (promptId, promptText, promptUrl, promptSite) => {
            ws.send(
                JSON.stringify({
                    method: 'prompt',
                    params: {
                        promptId,
                        promptText,
                        promptUrl,
                        promptSite,
                    },
                })
            )
        },
        forceVote: () => {
            ws.send(
                JSON.stringify({
                    method: 'forceVote',
                })
            )
        },
        sendChoices: submissions => {
            let ownSubmissionIndex
            for (let i = 0; i < submissions.length; i++) {
                if (submissions[i].playerId === user.id) ownSubmissionIndex = i
            }
            const otherSubmissions = submissions.slice()
            otherSubmissions.splice(ownSubmissionIndex, 1, {})

            ws.send(
                JSON.stringify({
                    method: 'choose',
                    params: {
                        submissions: otherSubmissions,
                    },
                })
            )
        },
        result: result => {
            ws.send(
                JSON.stringify({
                    method: 'result',
                    params: {
                        result,
                    },
                })
            )
        },
        newRound: () => {
            ws.send(
                JSON.stringify({
                    method: 'newRound',
                })
            )
        },
        finalResult: finalScores => {
            ws.send(
                JSON.stringify({
                    method: 'finalResult',
                    params: { finalScores },
                })
            )
        },
    }
}

function setSubmission(game, url, text, playerId) {
    game.submissions.push({
        url,
        text,
        playerId,
    })

    if (game.submissions.length === game.playerKeys.length) {
        shuffle(game.submissions)
        game.playerKeys.forEach(player => {
            game[player].sendChoices(game.submissions)
        })
    }
}

function newRound(game) {
    game.submissions = []
    game.totalVotes = 0

    const prompt = getPrompt(game)

    game.playerKeys.forEach(player => {
        game[player].prompt(prompt.id, prompt.text, prompt.url, prompt.site)
    })

    sendRound(game)
    sendScores(game)
    timer(roundSeconds, 'forceVote', game)
}

function sendScores(game) {
    const scores = []
    game.playerKeys.forEach(player => {
        scores.push({
            name: game[player].name,
            score: game[player].score,
        })
    })

    game.playerKeys.forEach(player => {
        game[player].scores(scores)
    })
}

function sendRound(game) {
    game.playerKeys.forEach(player => {
        game[player].round(game.currentRound, game.maxRounds, roundSeconds)
    })
}

function getPrompt(currentGame) {
    if (currentGame.remainingPrompts.length <= 0) {
        for (let i = 0; i < Object.keys(prompts).length; i++)
            currentGame.remainingPrompts.push(i)
    }

    const remainingPromptsIndex = Math.floor(
        currentGame.remainingPrompts.length * Math.random()
    )
    const randomPrompt = currentGame.remainingPrompts[remainingPromptsIndex]
    currentGame.remainingPrompts.splice(remainingPromptsIndex, 1)
    return prompts[randomPrompt]
}

function timer(timeInSeconds, event, game) {
    if (game.clock) clearInterval(game.clock)

    const bonusSeconds = 2

    let endTime = timeInSeconds + bonusSeconds

    game.clock = setInterval(() => {
        endTime--

        if (endTime < 0) {
            myEmitter.emit(event, game)
            clearInterval(game.clock)
        }
    }, 1000)
}

myEmitter.on('forceVote', game => {
    const didntVote = game.playerKeys.slice()

    game.submissions.forEach(item => {
        const index = didntVote.indexOf(item.playerId)
        didntVote.splice(index, 1)
    })

    didntVote.forEach(playerId => {
        game[playerId].forceVote()
    })
})

function shuffle(array) {
    let randomIndex = 0
    let hold = 0

    for (let i = 1; i < array.length; i++) {
        randomIndex = Math.floor(Math.random() * i)
        hold = array[i]
        array[i] = array[randomIndex]
        array[randomIndex] = hold
    }
}

function sendTrue(id, ws) {
    ws.send(
        JSON.stringify({
            id,
            result: true,
        })
    )
}

function sendFalse(id, ws) {
    ws.send(
        JSON.stringify({
            id,
            result: false,
        })
    )
}

function log(message) {
    console.log(`-- ${message}`)
}

wss.on('connection', function connection(ws, req) {
    const user = {
        ip: req.connection.remoteAddress,
        id: ++playerIdIndex,
        currentGame: null,
    }
    log(`Client connection established from: ${user.ip} (${user.id})`)

    ws.on('close', () => {
        if (user.currentGame) {
            const idIndex = user.currentGame.playerKeys.indexOf(user.id)
            user.currentGame.playerKeys.splice(idIndex, 1)

            delete user.currentGame[user.id]

            user.currentGame.playerKeys.forEach(player =>
                user.currentGame[player].playerLeft(user.name)
            )

            if (
                user.currentGame.leader === user.id &&
                user.currentGame.playerKeys.length > 0
            ) {
                user.currentGame.leader = user.currentGame.playerKeys[0]
                user.currentGame[user.currentGame.leader].setLeader()
            } else if (!user.currentGame.playerKeys.length)
                delete runningGames[user.currentGame.roomId]

            sendScores(user.currentGame)
        }
        log(`User "${user.name}" disconnected. (ip: ${user.ip} id: ${user.id})`)
    })

    ws.on('message', function incoming(data) {
        log(`Received: ${data}`)

        const message = JSON.parse(data)

        if (message.method === 'newGame') {
            const roomId = 'game' + ++roomIdIndex

            user.roomId = roomId
            user.isGameLeader = true

            runningGames[roomId] = {
                roomId,
                maxRounds: maxRounds,
                currentRound: 0,
                remainingPrompts: [],
                playerKeys: [user.id],
                leader: user.id,
                hasGameBegun: false,
                submissions: [],
                totalVotes: 0,
            }

            for (let i = 0; i < Object.keys(prompts).length; i++)
                runningGames[roomId].remainingPrompts.push(i)

            user.currentGame = runningGames[roomId]

            newPlayer(user, ws)

            ws.send(
                JSON.stringify({
                    method: 'joinedLobby',
                    params: {
                        roomId,
                        isGameLeader: true,
                        players: [],
                    },
                })
            )
            sendTrue(message.id, ws)
        }

        if (message.method === 'joinLobby') {
            const roomId = message.params.roomId

            if (runningGames[roomId] && !runningGames[roomId].hasGameBegun) {
                user.roomId = roomId
                user.isGameLeader = false

                user.currentGame = runningGames[roomId]

                newPlayer(user, ws)

                user.currentGame.playerKeys.push(user.id)

                const players = []

                user.currentGame.playerKeys.forEach(key => {
                    if (user.currentGame[key].name)
                        players.push(user.currentGame[key])
                })

                ws.send(
                    JSON.stringify({
                        method: 'joinedLobby',
                        params: {
                            roomId,
                            isGameLeader: false,
                            players,
                        },
                    })
                )
                sendTrue(message.id, ws)
            } else {
                sendFalse(message.id, ws)
            }
        }

        if (message.method === 'setName') {
            const isUsernameTaken = user.currentGame.playerKeys
                .map(player => {
                    return user.currentGame[player].name
                })
                .indexOf(message.params.username)

            if (isUsernameTaken === -1) {
                user.name = message.params.username

                user.currentGame[user.id].name = user.name
                user.currentGame[user.id].score = 0

                user.currentGame.playerKeys.forEach(player =>
                    user.currentGame[player].playerJoined(user.name)
                )
                sendTrue(message.id, ws)
            } else {
                sendFalse(message.id, ws)
            }
        }

        if (message.method === 'startGame') {
            if (
                user.id !== user.currentGame.leader ||
                user.currentGame.playerKeys.length < 2
            ) {
                sendFalse(message.id, ws)
                return
            }

            user.currentGame.hasGameBegun = true

            // refresh information from old games
            user.currentGame.currentRound = 1
            user.currentGame.submissions = []
            user.currentGame.playerKeys.forEach(player => {
                user.currentGame[player].score = 0
                user.currentGame[player].gameStarted()
            })

            newRound(user.currentGame)

            sendTrue(message.id, ws)
        }

        if (message.method === 'setSubmission') {
            setSubmission(
                user.currentGame,
                message.params.submissionUrl,
                message.params.gifText,
                user.id
            )
            sendTrue(message.id, ws)
        }

        if (message.method === 'vote') {
            if (!user.currentGame.submissions[message.params.voteIndex].votes)
                user.currentGame.submissions[message.params.voteIndex].votes = 1
            else user.currentGame.submissions[message.params.voteIndex].votes++

            user.currentGame.totalVotes++

            if (
                user.currentGame.totalVotes ===
                user.currentGame.playerKeys.length
            ) {
                user.currentGame.submissions.forEach(item => {
                    item.player = user.currentGame[item.playerId].name
                    if (!item.votes) item.votes = 0
                })

                user.currentGame.submissions.sort((a, b) => {
                    if (a.votes < b.votes) return 1
                    if (a.votes > b.votes) return -1
                    return 0
                })

                const winningNumberOfVotes =
                    user.currentGame.submissions[0].votes

                user.currentGame.submissions.forEach(item => {
                    if (item.votes === winningNumberOfVotes)
                        user.currentGame[item.playerId].score++
                })

                user.currentGame.playerKeys.forEach(player => {
                    user.currentGame[player].result(
                        user.currentGame.submissions
                    )
                })
                sendScores(user.currentGame)
            }
            sendTrue(message.id, ws)
        }

        if (message.method === 'newRound') {
            if (
                user.id !== user.currentGame.leader ||
                user.currentGame.playerKeys.length < 2 ||
                user.currentGame.currentRound >= user.currentGame.maxRounds
            ) {
                sendFalse(message.id, ws)
                return
            }

            user.currentGame.currentRound++

            user.currentGame.playerKeys.forEach(player =>
                user.currentGame[player].newRound()
            )

            newRound(user.currentGame)

            sendTrue(message.id, ws)
        }

        if (message.method === 'endGame') {
            if (
                user.id === user.currentGame.leader &&
                user.currentGame.currentRound >= user.currentGame.maxRounds
            ) {
                const finalScores = []
                user.currentGame.playerKeys.forEach(player => {
                    finalScores.push({
                        name: user.currentGame[player].name,
                        score: user.currentGame[player].score,
                    })
                })

                finalScores.sort((a, b) => {
                    if (a.score < b.score) return 1
                    if (a.score > b.score) return -1
                    return 0
                })

                user.currentGame.playerKeys.forEach(player => {
                    user.currentGame[player].finalResult(finalScores)
                })

                sendTrue(message.id, ws)
            } else sendFalse(message.id, ws)
        }
    })
})
