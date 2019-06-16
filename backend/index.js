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
        name: undefined,
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
        forceSubmit: () => {
            ws.send(
                JSON.stringify({
                    method: 'forceSubmit',
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

function removePlayer(roomId, userId, userName) {
    const idIndex = runningGames[roomId].playerKeys.indexOf(userId)
    runningGames[roomId].playerKeys.splice(idIndex, 1)

    delete runningGames[roomId][userId]

    runningGames[roomId].playerKeys.forEach(player =>
        runningGames[roomId][player].playerLeft(userName)
    )

    if (
        runningGames[roomId].leader === userId &&
        runningGames[roomId].playerKeys.length > 0
    ) {
        runningGames[roomId].leader = runningGames[roomId].playerKeys[0]
        runningGames[roomId][runningGames[roomId].leader].setLeader()
    } else if (!runningGames[roomId].playerKeys.length)
        delete runningGames[runningGames[roomId].roomId]

    if (runningGames[roomId]) sendScores(runningGames[roomId])
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
    timer(roundSeconds, 'forceSubmit', game)
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

myEmitter.on('forceSubmit', game => {
    // BOOKMARK - SEE WHEN FORCESUBMIT IS BEING IMPLEMENTED
    const didntVote = game.playerKeys.slice()

    game.submissions.forEach(item => {
        const index = didntVote.indexOf(item.playerId)
        didntVote.splice(index, 1)
    })

    didntVote.forEach(playerId => {
        game[playerId].forceSubmit()
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
        if (
            user.currentGame &&
            user.currentGame.playerKeys.indexOf(user.id) > -1
        )
            removePlayer(user.currentGame.roomId, user.id, user.name)

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
            if (user.currentGame.hasGameBegun) {
                sendFalse(message.id, ws)
                return
            }

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

            const unnamedPlayers = []

            user.currentGame.playerKeys.forEach(player => {
                if (!user.currentGame[player].name) {
                    unnamedPlayers.push(player)
                }
            })
            unnamedPlayers.forEach(player =>
                removePlayer(user.currentGame.roomId, player)
            )

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
            // BOOKMARK
            console.log(
                `Player ${user.name}: ${JSON.stringify(
                    user.currentGame.submissions
                )}`
            )

            if (!message.params.submissionUrl)
                removePlayer(user.currentGame.roomId, user.id)
            else
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
