import React, { Component } from 'react'
import Staging from './Staging.js'
import Lobby from './Lobby.js'
import Game from './Game.js'
import Podium from './Podium.js'
import headerImg from './headerImg.png'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            view: 'staging',
            roomId: '',
            isGameLeader: false,
            players: [],
            finalScores: [],
        }
    }

    componentDidMount() {
        this.joinedLobby = event => {
            this.setState({
                view: 'lobby',
                roomId: event.detail.roomId,
                isGameLeader: event.detail.isGameLeader,
                players: event.detail.players,
            })
            console.log('entered lobby')
        }
        this.props.server.addEventListener('joinedLobby', this.joinedLobby)

        this.gameStarted = () => {
            this.setState({ view: 'game' })
            console.log('game started')
        }
        this.props.server.addEventListener('gameStarted', this.gameStarted)

        this.playerJoined = event => {
            const currentPlayers = this.state.players.slice()
            currentPlayers.push({ name: event.detail.name })
            this.setState({ players: currentPlayers })
            console.log('player joined:', event.detail.name)
        }
        this.props.server.addEventListener('playerJoined', this.playerJoined)

        this.playerLeft = event => {
            const currentPlayers = this.state.players.slice()
            const index = currentPlayers
                .map(player => {
                    return player.name
                })
                .indexOf(event.detail.name)

            if (index > -1) {
                currentPlayers.splice(index, 1)
                this.setState({ players: currentPlayers })
                console.log('player left:', event.detail.name)
            }
        }
        this.props.server.addEventListener('playerLeft', this.playerLeft)

        this.setLeader = event => {
            this.setState({ isGameLeader: event.detail.isGameLeader })
            console.log('you are now the game leader')
        }
        this.props.server.addEventListener('setLeader', this.setLeader)

        this.finalResult = event => {
            const finalScores = event.detail.finalScores
            this.setState({ view: 'podium', finalScores })
        }
        this.props.server.addEventListener('finalResult', this.finalResult)

        this.exitGame = event => {
            this.setState({
                view: 'staging',
                roomId: '',
                isGameLeader: false,
                players: [],
                finalScores: [],
            })
        }
        this.props.server.addEventListener('exitGame', this.exitGame)
    }

    componentWillUnmount() {
        this.props.server.removeEventListener('joinedLobby', this.joinedLobby)
        this.joinedLobby = null

        this.props.server.removeEventListener('gameStarted', this.gameStarted)
        this.gameStarted = null

        this.props.server.removeEventListener('playerJoined', this.playerJoined)
        this.playerJoined = null

        this.props.server.removeEventListener('playerLeft', this.playerLeft)
        this.playerLeft = null

        this.props.server.removeEventListener('setLeader', this.setLeader)
        this.setLeader = null

        this.props.server.removeEventListener('finalResult', this.finalResult)
        this.finalResult = null

        this.props.server.removeEventListener('exitGame', this.exitGame)
        this.exitGame = null
    }

    onInput(event) {
        this.setState({ roomId: event.target.value })
    }

    render() {
        let currentScreen

        if (this.state.view === 'staging')
            currentScreen = <Staging server={this.props.server} />
        else if (this.state.view === 'lobby')
            currentScreen = (
                <Lobby
                    roomId={this.state.roomId}
                    isGameLeader={this.state.isGameLeader}
                    players={this.state.players}
                    server={this.props.server}
                />
            )
        else if (this.state.view === 'game')
            currentScreen = (
                <Game
                    isGameLeader={this.state.isGameLeader}
                    server={this.props.server}
                />
            )
        else if (this.state.view === 'podium')
            currentScreen = (
                <Podium
                    finalScores={this.state.finalScores}
                    players={this.state.players}
                    isGameLeader={this.state.isGameLeader}
                    server={this.props.server}
                />
            )

        return (
            <div className="App">
                <div className="Header">
                    <img src={headerImg} alt="GIF BATTLE" />
                </div>
                {currentScreen}
            </div>
        )
    }
}

export default App
